import assert from "node:assert/strict";
import { EventEmitter, once } from "node:events";
import { get } from "node:http";
import type { AddressInfo } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import test, { type TestContext } from "node:test";
import { WebSocket } from "ws";
import { createGateway, type GatewayOptions } from "./gateway";
import type { LiveListener } from "./listener";
import type { DatabaseChange, ServerMessage, Subscription } from "./protocol";
import { issueTicket, type LiveIdentity } from "./ticket";

const origin = "https://events.example";
const secret = "test-only-live-secret";
const publicIdentity = { userId: null, role: null };
const subscription: Subscription = {
  type: "subscribe",
  eventIds: [1],
  events: false,
  users: false,
  profile: false,
};
class FakeListener extends EventEmitter implements LiveListener {
  ready = true;
  start() {}
  async stop() {
    this.ready = false;
  }
  notify(change: DatabaseChange) {
    this.emit("change", change);
  }
  down() {
    this.ready = false;
    this.emit("unavailable");
  }
  up() {
    this.ready = true;
    this.emit("ready");
  }
}
async function until(check: () => boolean) {
  const deadline = Date.now() + 3000;
  while (!check()) {
    if (Date.now() >= deadline)
      assert.fail("Timed out waiting for gateway output");
    await delay(5);
  }
}
async function fixture(
  t: TestContext,
  overrides: Partial<Omit<GatewayOptions, "listener">> & {
    listener?: FakeListener;
  } = {},
) {
  const listener = overrides.listener ?? new FakeListener();
  const gateway = createGateway({
    listener,
    nextAuthUrl: origin,
    secret,
    coalesceMs: 10,
    closeGraceMs: 20,
    ...overrides,
  });
  await gateway.listen(0);
  t.after(() => gateway.close());
  const port = (gateway.http.address() as AddressInfo).port;
  const url = `ws://127.0.0.1:${port}/api/live`;
  async function connect(
    identity?: LiveIdentity,
    scopes = subscription,
    expiresAt?: number,
  ) {
    const ws = new WebSocket(url, { origin });
    const messages: ServerMessage[] = [];
    let closeCode: number | undefined;
    ws.on("message", (data) =>
      messages.push(JSON.parse(data.toString()) as ServerMessage),
    );
    ws.on("close", (code) => {
      closeCode = code;
    });
    ws.on("error", () => undefined);
    await once(ws, "open");
    if (identity) {
      ws.send(
        JSON.stringify({
          type: "authenticate",
          ticket: issueTicket(identity, origin, secret, Date.now(), expiresAt)
            .ticket,
        }),
      );
      ws.send(JSON.stringify(scopes));
      await until(() => messages.some((message) => message.type === "ready"));
      messages.length = 0;
    }
    return { ws, messages, closed: () => closeCode };
  }
  const health = () =>
    new Promise<number | undefined>((resolve, reject) => {
      get(`http://127.0.0.1:${port}/health`, (res) => {
        res.resume();
        resolve(res.statusCode);
      }).on("error", reject);
    });
  return { listener, gateway, url, connect, health };
}
async function rejected(url: string, headers: Record<string, string>) {
  return new Promise<number>((resolve, reject) => {
    const ws = new WebSocket(url, { headers });
    ws.on("unexpected-response", (_req, res) => {
      res.resume();
      ws.terminate();
      resolve(res.statusCode!);
    });
    ws.on("error", () => undefined);
    ws.on("open", () => {
      ws.terminate();
      reject(new Error("Unexpected upgrade success"));
    });
  });
}

test("health waits for LISTEN and upgrades require exact path and canonical Origin", async (t) => {
  const listener = new FakeListener();
  listener.ready = false;
  const f = await fixture(t, { listener });
  assert.equal(await f.health(), 503);
  assert.equal(await rejected(f.url, { origin }), 503);
  const beforeListen = issueTicket(publicIdentity, origin, secret).ticket;
  listener.up();
  assert.equal(await f.health(), 200);
  const replay = await f.connect();
  replay.ws.send(
    JSON.stringify({ type: "authenticate", ticket: beforeListen }),
  );
  await until(() => replay.closed() !== undefined);
  assert.equal(replay.closed(), 4401);
  for (const headers of [
    {},
    { origin: "null" },
    {
      origin: "https://evil.example",
      "x-forwarded-host": "events.example",
      "x-forwarded-proto": "https",
    },
  ]) {
    assert.equal(await rejected(f.url, headers as Record<string, string>), 403);
  }
  assert.equal(await rejected(`${f.url}?ticket=not-allowed`, { origin }), 404);
});

