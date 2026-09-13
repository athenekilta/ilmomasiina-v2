import assert from "node:assert/strict";
import test from "node:test";
import type { NextApiRequest, NextApiResponse } from "next";
import { createLiveSessionHandler } from "./bootstrap";
import { verifyTicket } from "./ticket";

const origin = "https://events.example";
const secret = "test-only-secret";
const time = 1_000_000;
function response() {
  const result = {
    statusCode: 0,
    headers: {} as Record<string, unknown>,
    body: undefined as unknown,
  };
  const res = {
    setHeader(key: string, value: unknown) {
      result.headers[key] = value;
    },
    status(code: number) {
      result.statusCode = code;
      return res;
    },
    end() {
      return res;
    },
    json(body: unknown) {
      result.body = body;
      return res;
    },
  };
  return { result, res: res as unknown as NextApiResponse };
}
function request(
  method = "POST",
  headers: Record<string, string> = { origin },
) {
  return { method, headers } as NextApiRequest;
}

test("bootstrap issues no-store anonymous and authenticated tickets without disclosing session tokens", async () => {
  for (const identity of [
    null,
    {
      userId: "own-user",
      role: "event_editor" as const,
      expiresAt: time + 500,
    },
  ]) {
    const handler = createLiveSessionHandler({
      config: () => ({ nextAuthUrl: `${origin}/api/auth`, secret }),
      identity: async () => identity,
      now: () => time,
    });
    const { result, res } = response();
    await handler(request(), res);
    assert.equal(result.statusCode, 200);
    assert.equal(result.headers["Cache-Control"], "no-store");
    assert.equal(result.headers.Vary, "Cookie, Origin");
    const body = result.body as { ticket: string; expiresAt: number };
    assert.deepEqual(Object.keys(body).sort(), ["expiresAt", "ticket"]);
    const claims = verifyTicket(body.ticket, origin, secret, time)!;
    assert.equal(claims.userId, identity?.userId ?? null);
    assert.equal(claims.role, identity?.role ?? null);
    assert.equal(claims.expiresAt, identity?.expiresAt ?? time + 60_000);
  }
});

test("bootstrap rejects GET and missing/foreign origins regardless of forwarded headers", async () => {
  let calls = 0;
  const handler = createLiveSessionHandler({
    config: () => ({ nextAuthUrl: origin, secret }),
    identity: async () => {
      calls++;
      return null;
    },
  });
  const get = response();
  await handler(request("GET"), get.res);
  assert.equal(get.result.statusCode, 405);
  assert.equal(get.result.headers.Allow, "POST");
  for (const headers of [
    {},
    { origin: "null" },
    {
      origin: "https://evil.example",
      "x-forwarded-host": "events.example",
      "x-forwarded-proto": "https",
      host: "events.example",
    },
  ]) {
    const { result, res } = response();
    await handler(request("POST", headers as Record<string, string>), res);
    assert.equal(result.statusCode, 403);
  }
  assert.equal(calls, 0);
});

test("bootstrap fails closed on auth errors and expired sessions, and bounds request rate", async () => {
  const failing = createLiveSessionHandler({
    config: () => ({ nextAuthUrl: origin, secret }),
    identity: async () => {
      throw new Error("database unavailable");
    },
  });
  const failure = response();
  await failing(request(), failure.res);
  assert.equal(failure.result.statusCode, 503);
  const expired = createLiveSessionHandler({
    config: () => ({ nextAuthUrl: origin, secret }),
    identity: async () => ({ userId: "own", role: "user", expiresAt: time }),
    now: () => time,
  });
  const expiry = response();
  await expired(request(), expiry.res);
  assert.equal(expiry.result.statusCode, 401);
  const handler = createLiveSessionHandler({
    config: () => ({ nextAuthUrl: origin, secret }),
    identity: async () => null,
    now: () => time,
  });
  for (let index = 0; index < 121; index++) {
    const { result, res } = response();
    await handler(request(), res);
    assert.equal(result.statusCode, index === 120 ? 429 : 200);
  }
});
