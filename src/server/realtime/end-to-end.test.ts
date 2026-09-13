import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Client } from "pg";
import { WebSocket } from "ws";
import { createGateway } from "./gateway";
import { PgLiveListener } from "./listener";
import type { ServerMessage, Subscription } from "./protocol";
import { issueTicket, type LiveIdentity } from "./ticket";

// Opt in only with a maintenance database whose role has CREATEDB. The supplied
// database is never reset: schema push, writes and DROP target a random database.
// node --import tsx --test src/server/realtime/end-to-end.test.ts
const databaseUrl = process.env.LIVE_TEST_DATABASE_URL;
const root = fileURLToPath(new URL("../../../", import.meta.url));
const origin = "https://events.example";
const secret = "end-to-end-test-only-secret";
const anonymous: LiveIdentity = { userId: null, role: null };
const adminIdentity: LiveIdentity = {
  userId: "test-admin",
  role: "superadmin",
};
const scopes: Subscription = {
  type: "subscribe",
  eventIds: [1, 2, 3],
  events: false,
  users: false,
  profile: false,
};
const hint = (kind: "event" | "signups", eventId: number): ServerMessage => ({
  type: "change",
  kind,
  eventId,
});

async function until(check: () => boolean, description: string) {
  const deadline = Date.now() + 5_000;
  while (!check()) {
    assert.ok(Date.now() < deadline, `Timed out: ${description}`);
    await delay(5);
  }
}

