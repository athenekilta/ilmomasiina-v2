/* Placeholder banners until events carry a real image of their own.
   Files live in `public/placeholders/` and are 2:1 (banner) crops.
   Picked deterministically from the event id, so a card keeps the same
   image between renders instead of shuffling on every load. */
export const EVENT_PLACEHOLDER_IMAGES = [
  "/placeholders/event-1.png",
  "/placeholders/event-2.png",
  "/placeholders/event-3.png",
] as const;

export function getEventImage(eventId: number): string {
  const index =
    Math.abs(eventId) % EVENT_PLACEHOLDER_IMAGES.length;
  return EVENT_PLACEHOLDER_IMAGES[index] ?? EVENT_PLACEHOLDER_IMAGES[0]!;
}