test("authenticate first, acknowledge only after subscribe, and enforce auth deadlines", async (t) => {
  const f = await fixture(t, { authTimeoutMs: 80 });
  const idle = await f.connect();
  const missing = await f.connect();
  missing.ws.send(JSON.stringify(subscription));
  await until(() => missing.closed() !== undefined);
  assert.equal(missing.closed(), 4401);
  const authenticated = await f.connect();
  authenticated.ws.send(
    JSON.stringify({
      type: "authenticate",
      ticket: issueTicket(publicIdentity, origin, secret).ticket,
    }),
  );
  await delay(20);
  assert.deepEqual(authenticated.messages, []);
  authenticated.ws.send(JSON.stringify(subscription));
  await until(() => authenticated.messages.length === 1);
  assert.deepEqual(authenticated.messages, [{ type: "ready" }]);
  await until(() => idle.closed() !== undefined);
  assert.equal(idle.closed(), 4401);
});

test("event visibility, scoped subscriptions, list scope and coalescing never leak draft IDs", async (t) => {
  const f = await fixture(t, { coalesceMs: 30 });
  const publicClient = await f.connect(publicIdentity);
  const user = await f.connect({ userId: "user", role: "user" });
  const editor = await f.connect(
    { userId: "editor", role: "event_editor" },
    { ...subscription, eventIds: [1, 2] },
  );
  const admin = await f.connect(
    { userId: "admin", role: "superadmin" },
    { ...subscription, events: true },
  );
  const list = await f.connect(publicIdentity, {
    ...subscription,
    eventIds: [],
    events: true,
  });
  for (let index = 0; index < 20; index++)
    f.listener.notify({ kind: "event", eventId: 1, public: true });
  f.listener.notify({ kind: "signups", eventId: 1, public: true });
  f.listener.notify({ kind: "event", eventId: 2, public: false });
  f.listener.notify({ kind: "signups", eventId: 2, public: false });
  f.listener.notify({ kind: "event", eventId: 3, public: true });
  await until(() => admin.messages.length === 5);
  const expected = [
    { type: "change", kind: "event", eventId: 1 },
    { type: "change", kind: "signups", eventId: 1 },
  ];
  assert.deepEqual(publicClient.messages, expected);
  assert.deepEqual(user.messages, expected);
  assert.equal(editor.messages.length, 4);
  assert.deepEqual(list.messages, [
    ...expected,
    { type: "change", kind: "event", eventId: 3 },
  ]);
  // An unpublish/removal uses public=true even though the row is now private.
  publicClient.messages.length = 0;
  f.listener.notify({ kind: "event", eventId: 1, public: true });
  await until(() => publicClient.messages.length === 1);
  assert.deepEqual(publicClient.messages, [expected[0]]);
});

test("subscription replacement clears old queued hints and always acknowledges ready", async (t) => {
  const f = await fixture(t, { coalesceMs: 100 });
  const client = await f.connect(publicIdentity);
  f.listener.notify({ kind: "event", eventId: 1, public: true });
  client.ws.send(JSON.stringify({ ...subscription, eventIds: [2] }));
  await until(() => client.messages.length === 1);
  assert.deepEqual(client.messages, [{ type: "ready" }]);
  f.listener.notify({ kind: "event", eventId: 1, public: true });
  f.listener.notify({ kind: "event", eventId: 2, public: true });
  await until(() => client.messages.length === 2);
  assert.deepEqual(client.messages[1], {
    type: "change",
    kind: "event",
    eventId: 2,
  });
});

test("auth changes close only the affected user and emit generic hints only to users admins", async (t) => {
  const f = await fixture(t);
  const owner = await f.connect(
    { userId: "private-owner", role: "event_editor" },
    { ...subscription, profile: true },
  );
  const admin = await f.connect(
    { userId: "admin", role: "superadmin" },
    { ...subscription, users: true },
  );
  const unscopedAdmin = await f.connect({
    userId: "other-admin",
    role: "superadmin",
  });
  const editor = await f.connect(
    { userId: "editor", role: "event_editor" },
    { ...subscription, users: true, profile: true },
  );
  const anonymous = await f.connect(publicIdentity, {
    ...subscription,
    users: true,
    profile: true,
  });
  const oldTicket = issueTicket(
    { userId: "private-owner", role: "event_editor" },
    origin,
    secret,
  ).ticket;
  f.listener.notify({ kind: "user", userId: "private-owner" });
  await until(() => owner.closed() === 4401 && admin.messages.length === 1);
  assert.deepEqual(owner.messages, [{ type: "reauthenticate" }]);
  assert.deepEqual(admin.messages, [{ type: "change", kind: "users" }]);
  for (const client of [unscopedAdmin, editor, anonymous]) {
    assert.deepEqual(client.messages, []);
    assert.equal(client.closed(), undefined);
  }
  const replay = await f.connect();
  replay.ws.send(JSON.stringify({ type: "authenticate", ticket: oldTicket }));
  await until(() => replay.closed() !== undefined);
  assert.equal(replay.closed(), 4401);

  // One account's auth activity must not invalidate tickets already issued to
  // unrelated users or anonymous visitors.
  const unrelatedTicket = issueTicket(
    { userId: "unrelated-user", role: "user" },
    origin,
    secret,
  ).ticket;
  const anonymousTicket = issueTicket(publicIdentity, origin, secret).ticket;
  f.listener.notify({ kind: "session", userId: "another-user" });
  for (const ticket of [unrelatedTicket, anonymousTicket]) {
    const unrelated = await f.connect();
    unrelated.ws.send(JSON.stringify({ type: "authenticate", ticket }));
    unrelated.ws.send(JSON.stringify(subscription));
    await until(() =>
      unrelated.messages.some((message) => message.type === "ready"),
    );
    assert.equal(unrelated.closed(), undefined);
    unrelated.ws.close();
  }

  await delay(2);
  const fresh = await f.connect({ userId: "private-owner", role: "user" });
  f.listener.notify({ kind: "session", userId: "private-owner" });
  await until(() => fresh.closed() !== undefined);
  assert.equal(fresh.closed(), 4401);
  assert.ok(!JSON.stringify(admin.messages).includes("private-owner"));
});