test(
  "real PostgreSQL triggers reach public/admin WebSockets and recover after LISTEN loss",
  { skip: !databaseUrl, timeout: 180_000 },
  async (t) => {
    assert.ok(databaseUrl);
    const maintenance = new Client({ connectionString: databaseUrl });
    const databaseName = `ilmomasiina_live_e2e_${randomUUID().replaceAll("-", "")}`;
    const isolatedUrl = new URL(databaseUrl);
    isolatedUrl.pathname = `/${databaseName}`;
    isolatedUrl.searchParams.set("schema", "public");
    const connectionString = isolatedUrl.toString();
    const writer = new Client({ connectionString });
    const worker = new Client({ connectionString });
    const listener = new PgLiveListener({
      connectionString,
      retryMinMs: 1_000,
      retryMaxMs: 1_000,
    });
    const gateway = createGateway({
      listener,
      nextAuthUrl: origin,
      secret,
      coalesceMs: 10,
      closeGraceMs: 50,
    });
    const sockets: WebSocket[] = [];
    let created = false;
    t.after(async () => {
      for (const socket of sockets) socket.terminate();
      try {
        await gateway.close();
      } finally {
        await Promise.all([writer.end(), worker.end()]);
        try {
          if (created)
            await maintenance.query(
              `DROP DATABASE "${databaseName}" WITH (FORCE)`,
            );
        } finally {
          await maintenance.end();
        }
      }
    });
    await maintenance.connect();
    await maintenance.query(
      `CREATE DATABASE "${databaseName}" TEMPLATE template0`,
    );
    created = true;
    await promisify(execFile)(
      process.execPath,
      [
        "node_modules/prisma/build/index.js",
        "db",
        "push",
        "--accept-data-loss",
      ],
      {
        cwd: root,
        env: { ...process.env, DATABASE_URL: connectionString },
        timeout: 90_000,
      },
    );
    await Promise.all([writer.connect(), worker.connect()]);
    await writer.query(
      await readFile(
        new URL(
          "../../../prisma/migrations/20260913130000_live_updates/migration.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await writer.query(`
      INSERT INTO "Event" (id, title, date, "registrationStartDate",
        "registrationEndDate", "updatedAt", draft)
      VALUES (1, 'Public event', now(), now(), now(), now(), false),
             (2, 'Private event', now(), now(), now(), now(), true),
             (3, 'Barrier event', now(), now(), now(), now(), false);
      INSERT INTO "Quota" (id, title, "sortId", "eventId")
      VALUES ('public-quota', 'Public', 0, 1), ('private-quota', 'Private', 0, 2);
    `);
    await gateway.listen(0);
    await until(() => listener.ready, "initial LISTEN acknowledgement");
    // Tickets must be newer than the gateway's initial LISTEN watermark.
    await delay(2);
    const port = (gateway.http.address() as AddressInfo).port;
    const health = async () => {
      const response = await fetch(`http://127.0.0.1:${port}/health`, {
        signal: AbortSignal.timeout(5_000),
      });
      await response.text();
      return response.status;
    };
    assert.equal(await health(), 200);

    async function connect(identity: LiveIdentity, ticket?: string) {
      const socket = new WebSocket(`ws://127.0.0.1:${port}/api/live`, {
        origin,
      });
      sockets.push(socket);
      const messages: ServerMessage[] = [];
      let closeCode: number | undefined;
      socket.on("message", (data) => {
        messages.push(JSON.parse(data.toString()) as ServerMessage);
      });
      socket.on("close", (code) => {
        closeCode = code;
      });
      socket.on("error", () => undefined);
      await once(socket, "open", { signal: AbortSignal.timeout(5_000) });
      socket.send(
        JSON.stringify({
          type: "authenticate",
          ticket: ticket ?? issueTicket(identity, origin, secret).ticket,
        }),
      );
      socket.send(JSON.stringify(scopes));
      await until(
        () =>
          messages.some((message) => message.type === "ready") ||
          closeCode !== undefined,
        "WebSocket authentication/subscription",
      );
      if (!ticket) {
        assert.equal(closeCode, undefined);
        assert.deepEqual(messages.splice(0), [{ type: "ready" }]);
      }
      return { messages, closed: () => closeCode };
    }
    let publicPeer = await connect(anonymous);
    let adminPeer = await connect(adminIdentity);

    async function expectHints(
      publicHints: ServerMessage[],
      adminHints = publicHints,
    ) {
      // A separate committed row change traverses the SAME listener and sockets.
      // Its frame bounds earlier notifications/flushes, including negative checks,
      // without relying on sleeps or injecting notifications into the gateway.
      await worker.query('UPDATE "Event" SET title = $1 WHERE id = 3', [
        randomUUID(),
      ]);
      const isBarrier = (message: ServerMessage) =>
        message.type === "change" &&
        "eventId" in message &&
        message.eventId === 3;
      await until(
        () =>
          publicPeer.messages.some(isBarrier) &&
          adminPeer.messages.some(isBarrier),
        "SQL-to-WebSocket barrier",
      );
      const sorted = (messages: ServerMessage[]) =>
        messages.map((message) => JSON.stringify(message)).sort();
      assert.deepEqual(
        sorted(publicPeer.messages.splice(0)),
        sorted([...publicHints, hint("event", 3)]),
      );
      assert.deepEqual(
        sorted(adminPeer.messages.splice(0)),
        sorted([...adminHints, hint("event", 3)]),
      );
    }

    await writer.query("BEGIN");
    await writer.query(`INSERT INTO "Signup" (id, name, email, "quotaId", "originalQuotaId")
      VALUES ('private-signup-id', 'Private attendee', 'private@example.test', 'public-quota', 'public-quota')`);
    await expectHints([]);
    await writer.query("COMMIT");
    await expectHints([hint("signups", 1)]);
    t.diagnostic(
      "Uncommitted signup is silent; COMMIT reaches both peers with ID-only hints",
    );

    await writer.query("BEGIN");
    await writer.query(
      `UPDATE "Signup" SET name = 'Rolled back' WHERE id = 'private-signup-id'`,
    );
    await expectHints([]);
    await writer.query("ROLLBACK");
    await expectHints([]);
    const row = await writer.query(
      `SELECT name FROM "Signup" WHERE id = 'private-signup-id'`,
    );
    assert.equal(row.rows[0].name, "Private attendee");
    t.diagnostic("Rollback emits no WebSocket invalidation");

    await worker.query(
      `UPDATE "Signup" SET name = 'Worker update' WHERE id = 'private-signup-id'`,
    );
    await expectHints([hint("signups", 1)]);
    await worker.query(`INSERT INTO "Signup" (id, name, email, "quotaId", "originalQuotaId")
      VALUES ('draft-signup', 'Hidden attendee', 'hidden@example.test', 'private-quota', 'private-quota')`);
    await expectHints([], [hint("signups", 2)]);
    await writer.query(
      `UPDATE "Event" SET title = 'Hidden draft title' WHERE id = 2`,
    );
    await expectHints([], [hint("event", 2)]);
    await writer.query('UPDATE "Event" SET draft = false WHERE id = 2');
    await expectHints([hint("event", 2)]);
    await writer.query('UPDATE "Event" SET draft = true WHERE id = 2');
    await expectHints([hint("event", 2)]);
    t.diagnostic(
      "Second SQL writer reaches peers; draft hints stay admin-only; publish/unpublish reaches public",
    );

    const oldTicket = issueTicket(anonymous, origin, secret).ticket;
    const backend = await writer.query<{ pid: number }>(
      "SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND application_name = 'ilmomasiina-live'",
    );
    assert.equal(backend.rows.length, 1);
    const unavailable = once(listener, "unavailable", {
      signal: AbortSignal.timeout(5_000),
    });
    const recovered = once(listener, "ready", {
      signal: AbortSignal.timeout(5_000),
    });
    await writer.query("SELECT pg_terminate_backend($1)", [
      backend.rows[0]!.pid,
    ]);
    await unavailable;
    assert.equal(await health(), 503);
    await until(
      () =>
        publicPeer.closed() !== undefined && adminPeer.closed() !== undefined,
      "outage closes both peers",
    );
    assert.equal(publicPeer.closed(), 1013);
    assert.equal(adminPeer.closed(), 1013);
    // Missed changes are not replayed: reconnect/ready tells clients to refetch.
    await worker.query(
      `UPDATE "Signup" SET name = 'During outage' WHERE id = 'private-signup-id'`,
    );
    await recovered;
    assert.equal(await health(), 200);
    const replacement = await writer.query<{ pid: number }>(
      "SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND application_name = 'ilmomasiina-live'",
    );
    assert.equal(replacement.rows.length, 1);
    assert.notEqual(replacement.rows[0]!.pid, backend.rows[0]!.pid);
    const replay = await connect(anonymous, oldTicket);
    assert.equal(replay.closed(), 4401);
    assert.deepEqual(replay.messages, [{ type: "reauthenticate" }]);
    await delay(2);
    publicPeer = await connect(anonymous);
    adminPeer = await connect(adminIdentity);
    await worker.query(
      `UPDATE "Signup" SET name = 'After reconnect' WHERE id = 'private-signup-id'`,
    );
    await expectHints([hint("signups", 1)]);
    t.diagnostic(
      "Real backend termination: health 503 -> 200, close 1013, stale ticket 4401, fresh peers receive SQL changes",
    );
  },
);
