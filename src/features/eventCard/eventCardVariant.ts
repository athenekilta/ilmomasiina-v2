import type { Event, Quota, Signup } from "@/generated/prisma/client";
import { RegistrationDate } from "@/features/events/utils/utils";

export type EnrichedQuota = Quota & {
  Signups: Signup[];
  signupCount: number;
};

export type EnrichedEvent = Event & {
  Quotas: EnrichedQuota[];
};

const HOURS_48 = 48 * 60 * 60 * 1000;

/** Whether an open event's registration window closes within 48h. */
export function isClosingSoon(event: EnrichedEvent): boolean {
  const { isRegistrationOpen } = RegistrationDate(event);
  if (!isRegistrationOpen) return false;
  const msLeft = new Date(event.registrationEndDate).getTime() - Date.now();
  return msLeft >= 0 && msLeft <= HOURS_48;
}