test("ticket expiry closes the socket and requires a new bootstrap", async (t) => {
  const f = await fixture(t);
  const client = await f.connect(
    publicIdentity,
    subscription,
    Date.now() + 100,
  );
  await until(() => client.closed() !== undefined);
  assert.equal(client.closed(), 4401);
  assert.deepEqual(client.messages, [{ type: "reauthenticate" }]);
});

test("listener outages close 1013, reject upgrades, invalidate old tickets and restore health", async (t) => {
  const f = await fixture(t);
  const client = await f.connect(publicIdentity);
  const oldTicket = issueTicket(publicIdentity, origin, secret).ticket;
  f.listener.down();
  assert.equal(await f.health(), 503);
  await until(() => client.closed() !== undefined);
  assert.equal(client.closed(), 1013);
  assert.equal(await rejected(f.url, { origin }), 503);
  f.listener.up();
  assert.equal(await f.health(), 200);
  const replay = await f.connect();
  replay.ws.send(JSON.stringify({ type: "authenticate", ticket: oldTicket }));
  await until(() => replay.closed() !== undefined);
  assert.equal(replay.closed(), 4401);
  await delay(2);
  const fresh = await f.connect(publicIdentity);
  f.listener.up();
  await until(() => fresh.messages.length === 1);
  assert.deepEqual(fresh.messages, [{ type: "resync" }]);
});

test("bounded pending hints fall back to resync rather than retaining unbounded event IDs", async (t) => {
  const f = await fixture(t, { maxPendingChanges: 2 });
  const client = await f.connect(publicIdentity, {
    ...subscription,
    events: true,
  });
  for (let eventId = 1; eventId <= 1000; eventId++)
    f.listener.notify({ kind: "event", eventId, public: true });
  await until(() => client.messages.length > 0);
  assert.deepEqual(client.messages, [{ type: "resync" }]);
});

test("reject malformed/binary/oversized messages, excessive rates and excess connections", async (t) => {
  const f = await fixture(t, {
    maxConnections: 1,
    messageBurst: 3,
    messagesPerSecond: 0,
  });
  const first = await f.connect(publicIdentity);
  assert.equal(await rejected(f.url, { origin }), 503);
  first.ws.send(JSON.stringify(subscription));
  first.ws.send(JSON.stringify(subscription));
  await until(() => first.closed() !== undefined);
  assert.equal(first.closed(), 1008);
  for (const [data, binary, code] of [
    ["{", false, 1008],
    ["{}", true, 1008],
    ["x".repeat(4097), false, 1009],
  ] as const) {
    const client = await f.connect();
    client.ws.send(data, { binary });
    await until(() => client.closed() !== undefined);
    assert.equal(client.closed(), code);
  }
});

test("slow output consumers are closed and unresponsive heartbeat peers are terminated", async (t) => {
  const limited = await fixture(t, { maxBufferedBytes: 1 });
  const client = await limited.connect();
  client.ws.send(
    JSON.stringify({
      type: "authenticate",
      ticket: issueTicket(publicIdentity, origin, secret).ticket,
    }),
  );
  client.ws.send(JSON.stringify(subscription));
  await until(() => client.closed() !== undefined);
  assert.equal(client.closed(), 1013);
  const f = await fixture(t, { heartbeatMs: 20 });
  const ws = new WebSocket(f.url, { origin, autoPong: false });
  const closed = once(ws, "close");
  await once(ws, "open");
  const [code] = await closed;
  assert.equal(code, 1006);
});
