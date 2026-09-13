import assert from "node:assert/strict";
import { test } from "node:test";
import {
  collectScope,
  describeQuery,
  isPrivilegedQuery,
  isRealtimeQuery,
  matchesChange,
  parseChange,
  privilegesChanged,
  profileIdentity,
  type LiveQuery,
} from "./queries";

function query(path: string, input?: unknown, active = true): LiveQuery {
  return {
    queryKey: [path.split("."), { input, type: "query" }],
    isActive: () => active,
  };
}

test("scope includes enabled observed queries, not inactive caches or raffle", () => {
  assert.deepEqual(
    collectScope([
      query("events.getEventsAdmin", { includeDrafts: true }),
      query("events.getEventByID", { eventId: 4 }),
      query("events.getEventEditId", { eventId: 4 }),
      query("signups.getMySignupStatus", { eventId: 8 }),
      query("signups.getSignupByID", { eventId: 3, signupId: "secret" }),
      query("events.getEventByID", { eventId: 10 }, false),
      query("signups.exportSignupsCsv", { eventId: 11 }, false),
      query("users.getUsers"),
      query("raffle.getRaffleStatus", { eventId: 12 }),
    ]),
    { eventIds: [3, 4, 8], events: true, users: true, profile: true },
  );
});

test("empty or disabled-only scopes subscribe to profile without event or user data", () => {
  const expected = { eventIds: [], events: false, users: false, profile: true };
  assert.deepEqual(collectScope([]), expected);
  assert.deepEqual(
    collectScope([
      query("events.getEvents", undefined, false),
      query("users.getUsers", undefined, false),
      query("events.getEventByID", { eventId: 1 }, false),
    ]),
    expected,
  );
});

test("scope reacts to enabled observer changes independently of navigation", () => {
  let enabled = false;
  const sidebar = {
    ...query("signups.getMySignupStatus", { eventId: 7 }),
    isActive: () => enabled,
  };
  assert.deepEqual(collectScope([sidebar]).eventIds, []);
  enabled = true;
  assert.deepEqual(collectScope([sidebar]).eventIds, [7]);
  enabled = false;
  assert.deepEqual(collectScope([sidebar]).eventIds, []);
});

