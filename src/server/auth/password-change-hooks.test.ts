import assert from "node:assert/strict";
import { test } from "node:test";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { passwordChangeHooks } from "./password-change-hooks";

async function setup(failInvalidation = false) {
  const tokens = [
    { id: "first", email: "owner@example.com" },
    { id: "second", email: "owner@example.com" },
    { id: "unrelated", email: "other@example.com" },
  ];
  const invalidatedUsers: string[] = [];
  const auth = betterAuth({
    baseURL: "http://localhost:3000",
    secret: "test-only-secret-that-is-at-least-32-characters",
    database: memoryAdapter({
      user: [],
      account: [],
      session: [],
      verification: [],
    }),
    emailAndPassword: { enabled: true },
    databaseHooks: passwordChangeHooks(async (userId) => {
      invalidatedUsers.push(userId);
      if (failInvalidation) throw new Error("Token store unavailable");
      const user = await (
        await auth.$context
      ).internalAdapter.findUserById(userId);
      assert.ok(user);
      for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i]?.email === user.email) tokens.splice(i, 1);
      }
    }),
    logger: { disabled: true },
  });
  const signup = await auth.api.signUpEmail({
    body: {
      name: "Owner",
      email: "owner@example.com",
      password: "old-password",
    },
  });
  async function signIn(password = "old-password") {
    return auth.api.signInEmail({
      body: { email: "owner@example.com", password },
      asResponse: true,
    });
  }
  const first = await signIn();
  const second = await signIn();
  function headers(response: Response) {
    const cookie = response.headers.get("set-cookie");
    assert.ok(cookie);
    return new Headers({ cookie: cookie.split(";")[0]! });
  }
  return {
    auth,
    tokens,
    invalidatedUsers,
    userId: signup.user.id,
    headers: headers(first),
    otherHeaders: headers(second),
    signIn,
  };
}

test("direct password change invalidates all owner tokens and revokes other sessions", async () => {
  const fixture = await setup();
  const result = await fixture.auth.api.changePassword({
    headers: fixture.headers,
    body: {
      currentPassword: "old-password",
      newPassword: "new-password",
      revokeOtherSessions: true,
    },
  });
  assert.deepEqual(fixture.invalidatedUsers, [fixture.userId]);
  assert.deepEqual(fixture.tokens, [
    { id: "unrelated", email: "other@example.com" },
  ]);
  assert.ok(result.token, "Better Auth supplies a replacement session");
  assert.equal(
    await fixture.auth.api.getSession({ headers: fixture.otherHeaders }),
    null,
  );
  assert.equal((await fixture.signIn("new-password")).status, 200);
  assert.equal((await fixture.signIn("old-password")).status, 401);
});

for (const scenario of [
  "wrong password",
  "short password",
  "unauthenticated",
] as const) {
  test(`${scenario} does not invalidate tokens`, async () => {
    const fixture = await setup();
    await assert.rejects(
      fixture.auth.api.changePassword({
        headers:
          scenario === "unauthenticated" ? new Headers() : fixture.headers,
        body: {
          currentPassword:
            scenario === "wrong password"
              ? "incorrect-password"
              : "old-password",
          newPassword: scenario === "short password" ? "short" : "new-password",
          revokeOtherSessions: true,
        },
      }),
    );
    assert.deepEqual(fixture.invalidatedUsers, []);
    assert.equal(fixture.tokens.length, 3);
    assert.equal((await fixture.signIn()).status, 200);
  });
}

test("invalidation cannot be bypassed by omitting session revocation", async () => {
  const fixture = await setup();
  await fixture.auth.api.changePassword({
    headers: fixture.headers,
    body: {
      currentPassword: "old-password",
      newPassword: "new-password",
    },
  });
  assert.deepEqual(fixture.invalidatedUsers, [fixture.userId]);
  assert.deepEqual(fixture.tokens, [
    { id: "unrelated", email: "other@example.com" },
  ]);
  assert.ok(
    await fixture.auth.api.getSession({ headers: fixture.otherHeaders }),
  );
});

test("token invalidation failure prevents the password write", async () => {
  const fixture = await setup(true);
  await assert.rejects(
    fixture.auth.api.changePassword({
      headers: fixture.headers,
      body: {
        currentPassword: "old-password",
        newPassword: "new-password",
        revokeOtherSessions: true,
      },
    }),
  );
  assert.deepEqual(fixture.invalidatedUsers, [fixture.userId]);
  assert.equal(fixture.tokens.length, 3);
  assert.equal((await fixture.signIn()).status, 200);
  assert.equal((await fixture.signIn("new-password")).status, 401);
});
