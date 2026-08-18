import type { EnrichedEvent } from "./eventCardVariant";

/**
 * Splits the list into the events you can still act on and the ones whose
 * registration has closed.
 *
 * The open ones lead, soonest deadline first — the card that closes tonight
 * is the one worth seeing before the one that closes in a month. The closed
 * ones follow under their own heading, newest last, so events that already
 * happened end up at the very bottom.
 *
 * Grouped here rather than in the query: the two list endpoints (public and
 * admin) both feed this page, and which group an event lands in depends on
 * the current time, not on anything stored.
 */
export function groupEventsForList<T extends EnrichedEvent>(events: T[]) {
  const now = Date.now();
  const closesAt = (event: T) => new Date(event.registrationEndDate).getTime();
  const startsAt = (event: T) => new Date(event.date).getTime();

  const open: T[] = [];
  const closed: T[] = [];
  for (const event of events) {
    (closesAt(event) < now ? closed : open).push(event);
  }

  open.sort((a, b) => closesAt(a) - closesAt(b));
  closed.sort((a, b) => startsAt(b) - startsAt(a));

  return { open, closed };
}
