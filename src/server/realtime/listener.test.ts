import assert from "node:assert/strict";
import { EventEmitter, once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import {
  LIVE_CHANNEL,
  PgLiveListener,
  listenerConnectionString,
  type ListenerClient,
} from "./listener";

class FakeClient extends EventEmitter implements ListenerClient {
  queries: string[] = [];
  ended = 0;
  constructor(
    private readonly connectImpl = async () => {},
    private readonly queryImpl = async () => {},
  ) {
    super();
  }
  async connect() {
    await this.connectImpl();
  }
  async query(sql: string) {
    this.queries.push(sql);
    await this.queryImpl();
  }
  async end() {
    this.ended++;
    this.emit("end");
  }
}
const connectionString =
  "postgresql://test:password@localhost:5432/test?schema=custom&sslmode=require";

test("pg connection strips only the Prisma schema parameter", () => {
  const url = new URL(listenerConnectionString(connectionString));
  assert.equal(url.searchParams.has("schema"), false);
  assert.equal(url.searchParams.get("sslmode"), "require");
  assert.equal(url.pathname, "/test");
  assert.throws(() => listenerConnectionString("https://example.com"));
});

test("readiness follows successful LISTEN and valid channel payloads alone are emitted", async (t) => {
  let finishListen!: () => void;
  const client = new FakeClient(
    undefined,
    () =>
      new Promise<void>((resolve) => {
        finishListen = resolve;
      }),
  );
  const listener = new PgLiveListener({
    connectionString,
    createClient: () => client,
  });
  t.after(() => listener.stop());
  const changes: unknown[] = [];
  listener.on("change", (change) => changes.push(change));
  listener.start();
  await delay(0);
  assert.equal(listener.ready, false);
  assert.deepEqual(client.queries, [`LISTEN ${LIVE_CHANNEL}`]);
  client.emit("notification", {
    channel: LIVE_CHANNEL,
    payload: '{"kind":"user","userId":"before-ready"}',
  });
  const ready = once(listener, "ready");
  finishListen();
  await ready;
  assert.equal(listener.ready, true);
  for (const notification of [
    { channel: "wrong", payload: '{"kind":"event","eventId":1,"public":true}' },
    { channel: LIVE_CHANNEL, payload: "{" },
    { channel: LIVE_CHANNEL },
  ])
    client.emit("notification", notification);
  client.emit("notification", {
    channel: LIVE_CHANNEL,
    payload: '{"kind":"signups","eventId":1,"public":false}',
  });
  assert.deepEqual(changes, [{ kind: "signups", eventId: 1, public: false }]);
});

test("failed connects retry exponentially, re-LISTEN after disconnect, and ignore stale clients", async (t) => {
  // Production has the HTTP server keeping the process alive during retries.
  const keepAlive = setTimeout(() => {}, 3000);
  t.after(() => clearTimeout(keepAlive));
  const clients: FakeClient[] = [];
  const attempts: number[] = [];
  const listener = new PgLiveListener({
    connectionString,
    retryMinMs: 15,
    retryMaxMs: 30,
    random: () => 0,
    createClient: () => {
      attempts.push(Date.now());
      const fail = clients.length < 2;
      const client = new FakeClient(async () => {
        if (fail) throw new Error("offline");
      });
      clients.push(client);
      return client;
    },
  });
  t.after(() => listener.stop());
  const firstReady = once(listener, "ready");
  listener.start();
  listener.start();
  await firstReady;
  assert.equal(clients.length, 3);
  assert.ok(attempts[1]! - attempts[0]! >= 12);
  assert.ok(attempts[2]! - attempts[1]! >= 27);
  const old = clients[2]!;
  const nextReady = once(listener, "ready");
  old.emit("error", new Error("lost connection"));
  old.emit("end");
  assert.equal(listener.ready, false);
  await nextReady;
  assert.equal(clients.length, 4);
  assert.deepEqual(clients[3]!.queries, [`LISTEN ${LIVE_CHANNEL}`]);
  const changes: unknown[] = [];
  listener.on("change", (change) => changes.push(change));
  old.emit("notification", {
    channel: LIVE_CHANNEL,
    payload: '{"kind":"user","userId":"stale"}',
  });
  assert.deepEqual(changes, []);
  await listener.stop();
  assert.equal(listener.ready, false);
  assert.equal(clients[3]!.ended, 1);
});

test("LISTEN failures retry and stopping cancels pending reconnects", async () => {
  let attempts = 0;
  const listener = new PgLiveListener({
    connectionString,
    retryMinMs: 10,
    random: () => 0,
    createClient: () => {
      attempts++;
      return new FakeClient(undefined, async () => {
        throw new Error("LISTEN failed");
      });
    },
  });
  const unavailable = once(listener, "unavailable");
  listener.start();
  await unavailable;
  assert.equal(listener.ready, false);
  await listener.stop();
  await delay(30);
  assert.equal(attempts, 1);
});

test("a failed liveness probe makes a silent listener outage unavailable", async (t) => {
  let queries = 0;
  const client = new FakeClient(undefined, async () => {
    if (++queries > 1) throw new Error("query timeout");
  });
  const listener = new PgLiveListener({
    connectionString,
    createClient: () => client,
    probeIntervalMs: 10,
  });
  t.after(() => listener.stop());
  const keepAlive = setTimeout(() => {}, 3000);
  t.after(() => clearTimeout(keepAlive));
  const ready = once(listener, "ready");
  listener.start();
  await ready;
  const unavailable = once(listener, "unavailable");
  await unavailable;
  assert.equal(listener.ready, false);
  assert.deepEqual(client.queries, [`LISTEN ${LIVE_CHANNEL}`, "SELECT 1"]);
  assert.equal(client.ended, 1);
});
