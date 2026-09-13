import { readFile } from "node:fs/promises";
import { Client } from "pg";
import { listenerConnectionString } from "./listener";

const triggerSql = new URL("../../../prisma/live-updates.sql", import.meta.url);

/** Install the PostgreSQL objects Prisma cannot represent in schema.prisma. */
export async function installLiveUpdates(connectionString: string) {
  const client = new Client({
    connectionString: listenerConnectionString(connectionString),
    connectionTimeoutMillis: 5000,
    query_timeout: 10_000,
    application_name: "ilmomasiina-live-installer",
  });
  try {
    await client.connect();
    await client.query(await readFile(triggerSql, "utf8"));
  } finally {
    await client.end().catch(() => undefined);
  }
}
