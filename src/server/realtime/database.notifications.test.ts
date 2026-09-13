import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

// Opt in with LIVE_TEST_DATABASE_URL pointing at a PostgreSQL maintenance DB.
// Its role must have CREATEDB. Only a randomly named database created by this
// test is reset/dropped; the supplied database's schema/data are never changed.
// Run from the project root:
//   node --import tsx --test src/server/realtime/database.notifications.test.ts
// No .env is loaded here: ordinary DATABASE_URL must never opt this test in.
// pg is already installed through @prisma/adapter-pg. Keep this test's small
// structural interface local rather than adding pg/@types/pg dependencies.
interface TestClient extends EventEmitter {
  connect(): Promise<void>;
  end(): Promise<void>;
  query(
    sql: string,
    values?: unknown[],
  ): Promise<{ rows: Record<string, unknown>[] }>;
}
const { Client } = createRequire(import.meta.url)("pg") as {
  Client: new (options: { connectionString: string }) => TestClient;
};

type Change =
  | { kind: "event" | "signups"; eventId: number; public: boolean }
  | { kind: "user" | "session"; userId: string };
type Notification = { channel: string; payload?: string };

const root = fileURLToPath(new URL("../../../", import.meta.url));
const migrations = new URL("../../../prisma/migrations/", import.meta.url);
const migration = new URL("../../../prisma/live-updates.sql", import.meta.url);
const eventChange = (eventId: number, publicFlag = true): Change => ({
  kind: "event",
  eventId,
  public: publicFlag,
});
const signupChange = (eventId: number, publicFlag = true): Change => ({
  kind: "signups",
  eventId,
  public: publicFlag,
});

