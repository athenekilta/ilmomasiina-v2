// Server-owned wire contract. Do not import auth/Prisma into the standalone gateway.
export type LiveRole = "user" | "event_editor" | "superadmin";
export type Subscription = {
  type: "subscribe";
  eventIds: number[];
  events: boolean;
  users: boolean;
  profile: boolean;
};
export type ClientMessage =
  | { type: "authenticate"; ticket: string }
  | Subscription;
export type ServerMessage =
  | { type: "ready" | "resync" | "reauthenticate" }
  | { type: "change"; kind: "event" | "signups"; eventId: number }
  | { type: "change"; kind: "users" | "profile" };
export type DatabaseChange =
  | { kind: "event" | "signups"; eventId: number; public: boolean }
  | { kind: "user" | "session"; userId: string };

export const MAX_INPUT_BYTES = 4096;
export const MAX_TICKET_BYTES = 2048;
export const MAX_EVENT_IDS = 20;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function eventId(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}
function exactKeys(value: Record<string, unknown>, keys: string[]) {
  return (
    Object.keys(value).length === keys.length &&
    keys.every((key) => key in value)
  );
}

export function parseClientMessage(text: string): ClientMessage | null {
  if (Buffer.byteLength(text) > MAX_INPUT_BYTES) return null;
  try {
    const value: unknown = JSON.parse(text);
    if (!record(value)) return null;
    if (
      value.type === "authenticate" &&
      exactKeys(value, ["type", "ticket"]) &&
      typeof value.ticket === "string" &&
      value.ticket.length > 0 &&
      value.ticket.length <= MAX_TICKET_BYTES
    )
      return { type: "authenticate", ticket: value.ticket };
    if (
      value.type === "subscribe" &&
      exactKeys(value, ["type", "eventIds", "events", "users", "profile"]) &&
      Array.isArray(value.eventIds) &&
      value.eventIds.length <= MAX_EVENT_IDS &&
      value.eventIds.every(eventId) &&
      typeof value.events === "boolean" &&
      typeof value.users === "boolean" &&
      typeof value.profile === "boolean"
    )
      return {
        type: "subscribe",
        eventIds: [...new Set(value.eventIds)],
        events: value.events,
        users: value.users,
        profile: value.profile,
      };
  } catch {
    /* Invalid JSON is a protocol violation. */
  }
  return null;
}

export function parseDatabaseChange(text: string): DatabaseChange | null {
  if (Buffer.byteLength(text) > 8000) return null;
  try {
    const value: unknown = JSON.parse(text);
    if (!record(value)) return null;
    if (
      (value.kind === "event" || value.kind === "signups") &&
      eventId(value.eventId) &&
      typeof value.public === "boolean"
    )
      return { kind: value.kind, eventId: value.eventId, public: value.public };
    if (
      (value.kind === "user" || value.kind === "session") &&
      typeof value.userId === "string" &&
      value.userId.length > 0 &&
      value.userId.length <= 256
    )
      return { kind: value.kind, userId: value.userId };
  } catch {
    /* Ignore malformed notifications; never forward raw database payloads. */
  }
  return null;
}