test("scope is sorted, deduplicated, capped at 20 and strips personal inputs", () => {
  const queries = Array.from({ length: 25 }, (_, i) =>
    query("signups.getSignupByID", {
      eventId: 25 - i,
      signupId: "secret-id",
      email: "private@example.com",
    }),
  );
  const scope = collectScope([...queries, queries[0]!]);
  assert.equal(scope.eventIds.length, 20);
  assert.deepEqual(
    scope.eventIds,
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
  assert.deepEqual(scope, collectScope(queries.reverse()));
  assert.equal(JSON.stringify(scope).includes("secret-id"), false);
  assert.equal(JSON.stringify(scope).includes("private@example.com"), false);
});

test("malformed keys and invalid event IDs are ignored, not coerced", () => {
  for (const eventId of [
    NaN,
    Infinity,
    -1,
    0,
    1.5,
    "2",
    null,
    undefined,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.deepEqual(
      collectScope([query("events.getEventByID", { eventId })]).eventIds,
      [],
    );
  }
  for (const queryKey of [
    [],
    ["events.getEventByID"],
    [null],
    [[1]],
    [["events", "getEventByID"], null],
  ]) {
    assert.doesNotThrow(() => describeQuery(queryKey));
    assert.deepEqual(
      collectScope([{ queryKey, isActive: () => true }]).eventIds,
      [],
    );
  }
});

for (const kind of ["event", "signups"] as const) {
  test(`${kind} changes target both lists, affected details and every signup input variant`, () => {
    const change = { kind, eventId: 7 };
    for (const path of ["events.getEvents", "events.getEventsAdmin"]) {
      assert.equal(matchesChange(query(path), change), true);
    }
    for (const path of [
      "events.getEventByID",
      "events.getEventEditId",
      "signups.getSignupByEventIds",
      "signups.getMySignupStatus",
      "signups.getSignupByID",
      "signups.exportSignupsCsv",
    ]) {
      for (const active of [true, false]) {
        assert.equal(
          matchesChange(
            query(
              path,
              { eventId: 7, signupId: "id", email: "one@example.com" },
              active,
            ),
            change,
          ),
          true,
        );
        assert.equal(
          matchesChange(
            query(
              path,
              { eventId: 8, signupId: "other", email: "two@example.com" },
              active,
            ),
            change,
          ),
          false,
        );
      }
    }
    assert.equal(
      matchesChange(
        query("signups.getSignupByID", { signupId: "legacy" }),
        change,
      ),
      true,
    );
    assert.equal(matchesChange(query("users.getUsers"), change), false);
    assert.equal(matchesChange(query("profile.get"), change), false);
  });
}

test("user/profile changes refresh both profile and users, never events", () => {
  for (const kind of ["users", "profile"] as const) {
    assert.equal(matchesChange(query("users.getUsers"), { kind }), true);
    assert.equal(matchesChange(query("profile.get"), { kind }), true);
    assert.equal(
      matchesChange(query("events.getEventsAdmin"), { kind }),
      false,
    );
  }
});

test("resync and privilege cleanup never match raffle or unrelated query families", () => {
  for (const path of [
    "raffle.getRaffleStatus",
    "raffle.getRaffleResults",
    "auth.passwordChange.validate",
    "users.other",
    "events.other",
  ]) {
    const candidate = query(path, { eventId: 7 });
    assert.equal(isRealtimeQuery(candidate), false);
    assert.equal(isPrivilegedQuery(candidate), false);
    for (const change of [
      { kind: "event", eventId: 7 },
      { kind: "signups", eventId: 7 },
      { kind: "users" },
      { kind: "profile" },
    ] as const) {
      assert.equal(matchesChange(candidate, change), false);
    }
  }
  for (const path of [
    "events.getEventsAdmin",
    "events.getEventEditId",
    "signups.getSignupByEventIds",
    "signups.exportSignupsCsv",
    "users.getUsers",
  ]) {
    assert.equal(isPrivilegedQuery(query(path)), true);
    assert.equal(isRealtimeQuery(query(path)), true);
  }
  assert.equal(isPrivilegedQuery(query("profile.get")), false);
  assert.equal(isPrivilegedQuery(query("events.getEvents")), false);
});

test("only authoritative identity/role transitions clear privileges, not ticket renewal", () => {
  const admin = { id: "one", role: "superadmin" };
  assert.equal(privilegesChanged(admin, { ...admin }), false);
  assert.equal(
    privilegesChanged(admin, { ...admin, role: "event_editor" }),
    true,
  );
  assert.equal(privilegesChanged(admin, { ...admin, id: "two" }), true);
  assert.equal(privilegesChanged(admin, null), true);
  assert.equal(privilegesChanged(null, admin), true);
  assert.equal(privilegesChanged(admin, undefined), false);
  assert.equal(privilegesChanged(undefined, admin), false);
  assert.equal(privilegesChanged(null, null), false);
  assert.deepEqual(
    profileIdentity({ ...admin, email: "private@example.com" }),
    admin,
  );
  assert.equal(profileIdentity(null), null);
  assert.equal(profileIdentity(undefined), undefined);
});

test("wire change parser accepts only supported kinds and valid event IDs", () => {
  assert.deepEqual(parseChange({ type: "change", kind: "event", eventId: 1 }), {
    kind: "event",
    eventId: 1,
  });
  assert.deepEqual(
    parseChange({ type: "change", kind: "signups", eventId: 2 }),
    { kind: "signups", eventId: 2 },
  );
  assert.deepEqual(parseChange({ type: "change", kind: "users" }), {
    kind: "users",
  });
  assert.deepEqual(parseChange({ type: "change", kind: "profile" }), {
    kind: "profile",
  });
  for (const value of [
    null,
    [],
    {},
    { type: "resync" },
    { type: "change", kind: "raffle", eventId: 1 },
    { type: "change", kind: "event", eventId: "1" },
    { type: "change", kind: "signups", eventId: -1 },
  ]) {
    assert.equal(parseChange(value), undefined);
  }
});
