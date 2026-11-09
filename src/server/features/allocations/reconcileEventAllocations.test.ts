import assert from "node:assert/strict";
import test from "node:test";
import {
  SharedPlacesAllocation,
  SignupStatus,
} from "@/generated/prisma/client";
import { reconcileEventAllocations } from "./reconcileEventAllocations";

type TestSignup = {
  id: string;
  name: string;
  identity: { email: string };
  status: SignupStatus;
  completedAt: Date | null;
  createdAt: Date;
  allocatedAt: Date | null;
};

type TestQuota = {
  id: string;
  size: number | null;
  sharedPlacesAllocation: SharedPlacesAllocation;
  sortId: number;
  Signups: TestSignup[];
};

const signup = (
  id: string,
  order: number,
  status: SignupStatus = SignupStatus.WAITLISTED,
): TestSignup => ({
  id,
  name: id,
  identity: { email: `${id}@example.com` },
  status,
  completedAt: new Date(2026, 0, 1, 12, order),
  createdAt: new Date(2026, 0, 1, 12, order),
  allocatedAt: status === SignupStatus.CONFIRMED ? new Date() : null,
});

async function allocate({
  quotas,
  sharedPlaces,
  afterClose = false,
  cancelledSignupId,
}: {
  quotas: TestQuota[];
  sharedPlaces: number;
  afterClose?: boolean;
  cancelledSignupId?: string;
}) {
  const updates = new Map<string, SignupStatus>();
  const event = {
    id: 1,
    title: "Test event",
    extraCapacity: sharedPlaces,
    registrationEndDate: afterClose
      ? new Date(2026, 0, 1)
      : new Date(2099, 0, 1),
    Quotas: quotas.map((quota) => ({
      ...quota,
      Signups: quota.Signups.filter(
        (signup) => signup.id !== cancelledSignupId,
      ),
    })),
  };
  const tx = {
    $executeRaw: async () => 0,
    event: { findUnique: async () => event },
    signup: {
      update: async ({
        where,
        data,
      }: {
        where: { id: string };
        data: { status: SignupStatus };
      }) => {
        updates.set(where.id, data.status);
        return { id: where.id, ...data };
      },
    },
  };

  const result = await reconcileEventAllocations(
    tx as never,
    event.id,
    afterClose ? { forceAfterClose: true } : {},
  );
  return {
    allocated: result.allocatedSignupIds,
    queueAcceptedNotification: result.queueAcceptedNotification,
    updates,
  };
}

test("a confirmed shared signup moves into a freed protected place", async () => {
  const employeeUsingShared = signup(
    "employee-shared",
    1,
    SignupStatus.CONFIRMED,
  );
  const nextEmployee = signup("employee-next", 2);

  const result = await allocate({
    quotas: [
      {
        id: "employees",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 1,
        Signups: [employeeUsingShared, nextEmployee],
      },
    ],
    sharedPlaces: 1,
  });

  assert.deepEqual([...result.allocated].sort(), [
    "employee-next",
    "employee-shared",
  ]);
  assert.deepEqual(result.queueAcceptedNotification.signupIds, [
    "employee-next",
  ]);
});

test("trip categories compete for shared places by click time", async () => {
  const result = await allocate({
    quotas: [
      {
        id: "bus-and-hotel",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 1,
        Signups: [signup("bus-own", 1), signup("bus-overflow", 4)],
      },
      {
        id: "hotel-only",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 2,
        Signups: [signup("hotel-own", 2), signup("hotel-overflow", 3)],
      },
    ],
    sharedPlaces: 1,
  });

  assert.equal(result.allocated.has("hotel-overflow"), true);
  assert.equal(result.allocated.has("bus-overflow"), false);
});

test("sitsis policies allocate protected, shared, and deferred places", async () => {
  const quotas: TestQuota[] = [
    {
      id: "freshmen",
      size: 2,
      sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
      sortId: 1,
      Signups: [signup("f1", 1), signup("f2", 2), signup("f3", 6)],
    },
    {
      id: "tutors",
      size: 1,
      sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
      sortId: 2,
      Signups: [signup("t1", 3), signup("t2", 7)],
    },
    {
      id: "others",
      size: 1,
      sharedPlacesAllocation: SharedPlacesAllocation.AFTER_REGISTRATION_CLOSE,
      sortId: 3,
      Signups: [signup("o1", 4), signup("o2", 5)],
    },
    {
      id: "organizers",
      size: 1,
      sharedPlacesAllocation: SharedPlacesAllocation.NEVER,
      sortId: 4,
      Signups: [signup("g1", 8), signup("g2", 9)],
    },
  ];

  const beforeClose = await allocate({ quotas, sharedPlaces: 3 });
  assert.equal(beforeClose.allocated.has("o1"), true);
  assert.equal(beforeClose.allocated.has("o2"), false);
  assert.equal(beforeClose.updates.get("o2"), SignupStatus.PENDING);
  assert.equal(beforeClose.allocated.has("g1"), true);
  assert.equal(beforeClose.allocated.has("g2"), false);
  assert.equal(beforeClose.updates.get("g2"), SignupStatus.WAITLISTED);

  const afterClose = await allocate({
    quotas,
    sharedPlaces: 3,
    afterClose: true,
  });
  assert.equal(afterClose.allocated.has("f3"), true);
  assert.equal(afterClose.allocated.has("t2"), true);
  assert.equal(afterClose.allocated.has("o2"), true);
  assert.equal(afterClose.allocated.has("g2"), false);
});

