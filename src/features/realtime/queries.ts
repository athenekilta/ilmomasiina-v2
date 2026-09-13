export type LiveScope = {
  eventIds: number[];
  events: boolean;
  users: boolean;
  profile: boolean;
};

export type LiveChange =
  | { kind: "event" | "signups"; eventId: number }
  | { kind: "users" }
  | { kind: "profile" };

export type LiveQuery = {
  queryKey: readonly unknown[];
  isActive: () => boolean;
};

const eventLists = new Set(["events.getEvents", "events.getEventsAdmin"]);
const eventDetails = new Set(["events.getEventByID", "events.getEventEditId"]);
const signupQueries = new Set([
  "signups.getSignupByEventIds",
  "signups.getMySignupStatus",
  "signups.getSignupByID",
  "signups.exportSignupsCsv",
]);
const privilegedQueries = new Set([
  "events.getEventsAdmin",
  "events.getEventEditId",
  "signups.getSignupByEventIds",
  "signups.exportSignupsCsv",
  "users.getUsers",
]);

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isEventId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

// tRPC v11 keys are [[router, procedure], { input, type }]. Never serialize
// the full key into a subscription: signup keys can contain private IDs.
export function describeQuery(queryKey: readonly unknown[]) {
  const [path, options] = queryKey;
  if (!Array.isArray(path) || !path.every((part) => typeof part === "string")) {
    return { path: "", eventId: undefined };
  }
  const input = isRecord(options) ? options.input : undefined;
  const eventId =
    isRecord(input) && isEventId(input.eventId) ? input.eventId : undefined;
  return { path: path.join("."), eventId };
}

export function isRealtimeQuery(query: Pick<LiveQuery, "queryKey">): boolean {
  const { path } = describeQuery(query.queryKey);
  return (
    eventLists.has(path) ||
    eventDetails.has(path) ||
    signupQueries.has(path) ||
    path === "users.getUsers" ||
    path === "profile.get"
  );
}

export function isPrivilegedQuery(query: Pick<LiveQuery, "queryKey">): boolean {
  return privilegedQueries.has(describeQuery(query.queryKey).path);
}

export function collectScope(queries: readonly LiveQuery[]): LiveScope {
  const ids = new Set<number>();
  let events = false;
  let users = false;
  for (const query of queries) {
    // Query.isActive() means at least one enabled observer, not just cached or
    // mounted. This also handles function-valued `enabled` in React Query v5.
    if (!query.isActive()) continue;
    const { path, eventId } = describeQuery(query.queryKey);
    if (eventLists.has(path)) events = true;
    if (path === "users.getUsers") users = true;
    if (
      (eventDetails.has(path) || signupQueries.has(path)) &&
      eventId !== undefined
    ) {
      ids.add(eventId);
    }
  }
  return {
    eventIds: [...ids].sort((a, b) => a - b).slice(0, 20),
    events,
    users,
    // The app-wide observer verifies identity/role even on public pages.
    profile: true,
  };
}

export function matchesChange(
  query: Pick<LiveQuery, "queryKey">,
  change: LiveChange,
): boolean {
  const { path, eventId } = describeQuery(query.queryKey);
  if (change.kind === "users" || change.kind === "profile") {
    return path === "users.getUsers" || path === "profile.get";
  }
  // Both kinds affect event lists/counts, edit data, and signup placement.
  if (eventLists.has(path)) return true;
  if (!eventDetails.has(path) && !signupQueries.has(path)) return false;
  // Legacy ID-only signup cache entries cannot be associated with one event.
  if (path === "signups.getSignupByID" && eventId === undefined) return true;
  return eventId === change.eventId;
}

export type ProfileIdentity = { id: string; role: string } | null;

export function profileIdentity(data: unknown): ProfileIdentity | undefined {
  if (data === null) return null;
  if (
    isRecord(data) &&
    typeof data.id === "string" &&
    typeof data.role === "string"
  ) {
    return { id: data.id, role: data.role };
  }
  return undefined;
}

export function privilegesChanged(
  previous: ProfileIdentity | undefined,
  next: ProfileIdentity | undefined,
): boolean {
  if (previous === undefined || next === undefined) return false;
  // Clear on any role transition, including upgrades, so old permission-shaped
  // responses cannot survive a subsequent downgrade or account switch.
  return previous?.id !== next?.id || previous?.role !== next?.role;
}

export function parseChange(message: unknown): LiveChange | undefined {
  if (!isRecord(message) || message.type !== "change") return undefined;
  if (message.kind === "users" || message.kind === "profile") {
    return { kind: message.kind };
  }
  if (
    (message.kind === "event" || message.kind === "signups") &&
    isEventId(message.eventId)
  ) {
    return { kind: message.kind, eventId: message.eventId };
  }
  return undefined;
}
