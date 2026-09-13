import {
  eventImageUrl,
  type EventImageVariant,
} from "@/features/events/utils/eventImage";

export const EVENT_PLACEHOLDER_IMAGES = [
  "/placeholders/event-1.png",
  "/placeholders/event-2.png",
  "/placeholders/event-3.png",
] as const;

export function getEventImage(
  eventId: number,
  imageId?: string | null,
  variant: EventImageVariant = "banner",
): string {
  if (imageId) return eventImageUrl(imageId, variant);
  const index = Math.abs(eventId) % EVENT_PLACEHOLDER_IMAGES.length;
  return EVENT_PLACEHOLDER_IMAGES[index] ?? EVENT_PLACEHOLDER_IMAGES[0]!;
}
