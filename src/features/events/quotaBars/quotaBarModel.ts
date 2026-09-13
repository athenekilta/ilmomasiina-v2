import type { SharedPlacesAllocation } from "@/generated/prisma";
import { QUEUE_QUOTA_ID } from "../utils/queueQuota";

type QuotaInput = {
  id: string;
  title: string;
  /** Protected places. `null` means the quota has no ceiling. */
  size: number | null;
  sharedPlacesAllocation: SharedPlacesAllocation;
  /** Signups occupying a place: confirmed, plus ones still in progress. */
  seatHoldingSignupCount: number;
  waitlistedSignupCount: number;
  signupCount: number;
};

export type QuotaBarsInput = {
  /** Shared places — the ones outside every quota. */
  extraCapacity: number;
  Quotas: readonly QuotaInput[];
};

export type QuotaBarRow = {
  id: string;
  title: string;
  signupCount: number;
  size: number | null;
  /**
   * How much of the quota's own places are taken, 0–1. `null` when the quota
   * has no ceiling, where a proportion would be a number we made up.
   */
  fillRatio: number | null;
  /** Own places still free, or `null` when the quota has no ceiling. */
  freePlaces: number | null;
  /**
   * Whether someone turned away from this quota can still take a shared
   * place. A property of the quota, not of how full it is right now — the
   * row shows the continuation before the quota fills, which is the point.
   */
  continuesToShared: boolean;
  colorIndex: number;
};

export type QuotaBarsModel = {
  rows: QuotaBarRow[];
  /** Everyone holding a place, across every quota. */
  totalSignupCount: number;
  /** `null` when the event has no shared places at all. */
  shared: { total: number; remaining: number } | null;
  /** Signups waiting for a place: pending allocation or waitlisted. */
  queuedCount: number;
};

/**
 * Turns an event into the figures the bars draw.
 *
 * The arithmetic mirrors the event page's own capacity maths, so the bars and
 * the rest of the page can never disagree: a quota's own places are consumed
 * first, and only the overflow past them counts against the shared pool.
 */
export function buildQuotaBars(event: QuotaBarsInput): QuotaBarsModel {
  const quotas = event.Quotas.filter((quota) => quota.id !== QUEUE_QUOTA_ID);

  const totalSignupCount = quotas.reduce(
    (sum, quota) => sum + quota.seatHoldingSignupCount,
    0,
  );
  // Only a quota allowed to use the shared places can have spilled into
  // them. Overflow in a quota that may not is a data error, and counting it
  // here would make the shared places look emptier than they are to everyone
  // who can actually reach them.
  const sharedTotal = Math.max(event.extraCapacity, 0);
  const sharedInUse = quotas.reduce(
    (sum, quota) =>
      quota.sharedPlacesAllocation === "NEVER"
        ? sum
        : sum + (quota.seatHoldingSignupCount - ownPlacesUsed(quota)),
    0,
  );
  const sharedRemaining = Math.max(sharedTotal - sharedInUse, 0);
  const shared = sharedTotal > 0 ? { total: sharedTotal, remaining: sharedRemaining } : null;

  const rows = quotas.map((quota, index) => ({
    id: quota.id,
    title: quota.title,
    signupCount: quota.seatHoldingSignupCount,
    size: quota.size,
    fillRatio: fillRatio(quota),
    freePlaces:
      quota.size === null
        ? null
        : Math.max(quota.size - quota.seatHoldingSignupCount, 0),
    // Both allocation policies end with the signup taking a shared place;
    // AFTER_REGISTRATION_CLOSE only makes them wait for it. Either way the
    // row does not dead-end, which is what the continuation says.
    continuesToShared:
      quota.sharedPlacesAllocation !== "NEVER" && sharedRemaining > 0,
    colorIndex: index,
  }));

  return { rows, totalSignupCount, shared, queuedCount: queuedCount(event) };
}

/** Places this quota takes from its own allocation, never more than it has. */
function ownPlacesUsed(quota: QuotaInput): number {
  return quota.size === null
    ? quota.seatHoldingSignupCount
    : Math.min(quota.seatHoldingSignupCount, quota.size);
}

function fillRatio(quota: QuotaInput): number | null {
  if (quota.size === null) return null;
  // A quota sized 0 has no places of its own to fill, so it is full from the
  // start — and its row leans entirely on the continuation into the shared
  // places, which is exactly what such a quota is for.
  if (quota.size === 0) return 1;
  return Math.min(quota.seatHoldingSignupCount / quota.size, 1);
}

/**
 * The queue quota carries every pending and waitlisted signup once the router
 * has moved them there. Events that arrive without it (the admin list, tests)
 * fall back to the per-quota waitlist counts.
 */
function queuedCount(event: QuotaBarsInput): number {
  const queue = event.Quotas.find((quota) => quota.id === QUEUE_QUOTA_ID);
  if (queue) return queue.signupCount;
  return event.Quotas.reduce((sum, quota) => sum + quota.waitlistedSignupCount, 0);
}
