import type { Quota, Event } from "@/generated/prisma/client";
import { isPast, isFuture } from "date-fns";

export function OriginalQuotaTitle(quotas: Quota[], quotaId: string) {
  const quota = quotas.find((q: Quota) => q.id === quotaId);
  if (!quota) return null;
  return quota.title;
}

export function RegistrationDate(event: Event) {
  const registrationStartDate = new Date(event.registrationStartDate);
  const registrationEndDate = new Date(event.registrationEndDate);

  const isRegistrationInFuture = isFuture(registrationStartDate);
  const isRegistrationClosed = isPast(registrationEndDate);

  return {
    isRegistrationInFuture,
    isRegistrationClosed,
    isRegistrationOpen: !isRegistrationInFuture && !isRegistrationClosed,
  };
}
