import type { Quota, Event } from "@/generated/prisma/client";


export function OriginalQuotaTitle(quotas: Quota[], quotaId: string) {
  const quota = quotas.find((q: Quota) => q.id === quotaId);
  if (!quota) return null;
  return quota.title;
}

export function RegistrationDate(event: Pick<Event, "registrationStartDate" | "registrationEndDate">, now = Date.now()) {
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
