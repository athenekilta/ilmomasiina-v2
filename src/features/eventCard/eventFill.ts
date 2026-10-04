import type { EnrichedEvent } from "./eventCardVariant";

export type FillLevel = "free" | "filling" | "full";

export type EventFill = {
  level: FillLevel;
  signupCount: number;
  capacity: number | null;
  label: string;
  countText: string;
  availabilityText: string;
};

type EventFillMessages = {
  signupCount: (count: number) => string;
  remaining: (remaining: number, capacity: number) => string;
  unlimited: string;
  spaceRemaining: (count: number, capacity: number) => string;
  filling: (count: number, capacity: number) => string;
  full: (count: number, capacity: number) => string;
  unlimitedLabel: (countText: string) => string;
};

/** Overall capacity status across all quotas and shared places. */
export function getEventFill(
  event: EnrichedEvent,
  messages: EventFillMessages,
): EventFill {
  const signupCount = event.Quotas.reduce(
    (sum, quota) => sum + quota.signupCount,
    0,
  );
  const hasUnlimitedQuota = event.Quotas.some((quota) => quota.size == null);
  const capacity = hasUnlimitedQuota
    ? null
    : event.Quotas.reduce((sum, quota) => sum + (quota.size ?? 0), 0) +
      event.extraCapacity;
  const countText = messages.signupCount(signupCount);

  if (capacity === null || capacity === 0) {
    return {
      level: "free",
      signupCount,
      capacity,
      label: messages.unlimitedLabel(countText),
      countText,
      availabilityText: messages.unlimited,
    };
  }

  const ratio = signupCount / capacity;
  const seatsLeft = Math.max(0, capacity - signupCount);
  const availabilityText = messages.remaining(seatsLeft, capacity);

  if (ratio >= 1) {
    return {
      level: "full",
      signupCount,
      capacity,
      label: messages.full(signupCount, capacity),
      countText,
      availabilityText,
    };
  }
  if (ratio >= 0.5) {
    return {
      level: "filling",
      signupCount,
      capacity,
      label: messages.filling(signupCount, capacity),
      countText,
      availabilityText,
    };
  }
  return {
    level: "free",
    signupCount,
    capacity,
    label: messages.spaceRemaining(signupCount, capacity),
    countText,
    availabilityText,
  };
}

export const FILL_STEPS: Record<FillLevel, number> = {
  free: 1,
  filling: 2,
  full: 3,
};

export const FILL_COLOR: Record<FillLevel, string> = {
  free: "text-brand-primary",
  filling: "text-brand-danger",
  full: "text-brand-dark",
};

export const FILL_BG: Record<FillLevel, string> = {
  free: "bg-brand-primary",
  filling: "bg-brand-danger",
  full: "bg-brand-dark",
};
