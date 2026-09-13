import assert from "node:assert/strict";
import test from "node:test";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  assertUserSessionOrigin,
  createUserSessionContext,
  hashToken,
  isToken,
  newToken,
  normalizeEmail,
  setSessionCookie,
} from "./request";

function response() {
  const headers = new Map<string, string | string[]>();
  return {
    getHeader: (name: string) => headers.get(name),
    setHeader: (name: string, value: string | string[]) => {
      headers.set(name, value);
    },
    headers,
  } as unknown as NextApiResponse & {
    headers: Map<string, string | string[]>;
  };
}

test("tokens are random opaque values stored by hash", () => {
  const first = newToken();
  const second = newToken();
  assert.equal(isToken(first), true);
  assert.notEqual(first, second);
  assert.notEqual(hashToken(first), first);
  assert.equal(hashToken(first), hashToken(first));
});

test("user sessions require an exact trusted POST origin", () => {
  const previous = process.env.NEXTAUTH_URL;
  process.env.NEXTAUTH_URL = "http://localhost:3000";
  try {
    const res = response();
    const valid = createUserSessionContext(
      {
        method: "POST",
        headers: { origin: "http://localhost:3000" },
        cookies: {},
      } as NextApiRequest,
      res,
    );
    assert.doesNotThrow(() => assertUserSessionOrigin(valid));

    const foreign = createUserSessionContext(
      {
        method: "POST",
        headers: { origin: "http://evil.example" },
        cookies: {},
      } as NextApiRequest,
      res,
    );
    assert.throws(() => assertUserSessionOrigin(foreign));
  } finally {
    process.env.NEXTAUTH_URL = previous;
  }
});

test("session cookie is isolated from Better Auth cookies", () => {
  const res = response();
  res.setHeader("Set-Cookie", "better-auth.session=admin; Path=/; HttpOnly");
  const context = createUserSessionContext(
    { cookies: {}, headers: {} } as NextApiRequest,
    res,
  );
  const token = newToken();
  setSessionCookie(context, token, new Date("2030-01-01T00:00:00Z"));
  const cookies = res.headers.get("Set-Cookie");
  assert.ok(Array.isArray(cookies));
  assert.equal(cookies.length, 2);
  assert.match(cookies[1]!, /^user-session=/);
  assert.match(cookies[1]!, /HttpOnly; SameSite=Lax/);
});

test("email identity keys are normalized", () => {
  assert.equal(normalizeEmail(" Person@Example.COM "), "person@example.com");
  assert.throws(() => normalizeEmail("not-an-email"));
});
