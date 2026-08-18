import type { EnrichedEvent } from "./eventCardVariant";

export type FillLevel = "free" | "filling" | "full";

export type EventFill = {
  level: FillLevel;
  signupCount: number;
  /** Total seats across quotas + open quota. Null when a quota is unlimited. */
  capacity: number | null;
  /** Short human label, used as the icon's accessible name and tooltip. */
  label: string;
  /** "12 ilmonnutta" — quota names are not shown on the card. */
  countText: string;
  /** "Paljon paikkoja jäljellä" and friends. */
  availabilityText: string;
};

/**
 * How full an event is overall — quotas and the open quota summed, since
 * the card shows one indicator for the whole event rather than per quota.
 *
 * A quota with no size is unlimited, so such an event can never be "full";
 * it stays at "free" no matter how many have signed up.
 */
export function getEventFill(event: EnrichedEvent): EventFill {
  const signupCount = event.Quotas.reduce(
    (sum, quota) => sum + quota.signupCount,
    0,
  );

  const hasUnlimitedQuota = event.Quotas.some((quota) => quota.size == null);

  // Quota places plus jokeripaikat — the shared places that sit outside every
  // quota. `openQuotaSize` is the legacy field this replaced; the event page
  // counts `extraCapacity` too, so the card has to agree with it.
  const capacity = hasUnlimitedQuota
    ? null
    : event.Quotas.reduce((sum, quota) => sum + (quota.size ?? 0), 0) +
      event.extraCapacity;

  const countText = `${signupCount} ilmonnutta`;

  if (capacity === null || capacity === 0) {
    // No seat count to quote when a quota is unlimited.
    return {
      level: "free",
      signupCount,
      capacity,
      label: `${countText} · tilaa jäljellä`,
      countText,
      availabilityText: "Ei paikkarajaa",
    };
  }

  const ratio = signupCount / capacity;
  // Same shape in every state, including a full event at 0/30 — a number
  // people can compare between cards beats three different phrasings.
  const seatsLeft = Math.max(0, capacity - signupCount);
  const seatsText = `${seatsLeft}/${capacity} paikkaa jäljellä`;

  if (ratio >= 1) {
    return {
      level: "full",
      signupCount,
      capacity,
      label: `${signupCount}/${capacity} · täynnä, ilmo jonoon`,
      countText,
      availabilityText: seatsText,
    };
  }

  if (ratio >= 0.5) {
    return {
      level: "filling",
      signupCount,
      capacity,
      label: `${signupCount}/${capacity} · täyttymässä`,
      countText,
      availabilityText: seatsText,
    };
  }

  return {
    level: "free",
    signupCount,
    capacity,
    label: `${signupCount}/${capacity} · tilaa jäljellä`,
    countText,
    availabilityText: seatsText,
  };
}

/** How many of the three figures are filled in for each level. */
export const FILL_STEPS: Record<FillLevel, number> = {
  free: 1,
  filling: 2,
  full: 3,
};

/* Literal classes, so the Tailwind JIT scanner sees them. The pill stays
   neutral and only the figures carry the colour — a tinted pill in three
   different hues would shout louder than the card's own status line. */
/* Palette only — no amber, which is not one of our colours. Green reads as
   "go", coral as "hurry", and the near-black as "done"; the three are far
   enough apart in lightness to separate without colour vision too. */
export const FILL_COLOR: Record<FillLevel, string> = {
  free: "text-brand-primary",
  filling: "text-brand-danger",
  full: "text-brand-dark",
};

/** Same three tones as fills, for the stacked figures. */
export const FILL_BG: Record<FillLevel, string> = {
  free: "bg-brand-primary",
  filling: "bg-brand-danger",
  full: "bg-brand-dark",
};
