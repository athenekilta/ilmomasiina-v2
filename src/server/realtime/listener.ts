import { EventEmitter } from "node:events";
import { Client } from "pg";
import { parseDatabaseChange } from "./protocol";

export const LIVE_CHANNEL = "ilmomasiina_changes";
export interface LiveListener extends Pick<EventEmitter, "on" | "off"> {
  readonly ready: boolean;
  start(): void;
  stop(): Promise<void>;
}
export interface ListenerClient extends Pick<EventEmitter, "on"> {
  connect(): Promise<unknown>;
  query(sql: string): Promise<unknown>;
  end(): Promise<unknown>;
}
export type ListenerOptions = {
  connectionString: string;
  createClient?: (connectionString: string) => ListenerClient;
  retryMinMs?: number;
  retryMaxMs?: number;
  probeIntervalMs?: number;
  random?: () => number;
  log?: (message: string) => void;
};

export function listenerConnectionString(connectionString: string): string {
  const url = new URL(connectionString);
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must be a PostgreSQL URL");
  }
  // Prisma's schema option is not a PostgreSQL connection parameter. LISTEN is
  // database-wide, so no search_path modification is required here.
  url.searchParams.delete("schema");
  return url.toString();
}

export class PgLiveListener extends EventEmitter implements LiveListener {
  ready = false;
  private running = false;
  private client: ListenerClient | undefined;
  private retry: ReturnType<typeof setTimeout> | undefined;
  private probe: ReturnType<typeof setTimeout> | undefined;
  private failures = 0;
  private readonly connectionString: string;

  constructor(private readonly options: ListenerOptions) {
    super();
    this.connectionString = listenerConnectionString(options.connectionString);
  }

  start() {
    if (this.running) return;
    this.running = true;
    void this.connect();
  }

  private async connect() {
    if (!this.running) return;
    let client: ListenerClient | undefined;
    let failed = false;
    const fail = () => {
      if (failed || !this.running || this.client !== client) return;
      failed = true;
      this.client = undefined;
      if (this.probe) clearTimeout(this.probe);
      this.probe = undefined;
      this.ready = false;
      this.emit("unavailable");
      this.options.log?.("Live database listener unavailable; retrying");
      if (client) void client.end().catch(() => undefined);
      const min = this.options.retryMinMs ?? 250;
      const max = this.options.retryMaxMs ?? 30_000;
      const base = Math.min(max, min * 2 ** Math.min(this.failures++, 16));
      const delay = Math.min(
        max,
        base * (1 + (this.options.random ?? Math.random)() * 0.25),
      );
      this.retry = setTimeout(() => {
        this.retry = undefined;
        void this.connect();
      }, delay);
      this.retry.unref();
    };
    try {
      client =
        this.options.createClient?.(this.connectionString) ??
        new Client({
          connectionString: this.connectionString,
          connectionTimeoutMillis: 5000,
          query_timeout: 5000,
          keepAlive: true,
          keepAliveInitialDelayMillis: 10_000,
          application_name: "ilmomasiina-live",
        });
      this.client = client;
      client.on("error", fail);
      client.on("end", fail);
      client.on(
        "notification",
        (notification: { channel: string; payload?: string }) => {
          if (
            !this.ready ||
            this.client !== client ||
            notification.channel !== LIVE_CHANNEL ||
            !notification.payload
          )
            return;
          const change = parseDatabaseChange(notification.payload);
          if (change) this.emit("change", change);
        },
      );
      await client.connect();
      if (!this.running || failed || this.client !== client) return;
      await client.query(`LISTEN ${LIVE_CHANNEL}`);
      if (!this.running || failed || this.client !== client) return;
      this.ready = true;
      this.failures = 0;
      // TCP keepalive alone can take minutes to detect a blackholed connection.
      // pg's query_timeout bounds each probe; no browser HTTP polling is involved.
      const scheduleProbe = () => {
        this.probe = setTimeout(() => {
          this.probe = undefined;
          if (!this.running || failed || this.client !== client) return;
          void client!
            .query("SELECT 1")
            .then(() => {
              if (this.running && !failed && this.client === client)
                scheduleProbe();
            })
            .catch(fail);
        }, this.options.probeIntervalMs ?? 15_000);
        this.probe.unref();
      };
      scheduleProbe();
      this.emit("ready");
    } catch {
      fail();
    }
  }

  async stop() {
    this.running = false;
    this.ready = false;
    if (this.retry) clearTimeout(this.retry);
    if (this.probe) clearTimeout(this.probe);
    this.retry = undefined;
    this.probe = undefined;
    const client = this.client;
    this.client = undefined;
    if (client) await client.end().catch(() => undefined);
  }
}
