import assert from "node:assert/strict";
import test from "node:test";
import { buildQuotaBars, type QuotaBarsInput } from "./quotaBarModel";
import { QUEUE_QUOTA_ID } from "../utils/queueQuota";

type QuotaOverrides = Partial<QuotaBarsInput["Quotas"][number]>;

function quota(
  overrides: QuotaOverrides = {},
): QuotaBarsInput["Quotas"][number] {
  return {
    id: "quota",
    title: "Kiintiö",
    size: 40,
    sharedPlacesAllocation: "IMMEDIATE",
    seatHoldingSignupCount: 0,
    waitlistedSignupCount: 0,
    signupCount: 0,
    ...overrides,
  };
}

/** The pool's size alone, for tests that are about the arithmetic and not
 *  about who is sitting in it. */
function pool(shared: ReturnType<typeof buildQuotaBars>["shared"]) {
  return shared && { total: shared.total, remaining: shared.remaining };
}

test("own places are consumed before the shared ones", () => {
  const model = buildQuotaBars({
    extraCapacity: 20,
    Quotas: [
      quota({ id: "a", size: 40, seatHoldingSignupCount: 49 }),
      quota({ id: "b", size: 40, seatHoldingSignupCount: 22 }),
    ],
  });

  // Only the nine past quota A's own forty count against the shared pool.
  assert.deepEqual(pool(model.shared), { total: 20, remaining: 11 });
  assert.equal(model.totalSignupCount, 71);
});

test("a quota past its size reads as full with nothing free", () => {
  const [row] = buildQuotaBars({
    extraCapacity: 20,
    Quotas: [
      quota({ size: 40, seatHoldingSignupCount: 49 }),
      quota({ id: "idle" }),
    ],
  }).rows;

  assert.equal(row?.fillRatio, 1);
  assert.equal(row?.freePlaces, 0);
});

test("a quota with no ceiling has neither a proportion nor a figure", () => {
  const [row] = buildQuotaBars({
    extraCapacity: 0,
    Quotas: [quota({ size: null, seatHoldingSignupCount: 12 })],
  }).rows;

  assert.equal(row?.fillRatio, null);
  assert.equal(row?.freePlaces, null);
  assert.equal(row?.signupCount, 12);
});

test("a quota with no places of its own is not drawn a bar", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      // The "Muut" case: exists so people can pick it and land in the open
      // pool. Its bar would be an empty one every time.
      quota({ id: "muut", size: 0, seatHoldingSignupCount: 3 }),
      quota({ id: "athene", seatHoldingSignupCount: 5 }),
    ],
  });

  assert.deepEqual(
    model.rows.map((row) => row.id),
    ["athene"],
  );
  // Its people are still counted, and they show in the open pool under this
  // quota's own colour.
  assert.equal(model.totalSignupCount, 8);
  assert.deepEqual(model.shared?.holders, [
    { id: "muut", title: "Kiintiö", count: 3, colorIndex: 0 },
    { id: "athene", title: "Kiintiö", count: 0, colorIndex: 1 },
  ]);
});

test("a quota sized zero that may not reach the pool keeps its row", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      quota({ id: "dead", size: 0, sharedPlacesAllocation: "NEVER" }),
      quota({ id: "idle" }),
    ],
  });

  // No way in at all — a misconfiguration, and the row is what makes it show.
  assert.deepEqual(
    model.rows.map((row) => row.id),
    ["dead", "idle"],
  );
  assert.equal(model.rows[0]?.fillRatio, 1);
});

test("an event without shared places has none to report", () => {
  const model = buildQuotaBars({
    extraCapacity: 0,
    Quotas: [quota({ seatHoldingSignupCount: 5 })],
  });

  assert.equal(model.shared, null);
  assert.equal(model.rows[0]?.continuesToShared, false);
});

test("no row continues once the shared places are gone", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      quota({ size: 40, seatHoldingSignupCount: 50 }),
      quota({ id: "idle" }),
    ],
  });

  assert.deepEqual(pool(model.shared), { total: 10, remaining: 0 });
  assert.equal(model.rows[0]?.continuesToShared, false);
});