const databaseUrl = process.env.LIVE_TEST_DATABASE_URL;
test(
  "transactional database invalidations",
  { skip: !databaseUrl, timeout: 180_000 },
  async (t) => {
    assert.ok(databaseUrl);
    const admin = new Client({ connectionString: databaseUrl });
    const databaseName = `ilmomasiina_live_test_${randomUUID().replaceAll("-", "")}`;
    const isolatedUrl = new URL(databaseUrl);
    isolatedUrl.pathname = `/${databaseName}`;
    isolatedUrl.searchParams.set("schema", "public");
    const writer = new Client({ connectionString: isolatedUrl.toString() });
    const listener = new Client({ connectionString: isolatedUrl.toString() });
    let created = false;
    t.after(async () => {
      await Promise.all([writer.end(), listener.end()]);
      try {
        if (created) {
          await admin.query(`DROP DATABASE "${databaseName}" WITH (FORCE)`);
        }
      } finally {
        await admin.end();
      }
    });
    await admin.connect();
    await admin.query(`CREATE DATABASE "${databaseName}" TEMPLATE template0`);
    created = true;
    await writer.connect();
    const sql = await readFile(migration, "utf8");

    await t.test(
      "installs with legacy auth tables and can be reapplied",
      async () => {
        // The later user-role migration already assumes lowercase "user" exists.
        // Replay the actual legacy history up to that unrelated drift, then prove
        // THIS additive migration tolerates the absent better-auth tables.
        for (const directory of (await readdir(migrations)).sort()) {
          if (/^\d/.test(directory) && directory < "20260826120000") {
            await writer.query(
              await readFile(
                new URL(`${directory}/migration.sql`, migrations),
                "utf8",
              ),
            );
          }
        }
        await writer.query(sql);
        await writer.query(sql);
        const { rows } = await writer.query(`
        SELECT to_regclass('public."User"')::text AS legacy,
               to_regclass('public."user"')::text AS current,
               (SELECT count(*)::integer FROM pg_trigger
                WHERE tgname = 'ilmomasiina_row_change') AS triggers
      `);
        assert.deepEqual(rows, [
          { legacy: '"User"', current: null, triggers: 5 },
        ]);
      },
    );

    // Exercise the documented db-push/reapply workflow against the real schema,
    // not a hand-maintained imitation of its tables and foreign keys.
    await promisify(execFile)(
      process.execPath,
      [
        "node_modules/prisma/build/index.js",
        "db",
        "push",
        "--force-reset",
        "--accept-data-loss",
      ],
      {
        cwd: root,
        env: { ...process.env, DATABASE_URL: isolatedUrl.toString() },
        timeout: 90_000,
      },
    );
    await writer.query(sql);
    await writer.query(sql);
    const installed = await writer.query(`
      SELECT count(*)::integer AS count FROM pg_trigger
      WHERE tgname = 'ilmomasiina_row_change'
    `);
    assert.equal(installed.rows[0]?.count, 8);

    await listener.connect();
    const notifications: Change[] = [];
    listener.on("notification", (message: Notification) => {
      if (message.channel === "ilmomasiina_changes") {
        notifications.push(JSON.parse(message.payload ?? "null") as Change);
      }
    });
    await listener.query(
      "LISTEN ilmomasiina_changes; LISTEN live_test_barrier",
    );

    async function expectChanges(expected: Change[]) {
      // A committed sentinel on the same listener bounds all earlier commits.
      // Unlike sleeps this also reliably proves absence and pre-commit silence.
      const token = randomUUID();
      let onNotification: (message: Notification) => void;
      let timer: ReturnType<typeof setTimeout>;
      const barrier = new Promise<void>((resolve, reject) => {
        onNotification = (message) => {
          if (
            message.channel === "live_test_barrier" &&
            message.payload === token
          ) {
            resolve();
          }
        };
        listener.on("notification", onNotification);
        timer = setTimeout(
          () => reject(new Error("LISTEN barrier timed out")),
          5_000,
        );
      });
      try {
        await Promise.all([
          barrier,
          listener.query("SELECT pg_notify('live_test_barrier', $1)", [token]),
        ]);
      } finally {
        clearTimeout(timer!);
        listener.off("notification", onNotification!);
      }
      // Exact object comparisons enforce the payload's privacy allowlist too.
      const sorted = (items: Change[]) =>
        items.map((item) => JSON.stringify(item)).sort();
      assert.deepEqual(sorted(notifications.splice(0)), sorted(expected));
    }
    async function change(
      sqlText: string,
      expected: Change[],
      values?: unknown[],
    ) {
      await writer.query(sqlText, values);
      await expectChanges(expected);
    }
    async function addEvent(id: number, draft = false, deleted = false) {
      await change(
        `INSERT INTO "Event" (id, title, date, "registrationStartDate",
          "registrationEndDate", "updatedAt", draft, "deletedAt", "verificationEmail")
         VALUES ($1, 'Private event title', now(), now(), now(), now(), $2,
          CASE WHEN $3 THEN now() ELSE NULL END, 'private-organizer@example.test')`,
        [eventChange(id, !draft && !deleted)],
        [id, draft, deleted],
      );
    }
    async function addQuota(id: string, eventId: number, visible = true) {
      await change(
        'INSERT INTO "Quota" (id, title, "sortId", "eventId") VALUES ($1, \'Private quota\', 0, $2)',
        [eventChange(eventId, visible)],
        [id, eventId],
      );
    }
    async function addSignup(
      id: string,
      quotaId: string,
      eventId: number,
      visible = true,
    ) {
      await change(
        `INSERT INTO "Signup" (id, name, email, "quotaId", "originalQuotaId")
         VALUES ($1, 'Private attendee', 'private-attendee@example.test', $2, $2)`,
        [signupChange(eventId, visible)],
        [id, quotaId],
      );
    }

    await t.test(
      "event visibility, meaningful updates and deletion",
      async () => {
        await addEvent(1);
        await addEvent(2, true);
        await addEvent(3, false, true);
        await change(
          'UPDATE "Event" SET title = title, "updatedAt" = now()',
          [],
        );
        await change(
          'UPDATE "Event" SET title = \'Changed private title\' WHERE id = 1',
          [eventChange(1)],
        );
        await change('UPDATE "Event" SET draft = true WHERE id = 1', [
          eventChange(1),
        ]);
        await change(
          "UPDATE \"Event\" SET description = 'Private' WHERE id = 1",
          [eventChange(1, false)],
        );
        await change('UPDATE "Event" SET draft = false WHERE id = 1', [
          eventChange(1),
        ]);
        await change('UPDATE "Event" SET "deletedAt" = now() WHERE id = 1', [
          eventChange(1),
        ]);
        await change('UPDATE "Event" SET description = NULL WHERE id = 1', [
          eventChange(1, false),
        ]);
        await change('UPDATE "Event" SET "deletedAt" = NULL WHERE id = 1', [
          eventChange(1),
        ]);
        // Neither version is visible: OLD is draft, NEW is deleted.
        await change(
          'UPDATE "Event" SET draft = false, "deletedAt" = now() WHERE id = 2',
          [eventChange(2, false)],
        );
        await change('DELETE FROM "Event" WHERE id IN (1, 2, 3)', [
          eventChange(1),
          eventChange(2, false),
          eventChange(3, false),
        ]);
      },
    );

    await t.test(
      "commit-only delivery, rollback and transaction coalescing",
      async () => {
        await writer.query(`BEGIN;
        INSERT INTO "Event" (id, title, date, "registrationStartDate", "registrationEndDate", "updatedAt", draft)
        VALUES (10, 'Rolled back private event', now(), now(), now(), now(), false)`);
        await expectChanges([]);
        await writer.query("ROLLBACK");
        await expectChanges([]);
        await writer.query(`BEGIN;
        INSERT INTO "Event" (id, title, date, "registrationStartDate", "registrationEndDate", "updatedAt", draft)
        VALUES (10, 'Private', now(), now(), now(), now(), false);
        UPDATE "Event" SET title = 'Changed' WHERE id = 10`);
        await expectChanges([]);
        await writer.query("COMMIT");
        await expectChanges([eventChange(10)]);
        await addEvent(11, true);
        await addEvent(12, false, true);
      },
    );

    await t.test(
      "quota/question updates, moves, deletes and current visibility",
      async () => {
        await addQuota("private-q1", 10);
        await addQuota("private-q2", 11, false);
        await addQuota("private-q3", 12, false);
        await change('UPDATE "Quota" SET title = title, size = size', []);
        await change("UPDATE \"Quota\" SET size = 5 WHERE id = 'private-q1'", [
          eventChange(10),
        ]);
        await change(
          'UPDATE "Quota" SET "eventId" = 11 WHERE id = \'private-q1\'',
          [eventChange(10), eventChange(11, false)],
        );
        await change(
          'UPDATE "Quota" SET "eventId" = 10 WHERE id = \'private-q1\'',
          [eventChange(10), eventChange(11, false)],
        );
        await change(
          `INSERT INTO "Question" (id, question, "sortId", "eventId")
        VALUES ('private-question', 'Sensitive question', 0, 10)`,
          [eventChange(10)],
        );
        await change('UPDATE "Question" SET question = question', []);
        await change(
          `UPDATE "Question" SET options = ARRAY['Sensitive option']`,
          [eventChange(10)],
        );
        await change('UPDATE "Question" SET "eventId" = 11', [
          eventChange(10),
          eventChange(11, false),
        ]);
        await change('DELETE FROM "Question"', [eventChange(11, false)]);
        await change("DELETE FROM \"Quota\" WHERE id = 'private-q3'", [
          eventChange(12, false),
        ]);
      },
    );

    await t.test(
      "signup/answer privacy, no-ops, updates, moves and deletes",
      async () => {
        await addSignup("private-signup1", "private-q1", 10);
        await addSignup("private-signup2", "private-q2", 11, false);
        await change(
          'UPDATE "Signup" SET name = name, "allocatedAt" = "allocatedAt", status = status',
          [],
        );
        await change(
          `UPDATE "Signup" SET status = 'CONFIRMED', "allocatedAt" = now(),
        "completedAt" = now(), "registrationIntent" = now() WHERE id = 'private-signup1'`,
          [signupChange(10)],
        );
        await change(
          `UPDATE "Signup" SET email = 'new-private@example.test' WHERE id = 'private-signup1'`,
          [signupChange(10)],
        );
        await change(
          `UPDATE "Signup" SET "quotaId" = 'private-q2' WHERE id = 'private-signup1'`,
          [signupChange(10), signupChange(11, false)],
        );
        await change(
          `UPDATE "Signup" SET "quotaId" = 'private-q1' WHERE id = 'private-signup1'`,
          [signupChange(10), signupChange(11, false)],
        );
        await addQuota("private-q4", 10);
        await change(
          `UPDATE "Signup" SET "quotaId" = 'private-q4' WHERE id = 'private-signup1'`,
          [signupChange(10)],
        );
        await change(
          `INSERT INTO "Question" (id, question, "sortId", "eventId")
        VALUES ('private-question', 'Sensitive question', 0, 10)`,
          [eventChange(10)],
        );
        await change(
          `INSERT INTO "Answer" (id, answer, "questionId", "signupId")
        VALUES ('private-answer', 'Sensitive medical answer', 'private-question', 'private-signup1')`,
          [signupChange(10)],
        );
        await change('UPDATE "Answer" SET answer = answer', []);
        await change(
          `UPDATE "Answer" SET answer = 'Changed sensitive answer'`,
          [signupChange(10)],
        );
        await change(`UPDATE "Answer" SET "signupId" = 'private-signup2'`, [
          signupChange(10),
          signupChange(11, false),
        ]);
        await change('DELETE FROM "Answer"', [signupChange(11, false)]);
        await change('DELETE FROM "Signup"', [
          signupChange(10),
          signupChange(11, false),
        ]);
      },
    );

    await t.test(
      "private user/session/account invalidations and auth cascade deletion",
      async () => {
        const user = (userId: string): Change => ({ kind: "user", userId });
        const session = (userId: string): Change => ({
          kind: "session",
          userId,
        });
        await change(
          `INSERT INTO "user" (id, name, email, "updatedAt") VALUES
        ('internal-user1', 'Private user', 'private-user@example.test', now()),
        ('internal-user2', 'Other user', 'other-user@example.test', now())`,
          [user("internal-user1"), user("internal-user2")],
        );
        await change('UPDATE "user" SET "updatedAt" = now(), name = name', []);
        await change(
          `UPDATE "user" SET role = 'superadmin', email = 'changed-private@example.test'
        WHERE id = 'internal-user1'`,
          [user("internal-user1")],
        );
        await change(
          `INSERT INTO "session" (id, token, "userId", "expiresAt", "createdAt", "updatedAt", "ipAddress", "userAgent")
        VALUES ('private-session', 'secret-session-token', 'internal-user1', now() + interval '1 day', now(), now(), '192.0.2.1', 'Private browser')`,
          [session("internal-user1")],
        );
        await change(
          'UPDATE "session" SET "updatedAt" = now(), "expiresAt" = "expiresAt"',
          [],
        );
        await change(
          'UPDATE "session" SET "expiresAt" = now() - interval \'1 day\'',
          [session("internal-user1")],
        );
        await change(
          `UPDATE "session" SET "userId" = 'internal-user2', token = 'replacement-secret'`,
          [session("internal-user1"), session("internal-user2")],
        );
        await change('DELETE FROM "session"', [session("internal-user2")]);
        await change(
          `INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "accessToken", "refreshToken", "idToken", "createdAt", "updatedAt")
        VALUES ('private-account', 'private-provider-id', 'credential', 'internal-user1', 'secret-hash', 'secret-access', 'secret-refresh', 'secret-id-token', now(), now())`,
          [session("internal-user1")],
        );
        await change(
          'UPDATE "account" SET "updatedAt" = now(), password = password',
          [],
        );
        await change(`UPDATE "account" SET password = 'new-secret-hash'`, [
          session("internal-user1"),
        ]);
        await change(`UPDATE "account" SET "userId" = 'internal-user2'`, [
          session("internal-user1"),
          session("internal-user2"),
        ]);
        await change(
          `INSERT INTO "session" (id, token, "userId", "expiresAt", "createdAt", "updatedAt")
        VALUES ('private-session2', 'another-secret', 'internal-user2', now(), now(), now())`,
          [session("internal-user2")],
        );
        await change(`DELETE FROM "user" WHERE id = 'internal-user2'`, [
          user("internal-user2"),
          session("internal-user2"),
        ]);
        await change('DELETE FROM "user"', [user("internal-user1")]);
      },
    );
  },
);