test("unused protected places are not shared", async () => {
  const result = await allocate({
    quotas: [
      {
        id: "protected",
        size: 2,
        sharedPlacesAllocation: SharedPlacesAllocation.NEVER,
        sortId: 1,
        Signups: [],
      },
      {
        id: "open",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 2,
        Signups: [
          signup("open-own", 1),
          signup("open-shared", 2),
          signup("open-waiting", 3),
        ],
      },
    ],
    sharedPlaces: 1,
  });

  assert.equal(result.allocated.has("open-own"), true);
  assert.equal(result.allocated.has("open-shared"), true);
  assert.equal(result.allocated.has("open-waiting"), false);
});

test("a zero-sized quota can allocate transferred shared places", async () => {
  const result = await allocate({
    quotas: [
      {
        id: "transferred",
        size: 0,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 1,
        Signups: [signup("shared", 1)],
      },
    ],
    sharedPlaces: 1,
  });

  assert.equal(result.allocated.has("shared"), true);
});

test("an unlimited legacy quota does not consume finite shared places", async () => {
  const result = await allocate({
    quotas: [
      {
        id: "legacy-unlimited",
        size: null,
        sharedPlacesAllocation: SharedPlacesAllocation.NEVER,
        sortId: 1,
        Signups: [signup("legacy-1", 1), signup("legacy-2", 2)],
      },
      {
        id: "finite",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 2,
        Signups: [signup("finite-own", 3), signup("finite-shared", 4)],
      },
    ],
    sharedPlaces: 1,
  });

  assert.equal(result.allocated.has("finite-shared"), true);
});

test("cancelling a protected place promotes the first person in that quota", async () => {
  const result = await allocate({
    quotas: [
      {
        id: "protected",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.NEVER,
        sortId: 1,
        Signups: [
          signup("cancelled", 1, SignupStatus.CONFIRMED),
          signup("next", 3),
          signup("later", 4),
        ],
      },
      {
        id: "other",
        size: 0,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 2,
        Signups: [signup("earlier-other-quota", 2)],
      },
    ],
    sharedPlaces: 0,
    cancelledSignupId: "cancelled",
  });

  assert.deepEqual([...result.allocated], ["next"]);
  assert.equal(result.updates.get("next"), SignupStatus.CONFIRMED);
  assert.equal(result.updates.get("later"), SignupStatus.WAITLISTED);
  assert.deepEqual(result.queueAcceptedNotification, {
    eventId: 1,
    signupIds: ["next"],
  });
});

test("cancelling a shared place promotes the earliest eligible signup across quotas", async () => {
  const result = await allocate({
    quotas: [
      {
        id: "first",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 1,
        Signups: [
          signup("first-own", 1, SignupStatus.CONFIRMED),
          signup("cancelled", 3, SignupStatus.CONFIRMED),
          signup("later", 5),
        ],
      },
      {
        id: "second",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 2,
        Signups: [
          signup("second-own", 2, SignupStatus.CONFIRMED),
          signup("next", 4),
        ],
      },
      {
        id: "deferred",
        size: 0,
        sharedPlacesAllocation: SharedPlacesAllocation.AFTER_REGISTRATION_CLOSE,
        sortId: 3,
        Signups: [signup("pending", 0, SignupStatus.PENDING)],
      },
    ],
    sharedPlaces: 1,
    cancelledSignupId: "cancelled",
  });

  assert.equal(result.updates.get("next"), SignupStatus.CONFIRMED);
  assert.equal(result.updates.get("later"), SignupStatus.WAITLISTED);
  assert.equal(result.updates.get("pending"), SignupStatus.PENDING);
  assert.deepEqual(result.queueAcceptedNotification.signupIds, ["next"]);
});

test("leaving a queue does not release a place or notify existing participants", async () => {
  const result = await allocate({
    quotas: [
      {
        id: "quota",
        size: 1,
        sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
        sortId: 1,
        Signups: [
          signup("confirmed", 1, SignupStatus.CONFIRMED),
          signup("cancelled", 2),
          signup("waiting", 3),
        ],
      },
    ],
    sharedPlaces: 0,
    cancelledSignupId: "cancelled",
  });

  assert.deepEqual([...result.allocated], ["confirmed"]);
  assert.equal(result.updates.get("waiting"), SignupStatus.WAITLISTED);
  assert.deepEqual(result.queueAcceptedNotification.signupIds, []);
});

test("a promoted participant is not notified again on subsequent reconciliation", async () => {
  const quotas: TestQuota[] = [
    {
      id: "quota",
      size: 1,
      sharedPlacesAllocation: SharedPlacesAllocation.IMMEDIATE,
      sortId: 1,
      Signups: [
        signup("cancelled", 1, SignupStatus.CONFIRMED),
        signup("next", 2),
      ],
    },
  ];
  const first = await allocate({
    quotas,
    sharedPlaces: 0,
    cancelledSignupId: "cancelled",
  });
  assert.deepEqual(first.queueAcceptedNotification.signupIds, ["next"]);

  for (const quota of quotas) {
    for (const signup of quota.Signups) {
      signup.status = first.updates.get(signup.id) ?? signup.status;
    }
  }
  const second = await allocate({
    quotas,
    sharedPlaces: 0,
    cancelledSignupId: "cancelled",
  });
  assert.deepEqual([...second.allocated], ["next"]);
  assert.deepEqual(second.queueAcceptedNotification.signupIds, []);
});