test("allocation policy decides whether a row continues", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      quota({ id: "never", sharedPlacesAllocation: "NEVER" }),
      quota({ id: "now", sharedPlacesAllocation: "IMMEDIATE" }),
      // Waiting for the places is still getting them, so the row does not
      // dead-end and has to say so.
      quota({
        id: "later",
        sharedPlacesAllocation: "AFTER_REGISTRATION_CLOSE",
      }),
    ],
  });

  assert.deepEqual(
    model.rows.map((row) => row.continuesToShared),
    [false, true, true],
  );
});

test("the queue quota is counted but never drawn", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      quota({ id: "a", seatHoldingSignupCount: 40 }),
      quota({
        id: QUEUE_QUOTA_ID,
        title: "Queue",
        size: null,
        sharedPlacesAllocation: "NEVER",
        signupCount: 12,
      }),
    ],
  });

  assert.deepEqual(
    model.rows.map((row) => row.id),
    ["a"],
  );
  assert.equal(model.queuedCount, 12);
  // The queue holds no places, so it cannot move the totals.
  assert.equal(model.totalSignupCount, 40);
});

test("without a queue quota the waitlists are the queue", () => {
  const model = buildQuotaBars({
    extraCapacity: 0,
    Quotas: [
      quota({ id: "a", waitlistedSignupCount: 3 }),
      quota({ id: "b", waitlistedSignupCount: 4 }),
    ],
  });

  assert.equal(model.queuedCount, 7);
});

test("colours follow the order the quotas are given in", () => {
  const model = buildQuotaBars({
    extraCapacity: 0,
    Quotas: [quota({ id: "a" }), quota({ id: "b" }), quota({ id: "c" })],
  });

  assert.deepEqual(
    model.rows.map((row) => row.colorIndex),
    [0, 1, 2],
  );
});

test("a negative extraCapacity cannot produce a negative pool", () => {
  const model = buildQuotaBars({
    extraCapacity: -5,
    Quotas: [quota({ seatHoldingSignupCount: 1 })],
  });

  assert.equal(model.shared, null);
});

test("a quota that may not use the shared places cannot consume them", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      // Over its own size, but barred from the shared pool: the overflow is a
      // data error and must not eat places other quotas can still reach.
      quota({
        size: 5,
        seatHoldingSignupCount: 9,
        sharedPlacesAllocation: "NEVER",
      }),
      quota({ id: "b", size: 40, seatHoldingSignupCount: 43 }),
    ],
  });

  assert.deepEqual(pool(model.shared), { total: 10, remaining: 7 });
});

test("cancellations put the shared places, and the continuation, back", () => {
  const full = buildQuotaBars({
    extraCapacity: 4,
    Quotas: [
      quota({ size: 40, seatHoldingSignupCount: 44 }),
      quota({ id: "idle" }),
    ],
  });
  assert.deepEqual(pool(full.shared), { total: 4, remaining: 0 });
  assert.equal(full.rows[0]?.continuesToShared, false);

  // Two signups leave the quota.
  const after = buildQuotaBars({
    extraCapacity: 4,
    Quotas: [
      quota({ size: 40, seatHoldingSignupCount: 42 }),
      quota({ id: "idle" }),
    ],
  });
  assert.deepEqual(pool(after.shared), { total: 4, remaining: 2 });
  assert.equal(after.rows[0]?.continuesToShared, true);
  assert.equal(after.rows[0]?.fillRatio, 1);

  // And enough leave that the quota has its own places free again.
  const emptier = buildQuotaBars({
    extraCapacity: 4,
    Quotas: [
      quota({ size: 40, seatHoldingSignupCount: 37 }),
      quota({ id: "idle" }),
    ],
  });
  assert.deepEqual(pool(emptier.shared), { total: 4, remaining: 4 });
  assert.equal(emptier.rows[0]?.freePlaces, 3);
  assert.equal(emptier.rows[0]?.fillRatio, 37 / 40);
});

test("a lone quota has no shared places, only more of its own", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [quota({ size: 40, seatHoldingSignupCount: 44 })],
  });

  // The places are real and stay in the event's capacity — with nobody to
  // share them with they are simply this quota's own places.
  assert.equal(model.shared, null);
  assert.equal(model.rows[0]?.size, 50);
  assert.equal(model.rows[0]?.freePlaces, 6);
  assert.equal(model.rows[0]?.fillRatio, 44 / 50);
  assert.equal(model.rows[0]?.continuesToShared, false);
});

