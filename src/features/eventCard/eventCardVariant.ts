import type { Event, Quota, Signup } from "@/generated/prisma/client";
import { RegistrationDate } from "@/features/events/utils/utils";

export type EnrichedQuota = Quota & {
  Signups: Signup[];
  signupCount: number;
};

export type EnrichedEvent = Event & {
  Quotas: EnrichedQuota[];
};

/**
 * Card size tier. "hero" spans 2 grid columns (still leaves at least one
 * column free so other events stay visible alongside it), "standard" is a
 * single column. Both use a square image; a hero card is simply wider,
 * which makes its image bigger too.
 */
export type EventCardSize = "hero" | "standard";

const HOURS_48 = 48 * 60 * 60 * 1000;

/**
 * Ranks events by how much they deserve the big square, most-deserving
 * first: registrations that are currently open, freshest first (the one
 * that started accepting signups most recently); if nothing is open, just
 * the single soonest-starting event. This is a ranking, not a yes/no split
 * — `pickBigEventIds` decides how many of the top of this list actually
 * get to be big.
 */
function rankBigCandidates(events: EnrichedEvent[]): EnrichedEvent[] {
  const now = new Date();

  const openEvents = events.filter(
    (event) => RegistrationDate(event).isRegistrationOpen,
  );

  if (openEvents.length > 0) {
    return [...openEvents].sort(
      (a, b) =>
        new Date(b.registrationStartDate).getTime() -
        new Date(a.registrationStartDate).getTime(),
    );
  }

  return [...events]
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 1);
}

/**
 * Picks which events get the big square this render. Big squares must
 * stay a clear minority (roughly one in five) so the size contrast keeps
 * meaning instead of the grid filling up with big squares — but grows
 * past a single one once there are enough small events around to carry
 * it. Cards are rendered in their normal chronological order (see
 * index.tsx) — dense packing then plants each big square wherever it
 * naturally falls, so multiple big squares land on different sides of the
 * grid rather than clustering on one edge.
 */
export function pickBigEventIds(events: EnrichedEvent[]): Set<number> {
  const maxBig = Math.max(1, Math.floor(events.length / 5));
  return new Set(
    rankBigCandidates(events)
      .slice(0, maxBig)
      .map((event) => event.id),
  );
}

/** Whether an open event's registration window closes within 48h. */
export function isClosingSoon(event: EnrichedEvent): boolean {
  const { isRegistrationOpen } = RegistrationDate(event);
  if (!isRegistrationOpen) return false;
  const msLeft = new Date(event.registrationEndDate).getTime() - Date.now();
  return msLeft >= 0 && msLeft <= HOURS_48;
}

/** Picks a card size for an event: big square if it made the cut, otherwise small. */
export function getEventCardSize(isBig: boolean): EventCardSize {
  return isBig ? "hero" : "standard";
}

/**
 * Static Tailwind classes for each size tier — kept literal for the JIT
 * scanner. Every card uses the same image aspect ratio, so a hero card
 * (2 columns wide) naturally needs about twice the height of a standard
 * card (1 column) to keep its image proportioned the same way — hence
 * `row-span-2` here. Without it, the grid would stretch standard cards
 * in the same row up to the hero's full height, turning them into tall,
 * mostly-blank rectangles instead of matching boxes.
 */
export const eventCardSpanClassName: Record<EventCardSize, string> = {
  hero: "sm:col-span-2 sm:row-span-2",
  standard: "sm:col-span-1 sm:row-span-1",
};
