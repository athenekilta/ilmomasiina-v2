import {
  SharedPlacesAllocation,
  Prisma,
  SignupStatus,
} from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";
import type { QueueAcceptedNotification } from "./sendQueueAcceptedEmails";

type Tx = Prisma.TransactionClient;

type ReconcileOptions = {
  forceAfterClose?: boolean;
};

async function sendQueueAcceptedEmails(
  notification: QueueAcceptedNotification,
) {
  const mail = await import("./sendQueueAcceptedEmails");
  await mail.sendQueueAcceptedEmails(notification);
}

const IN_PROGRESS_RESERVATION_MINUTES = 20;

export async function cleanupExpiredInProgressSignups(prisma: PrismaClient) {
  const expiresBefore = new Date(
    Date.now() - IN_PROGRESS_RESERVATION_MINUTES * 60 * 1000,
  );
  const events = await prisma.event.findMany({
    where: {
      Quotas: {
        some: {
          Signups: {
            some: {
              completedAt: null,
              createdAt: { lte: expiresBefore },
              registrationIntent: null,
            },
          },
        },
      },
    },
    select: { id: true },
  });

  for (const event of events) {
    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${event.id})`;
      await tx.signup.deleteMany({
        where: {
          Quota: { eventId: event.id },
          completedAt: null,
          createdAt: { lte: expiresBefore },
          registrationIntent: null,
        },
      });
      return reconcileEventAllocations(tx, event.id);
    });
    await sendQueueAcceptedEmails(result.queueAcceptedNotification);
  }
}

export async function finalizeClosedEventAllocations(prisma: PrismaClient) {
  const events = await prisma.event.findMany({
    where: {
      registrationEndDate: { lte: new Date() },
      Quotas: {
        some: {
          sharedPlacesAllocation:
            SharedPlacesAllocation.AFTER_REGISTRATION_CLOSE,
          Signups: { some: { status: SignupStatus.PENDING } },
        },
      },
    },
    select: { id: true },
  });

  for (const event of events) {
    const result = await prisma.$transaction((tx) =>
      reconcileEventAllocations(tx, event.id, { forceAfterClose: true }),
    );
    await sendQueueAcceptedEmails(result.queueAcceptedNotification);
  }
}

export async function reconcileEventAllocations(
  tx: Tx,
  eventId: number,
  options: ReconcileOptions = {},
) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${eventId})`;

  const event = await tx.event.findUnique({
    where: { id: eventId },
    include: {
      Quotas: {
        orderBy: [{ sortId: "asc" }, { id: "asc" }],
        include: {
          Signups: {
            where: {
              status: { not: SignupStatus.REJECTED },
              registrationIntent: null,
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
          },
        },
      },
    },
  });

  if (!event) throw new Error("Event not found");

  const afterClose =
    options.forceAfterClose || event.registrationEndDate <= new Date();
  const allocated = new Set<string>();

  // Confirmed registrations are grandfathered when capacities are reduced or
  // policies are changed. Admins can move them without unexpectedly evicting
  // participants who have already received a confirmation.
  for (const quota of event.Quotas) {
    for (const signup of quota.Signups) {
      if (signup.status === SignupStatus.CONFIRMED) allocated.add(signup.id);
    }
  }

  const allocatable = (quota: (typeof event.Quotas)[number]) =>
    quota.Signups.filter(
      (signup) =>
        !allocated.has(signup.id) && signup.status !== SignupStatus.REJECTED,
    );

  // Every quota allocates its own protected places immediately.
  for (const quota of event.Quotas) {
    const capacity = quota.size ?? Number.MAX_SAFE_INTEGER;
    const occupied = quota.Signups.filter((signup) =>
      allocated.has(signup.id),
    ).length;
    for (const signup of allocatable(quota).slice(
      0,
      Math.max(capacity - occupied, 0),
    )) {
      allocated.add(signup.id);
    }
  }

  const immediateQuotas = event.Quotas.filter(
    (item) => item.sharedPlacesAllocation === SharedPlacesAllocation.IMMEDIATE,
  );

  const totalCapacity =
    event.Quotas.reduce((sum, quota) => sum + (quota.size ?? 0), 0) +
    event.extraCapacity;
  {
    // Legacy quotas with a null size are unlimited. Their protected signups do
    // not consume the finite capacity calculated from sized quotas.
    const currentlyAllocated = () => {
      const unlimitedQuotaSignups = event.Quotas.reduce(
        (sum, quota) =>
          quota.size === null
            ? sum +
              quota.Signups.filter((signup) => allocated.has(signup.id)).length
            : sum,
        0,
      );
      return allocated.size - unlimitedQuotaSignups;
    };
    // Unused quota places remain protected for every policy. Administrators
    // can explicitly resize quotas when those places should be made available.
    const unusedQuotaPlaces = event.Quotas.reduce((sum, quota) => {
      const quotaAllocated = quota.Signups.filter((signup) =>
        allocated.has(signup.id),
      ).length;
      return sum + Math.max((quota.size ?? 0) - quotaAllocated, 0);
    }, 0);
    let remaining = Math.max(
      totalCapacity - currentlyAllocated() - unusedQuotaPlaces,
      0,
    );

    // Immediate quotas compete for genuinely shared seats by original click time.
    const immediateOverflow = immediateQuotas
      .flatMap((quota) => allocatable(quota))
      .sort((a, b) =>
        a.createdAt.getTime() === b.createdAt.getTime()
          ? a.id.localeCompare(b.id)
          : a.createdAt.getTime() - b.createdAt.getTime(),
      );

    for (const signup of immediateOverflow.slice(0, remaining)) {
      allocated.add(signup.id);
    }

    remaining = Math.max(
      totalCapacity - currentlyAllocated() - unusedQuotaPlaces,
      0,
    );

    // Deferred quotas only see capacity that remains once registration closes.
    if (afterClose) {
      const deferred = event.Quotas.filter(
        (quota) =>
          quota.sharedPlacesAllocation ===
          SharedPlacesAllocation.AFTER_REGISTRATION_CLOSE,
      )
        .flatMap((quota) => allocatable(quota))
        .filter((signup) => signup.completedAt !== null)
        .sort((a, b) =>
          a.createdAt.getTime() === b.createdAt.getTime()
            ? a.id.localeCompare(b.id)
            : a.createdAt.getTime() - b.createdAt.getTime(),
        );

      for (const signup of deferred.slice(0, remaining)) {
        allocated.add(signup.id);
      }
    }
  }

  const updates = event.Quotas.flatMap((quota) =>
    quota.Signups.filter(
      (signup) => signup.status !== SignupStatus.CONFIRMED,
    ).map((signup) => {
      const hasSeat = allocated.has(signup.id);
      const status = signup.completedAt
        ? hasSeat
          ? SignupStatus.CONFIRMED
          : quota.sharedPlacesAllocation ===
                SharedPlacesAllocation.AFTER_REGISTRATION_CLOSE && !afterClose
            ? SignupStatus.PENDING
            : SignupStatus.WAITLISTED
        : SignupStatus.IN_PROGRESS;

      return tx.signup.update({
        where: { id: signup.id },
        data: {
          status,
          allocatedAt: hasSeat ? (signup.allocatedAt ?? new Date()) : null,
        },
      });
    }),
  );

  const queueAcceptedSignups = event.Quotas.flatMap((quota) =>
    quota.Signups.filter(
      (signup) =>
        (signup.status === SignupStatus.PENDING ||
          signup.status === SignupStatus.WAITLISTED) &&
        allocated.has(signup.id),
    ).map((signup) => ({
      id: signup.id,
      name: signup.name,
      email: signup.email,
    })),
  );

  await Promise.all(updates);
  return {
    event,
    afterClose,
    allocatedSignupIds: allocated,
    queueAcceptedNotification: {
      eventId: event.id,
      eventName: event.title,
      signups: queueAcceptedSignups,
    },
  };
}