test("a lone quota barred from the shared places keeps its own size", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      quota({
        size: 40,
        seatHoldingSignupCount: 12,
        sharedPlacesAllocation: "NEVER",
      }),
    ],
  });

  // Unreachable places: folding them in would promise seats nobody can take.
  assert.equal(model.shared, null);
  assert.equal(model.rows[0]?.size, 40);
  assert.equal(model.rows[0]?.freePlaces, 28);
});

test("the queue quota does not make a lone quota into two", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      quota({ id: "a", size: 40, seatHoldingSignupCount: 44 }),
      quota({
        id: QUEUE_QUOTA_ID,
        title: "Queue",
        size: null,
        sharedPlacesAllocation: "NEVER",
        signupCount: 3,
      }),
    ],
  });

  assert.equal(model.shared, null);
  assert.equal(model.rows[0]?.size, 50);
});

test("the shared places name who is sitting in them", () => {
  const model = buildQuotaBars({
    extraCapacity: 20,
    Quotas: [
      // Nine past its own forty.
      quota({ id: "a", title: "Athene", size: 40, seatHoldingSignupCount: 49 }),
      // Inside its own places, so it holds none of the shared ones.
      quota({
        id: "b",
        title: "Prodeko",
        size: 40,
        seatHoldingSignupCount: 22,
      }),
      // Three past its own, and two past that again.
      quota({ id: "c", title: "Muut", size: 3, seatHoldingSignupCount: 5 }),
    ],
  });

  // Every quota that may use the pool is listed, Prodeko included: the key
  // under the bar is where a member learns their quota can reach it at all.
  assert.deepEqual(model.shared?.holders, [
    { id: "a", title: "Athene", count: 9, colorIndex: 0 },
    { id: "b", title: "Prodeko", count: 0, colorIndex: 1 },
    { id: "c", title: "Muut", count: 2, colorIndex: 2 },
  ]);
  // The colours are the quotas' own, so a holder keeps the index of its row
  // rather than its position among the holders.
  assert.equal(model.shared?.remaining, 9);
});

test("a quota barred from the shared places never appears in them", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      quota({
        id: "never",
        size: 5,
        seatHoldingSignupCount: 9,
        sharedPlacesAllocation: "NEVER",
      }),
      quota({ id: "ok", size: 40, seatHoldingSignupCount: 42 }),
    ],
  });

  // The barred quota is not listed at all — it cannot reach the pool.
  assert.deepEqual(
    model.shared?.holders.map((holder) => holder.id),
    ["ok"],
  );
});

test("untouched shared places have no holders", () => {
  const model = buildQuotaBars({
    extraCapacity: 6,
    Quotas: [
      quota({ id: "a", size: 40, seatHoldingSignupCount: 10 }),
      quota({ id: "b", size: 40, seatHoldingSignupCount: 0 }),
    ],
  });

  assert.deepEqual(model.shared, {
    total: 6,
    remaining: 6,
    holders: [
      { id: "a", title: "Kiintiö", count: 0, colorIndex: 0 },
      { id: "b", title: "Kiintiö", count: 0, colorIndex: 1 },
    ],
  });
});

test("holders can never claim more places than the pool has", () => {
  const model = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [
      // Thirty past its own six, but only ten shared places exist — the rest
      // of those signups are really in the queue.
      quota({
        id: "a",
        title: "ristokka",
        size: 6,
        seatHoldingSignupCount: 36,
      }),
      quota({ id: "b", title: "Limee", size: 12, seatHoldingSignupCount: 20 }),
    ],
  });

  const held = model.shared!.holders.reduce((sum, h) => sum + h.count, 0);
  assert.equal(held, 10);
  assert.equal(model.shared?.remaining, 0);
  // First in the quota order takes what there is; nothing is left for the next.
  assert.deepEqual(
    model.shared?.holders.map((h) => [h.id, h.count]),
    [
      ["a", 10],
      ["b", 0],
    ],
  );
});
