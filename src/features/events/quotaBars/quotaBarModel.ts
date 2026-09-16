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
  /**
   * When this quota reaches the shared places, as opposed to whether any are
   * left. The row has to say this before it fills, or nobody can tell a quota
   * that continues from one that dead-ends — and "now" and "after
   * registration closes" are different enough promises that one word cannot
   * carry both.
   */
  sharedAccess: "now" | "afterClose" | "never";
  /**
   * Places this quota's people took from the shared pool — what makes the
   * signup count exceed the quota's own size. Zero for a quota that may
   * never use them, whatever its counts say.
   */
  sharedPlacesUsed: number;
  colorIndex: number;
};

/** One quota's standing in the shared places. */
export type SharedPlaceHolder = {
  id: string;
  title: string;
  /** Members of this quota sitting in a shared place. May be zero. */
  count: number;
  colorIndex: number;
};

export type SharedPlaces = {
  total: number;
  remaining: number;
  /**
   * Every quota that MAY use the shared places, in the quotas' own order,
   * with how many it currently holds. Quotas with none are listed too: the
   * key under the bar is where a member finds out whether their own quota
   * can reach the pool at all, and it has to answer that before anybody has
   * spilled into it.
   */
  holders: SharedPlaceHolder[];
};

export type QuotaBarsModel = {
  rows: QuotaBarRow[];
  /** Everyone holding a place, across every quota. */
  totalSignupCount: number;
  /** `null` when the event has no shared places at all. */
  shared: SharedPlaces | null;
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
  const extraCapacity = Math.max(event.extraCapacity, 0);
  const quotas = foldLoneQuotaSharedPlaces(
    event.Quotas.filter((quota) => quota.id !== QUEUE_QUOTA_ID),
    extraCapacity,
  );

  const totalSignupCount = quotas.reduce(
    (sum, quota) => sum + quota.seatHoldingSignupCount,
    0,
  );
  // Only a quota allowed to use the shared places can have spilled into
  // them. Overflow in a quota that may not is a data error, and counting it
  // here would make the shared places look emptier than they are to everyone
  // who can actually reach them.
  const sharedTotal = quotas.length > 1 ? extraCapacity : 0;
  // One pass, used twice: the bars draw each quota's own overflow band from
  // it, and the pool's remainder is what is left after all of them.
  const sharedUse = quotas.map((quota) =>
    quota.sharedPlacesAllocation === "NEVER"
      ? 0
      : Math.max(quota.seatHoldingSignupCount - ownPlacesUsed(quota), 0),
  );
  // Clamped against the pool, in quota order. Counts are derived from signup
  // totals, and those can claim more shared places than the event has — a
  // quota of six with thirty-six signups and ten shared places, where the
  // rest are really in the queue. Unclamped, the bar would say 10 / 10 and
  // its own key would say 30.
  let sharedLeft = sharedTotal;
  const holders = quotas
    .map((quota, index) => {
      const count = Math.min(sharedUse[index] ?? 0, sharedLeft);
      sharedLeft -= count;
      return { id: quota.id, title: quota.title, colorIndex: index, count };
    })
    .filter((_, index) => quotas[index]?.sharedPlacesAllocation !== "NEVER");
  const sharedInUse = holders.reduce((sum, holder) => sum + holder.count, 0);
  const sharedRemaining = Math.max(sharedTotal - sharedInUse, 0);
  const shared =
    sharedTotal > 0
      ? { total: sharedTotal, remaining: sharedRemaining, holders }
      : null;

  const rows = quotas
    .map((quota, index) => ({ quota, row: buildRow(quota, index) }))
    .filter(({ quota }) => !ownsNoPlaces(quota))
    .map(({ row }) => row);

  return { rows, totalSignupCount, shared, queuedCount: queuedCount(event) };

  function buildRow(quota: QuotaInput, index: number): QuotaBarRow {
    return {
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
      sharedAccess:
        sharedTotal === 0 || quota.sharedPlacesAllocation === "NEVER"
          ? "never"
          : quota.sharedPlacesAllocation === "IMMEDIATE"
            ? "now"
            : "afterClose",
      sharedPlacesUsed: sharedUse[index] ?? 0,
      colorIndex: index,
    };
  }
}

/**
 * A quota sized 0 that may use the shared places owns nothing of its own: it
 * exists so that people can pick it and land in the open pool — the "Muut"
 * case. Giving it a bar would draw an empty one every time; its people are in
 * the open bar instead, in this quota's own colour, which is where they are.
 *
 * Sized 0 and barred from the pool is a different thing: a quota with no way
 * in at all. That one keeps its row, so the mistake stays visible.
 */
function ownsNoPlaces(quota: QuotaInput): boolean {
  return quota.size === 0 && quota.sharedPlacesAllocation !== "NEVER";
}

/**
 * Shared places only mean something when the event has more than one quota.
 * With a single quota they are that quota's own places under another name —
 * the allocator lets exactly the same people into exactly the same places
 * either way — so drawing them as a pool of their own invents a distinction
 * the event does not have.
 *
 * They are folded into the quota rather than dropped, because the places are
 * real: the event's capacity has to come out the same as everywhere else.
 * The exception is a lone quota that may never touch them — those places are
 * unreachable, and folding them in would promise seats nobody can take.
 */
function foldLoneQuotaSharedPlaces(
  quotas: readonly QuotaInput[],
  extraCapacity: number,
): readonly QuotaInput[] {
  const only = quotas.length === 1 ? quotas[0] : undefined;
  if (!only || extraCapacity === 0) return quotas;
  if (only.sharedPlacesAllocation === "NEVER" || only.size === null) {
    return quotas;
  }
  return [{ ...only, size: only.size + extraCapacity }];
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
  return event.Quotas.reduce(
    (sum, quota) => sum + quota.waitlistedSignupCount,
    0,
  );
}
