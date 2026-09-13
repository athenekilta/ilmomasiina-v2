export const EVENT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const EVENT_IMAGE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const EVENT_IMAGE_VARIANTS = { card: 800, banner: 1600 } as const;
export type EventImageVariant = keyof typeof EVENT_IMAGE_VARIANTS;

export function eventImageUrl(
  id: string,
  variant: EventImageVariant = "banner",
) {
  return `/api/event-images/${id}/${variant}`;
}
