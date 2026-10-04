import type { BadgeTone } from "@/generated/prisma/client";
import { RegistrationDate } from "@/features/events/utils/utils";

export type EnrichedQuota = {
  id: string;
  size: number | null;
  signupCount: number;
};

export type EnrichedEvent = {
  id: number;
  title: string;
  badgeText: string | null;
  badgeTone: BadgeTone;
  imageId: string | null;
  location: string | null;
  date: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  draft: boolean;
  extraCapacity: number;
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
