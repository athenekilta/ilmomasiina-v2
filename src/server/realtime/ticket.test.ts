import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  canonicalOrigin,
  issueTicket,
  verifyTicket,
  TICKET_TTL_MS,
} from "./ticket";
import { parseClientMessage, parseDatabaseChange } from "./protocol";

const origin = "https://events.example";
const secret = "test-only-live-secret";
const now = 1_000_000;

test("tickets round-trip anonymous and all current roles, expire in at most 60 seconds", () => {
  for (const identity of [
    { userId: null, role: null },
    ...(["user", "event_editor", "superadmin"] as const).map((role) => ({
      userId: "own-id",
      role,
    })),
  ]) {
    const result = issueTicket(identity, origin, secret, now);
    assert.equal(result.expiresAt, now + TICKET_TTL_MS);
    assert.equal(
      verifyTicket(result.ticket, origin, secret, now)?.role,
      identity.role,
    );
    assert.equal(
      verifyTicket(result.ticket, origin, secret, result.expiresAt),
      null,
    );
    assert.equal(verifyTicket(result.ticket, origin, secret, now - 1), null);
  }
  const short = issueTicket(
    { userId: "own-id", role: "user" },
    origin,
    secret,
    now,
    now + 1000,
  );
  assert.equal(short.expiresAt, now + 1000);
});

test("tickets reject tampering, cross-origin use, wrong secrets and malformed claims", () => {
  const { ticket } = issueTicket(
    { userId: "own-id", role: "user" },
    origin,
    secret,
    now,
  );
  assert.equal(verifyTicket(ticket, "https://evil.example", secret, now), null);
  assert.equal(verifyTicket(ticket, origin, "different-secret", now), null);
  for (const token of [
    "",
    "abc",
    `${ticket}.extra`,
    `x${ticket}`,
    "a".repeat(3000),
  ]) {
    assert.equal(verifyTicket(token, origin, secret, now), null);
  }
  const claims = verifyTicket(ticket, origin, secret, now)!;
  for (const patch of [
    { role: "admin" },
    { userId: null },
    { userId: "" },
    { audience: "other" },
    { version: 2 },
    { expiresAt: now + TICKET_TTL_MS + 1 },
    { expiresAt: now },
    { issuedAt: now + 1 },
    { expiresAt: "2000000" },
  ]) {
    const payload = Buffer.from(
      JSON.stringify({ ...claims, ...patch }),
    ).toString("base64url");
    const mac = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");
    assert.equal(verifyTicket(`${payload}.${mac}`, origin, secret, now), null);
  }
});

test("origin is derived only from canonical HTTP(S) NEXTAUTH_URL", () => {
  assert.equal(canonicalOrigin("https://events.example/api/auth"), origin);
  for (const url of [
    undefined,
    "",
    "invalid",
    "file:///tmp/test",
    "https://user:pass@events.example",
  ]) {
    assert.throws(() => canonicalOrigin(url));
  }
});

test("strict browser subscriptions reject identifiers outside the event-level contract", () => {
  const subscription = {
    type: "subscribe",
    eventIds: [1, 1, 2],
    events: true,
    users: false,
    profile: true,
  };
  assert.deepEqual(parseClientMessage(JSON.stringify(subscription)), {
    ...subscription,
    eventIds: [1, 2],
  });
  for (const patch of [
    { eventIds: Array.from({ length: 21 }, (_, index) => index + 1) },
    { eventIds: [0] },
    { eventIds: [-1] },
    { eventIds: [1.5] },
    { eventIds: [Number.MAX_SAFE_INTEGER + 1] },
    { eventIds: ["1"] },
    { users: "true" },
    { profile: null },
    { signupId: "secret" },
    { userId: "other" },
  ])
    assert.equal(
      parseClientMessage(JSON.stringify({ ...subscription, ...patch })),
      null,
    );
  assert.equal(parseClientMessage("null"), null);
  assert.equal(parseClientMessage("{"), null);
  assert.equal(
    parseClientMessage(
      JSON.stringify({ type: "authenticate", ticket: "x".repeat(2049) }),
    ),
    null,
  );
});

test("database parser returns only the minimal internal notification shape", () => {
  assert.deepEqual(
    parseDatabaseChange(
      '{"kind":"event","eventId":7,"public":false,"email":"never-forward"}',
    ),
    { kind: "event", eventId: 7, public: false },
  );
  assert.deepEqual(parseDatabaseChange('{"kind":"session","userId":"owner"}'), {
    kind: "session",
    userId: "owner",
  });
  for (const payload of [
    "null",
    "{",
    '{"kind":"event","eventId":7}',
    '{"kind":"event","eventId":0,"public":true}',
    '{"kind":"user","userId":""}',
    '{"kind":"signup","signupId":"private"}',
  ]) {
    assert.equal(parseDatabaseChange(payload), null);
  }
});
