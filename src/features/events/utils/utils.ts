import type { Event } from "@/generated/prisma/client";

export function OriginalQuotaTitle(
  quotas: ReadonlyArray<{ id: string; title: string }>,
  quotaId: string,
) {
  return quotas.find((quota) => quota.id === quotaId)?.title ?? null;
}

export function RegistrationDate(
  event: Pick<Event, "registrationStartDate" | "registrationEndDate">,
  now = Date.now(),
) {
  const registrationStartDate = new Date(event.registrationStartDate);
  const registrationEndDate = new Date(event.registrationEndDate);

  const isRegistrationInFuture = registrationStartDate.getTime() > now;
  const isRegistrationClosed = registrationEndDate.getTime() <= now;

  return {
    isRegistrationInFuture,
    isRegistrationClosed,
    isRegistrationOpen: !isRegistrationInFuture && !isRegistrationClosed,
  };
}
