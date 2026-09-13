import assert from "node:assert/strict";
import test from "node:test";
import { buildQuotaBars, type QuotaBarsInput } from "./quotaBarModel";
import { QUEUE_QUOTA_ID } from "../utils/queueQuota";

type QuotaOverrides = Partial<QuotaBarsInput["Quotas"][number]>;

function quota(overrides: QuotaOverrides = {}): QuotaBarsInput["Quotas"][number] {
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

test("own places are consumed before the shared ones", () => {
  const model = buildQuotaBars({
    extraCapacity: 20,
    Quotas: [
      quota({ id: "a", size: 40, seatHoldingSignupCount: 49 }),
      quota({ id: "b", size: 40, seatHoldingSignupCount: 22 }),
    ],
  });

  // Only the nine past quota A's own forty count against the shared pool.
  assert.deepEqual(model.shared, { total: 20, remaining: 11 });
  assert.equal(model.totalSignupCount, 71);
});

test("a quota past its size reads as full with nothing free", () => {
  const [row] = buildQuotaBars({
    extraCapacity: 20,
    Quotas: [quota({ size: 40, seatHoldingSignupCount: 49 })],
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

test("a quota sized zero is full from the start", () => {
  const [row] = buildQuotaBars({
    extraCapacity: 10,
    Quotas: [quota({ size: 0, seatHoldingSignupCount: 0 })],
  }).rows;

  assert.equal(row?.fillRatio, 1);
  assert.equal(row?.freePlaces, 0);
  assert.equal(row?.continuesToShared, true);
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
    Quotas: [quota({ size: 40, seatHoldingSignupCount: 50 })],
  });

  assert.deepEqual(model.shared, { total: 10, remaining: 0 });
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
      quota({ id: "later", sharedPlacesAllocation: "AFTER_REGISTRATION_CLOSE" }),
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
      quota({ size: 5, seatHoldingSignupCount: 9, sharedPlacesAllocation: "NEVER" }),
      quota({ id: "b", size: 40, seatHoldingSignupCount: 43 }),
    ],
  });

  assert.deepEqual(model.shared, { total: 10, remaining: 7 });
});

test("cancellations put the shared places, and the continuation, back", () => {
  const full = buildQuotaBars({
    extraCapacity: 4,
    Quotas: [quota({ size: 40, seatHoldingSignupCount: 44 })],
  });
  assert.deepEqual(full.shared, { total: 4, remaining: 0 });
  assert.equal(full.rows[0]?.continuesToShared, false);

  // Two signups leave the quota.
  const after = buildQuotaBars({
    extraCapacity: 4,
    Quotas: [quota({ size: 40, seatHoldingSignupCount: 42 })],
  });
  assert.deepEqual(after.shared, { total: 4, remaining: 2 });
  assert.equal(after.rows[0]?.continuesToShared, true);
  assert.equal(after.rows[0]?.fillRatio, 1);

  // And enough leave that the quota has its own places free again.
  const emptier = buildQuotaBars({
    extraCapacity: 4,
    Quotas: [quota({ size: 40, seatHoldingSignupCount: 37 })],
  });
  assert.deepEqual(emptier.shared, { total: 4, remaining: 4 });
  assert.equal(emptier.rows[0]?.freePlaces, 3);
  assert.equal(emptier.rows[0]?.fillRatio, 37 / 40);
});
