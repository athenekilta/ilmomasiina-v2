import { addDays, set } from "date-fns";
import type { z } from "zod";
import type { RouterOutputs } from "@/utils/api";
import { nativeDate } from "@/utils/nativeDate";
import { nativeTime } from "@/utils/nativeTime";
import type { eventFormSchema } from "./eventFormSchema";

type EditEvent = RouterOutputs["events"]["getEventEditId"];
export type EventFormValues = z.input<typeof eventFormSchema>;

export function eventDraftValues(event?: EditEvent, now = new Date()): EventFormValues {
  const date = event?.date ?? addDays(now, 7);
  const start = event?.registrationStartDate ?? addDays(now, 1);
  const end = event?.registrationEndDate ?? addDays(now, 5);
  return {
    date: nativeDate.form.stringify(date),
    time: nativeTime.stringify(event ? date : set(now, { hours: 12, minutes: 0 })),
    registrationStartDate: nativeDate.form.stringify(start),
    registrationStartTime: nativeTime.stringify(event ? start : set(now, { hours: 12, minutes: 0 })),
    registrationEndDate: nativeDate.form.stringify(end),
    registrationEndTime: nativeTime.stringify(event ? end : set(now, { hours: 23, minutes: 59 })),
    title: event?.title ?? "",
    badgeText: event?.badgeText ?? "",
    badgeTone: event?.badgeTone ?? "GREEN",
    description: event?.description ?? "",
    location: event?.location ?? "",
    price: event?.price ?? "",
    webpageUrl: event?.webpageUrl ?? "",
    draft: event?.draft ?? true,
    signupsPublic: event?.signupsPublic ?? true,
    verificationEmail: event?.verificationEmail ?? "",
    extraCapacity: event?.extraCapacity ?? 0,
    raffleEnabled: event?.raffleEnabled ?? false,
    Quotas: (event?.Quotas ?? []).map(({ id, title, size, sharedPlacesAllocation, sortId, eventId }) => ({
      id, title, size, sharedPlacesAllocation, sortId, eventId,
    })),
    Questions: (event?.Questions ?? []).map(({ id, question, type, options, sortId, required, public: isPublic, eventId }) => ({
      id, question, type, options, sortId, required, public: isPublic, eventId,
    })),
  };
}

export function eventDraftSnapshot(event: EditEvent) {
  if (!event) throw new Error("Tapahtuma ei ole enää saatavilla.");
  return { values: eventDraftValues(event), imageId: event.imageId };
}
