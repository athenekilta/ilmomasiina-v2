import Link from "next/link";
import { Calendar, Clock, MapPin, SquarePen } from "lucide-react";
import { routes } from "@/utils/routes";
import { formatDateTime, formatRegistration } from "@/utils/format";
import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import {
  isClosingSoon,
  type EnrichedEvent,
  type EventCardSize,
} from "./eventCardVariant";

/* A real, fixed aspect ratio rather than a min-height fighting for
   leftover flex space — the image itself never stretches to fill a
   taller row (the card as a whole does, via `h-full`/`flex-1` below, so
   its white background — not the image — absorbs any extra height).
   4:3 rather than square — tall enough to read as a real image, not so
   tall it dwarfs the text below it. */
const BANNER_ASPECT: Record<EventCardSize, string> = {
  hero: "aspect-[4/3]",
  standard: "aspect-[4/3]",
};

const TITLE_SIZE: Record<EventCardSize, string> = {
  hero: "text-lg sm:text-xl",
  standard: "text-sm sm:text-base",
};

/* Quotas render as a plain text row rather than a labeled list, so they
   stay a footnote instead of a block of their own — capped low enough
   that a card with many quotas doesn't grow past its slot. */
const QUOTA_PREVIEW_COUNT: Record<EventCardSize, number> = {
  hero: 3,
  standard: 1,
};

export function EventCard({
  event,
  isAdmin,
  size = "standard",
}: {
  event: EnrichedEvent;
  isAdmin: boolean;
  size?: EventCardSize;
}) {
  const now = new Date();
  const startDate = new Date(event.registrationStartDate);
  const endDate = new Date(event.registrationEndDate);
  const isRegistrationClosed = endDate < now;
  const isRegistrationOpen = startDate <= now && endDate >= now;
  const closingSoon = isClosingSoon(event);

  const visibleQuotas = event.Quotas.slice(0, QUOTA_PREVIEW_COUNT[size]);
  const hiddenQuotaCount = event.Quotas.length - visibleQuotas.length;

  return (
    <article className="rounded-control flex h-full w-full min-w-0 flex-col overflow-hidden border border-stone-200 bg-white">
      <Link
        href={routes.app.events.event(event.id)}
        className="focus-visible:ring-brand-secondary flex min-w-0 flex-1 flex-col focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
      >
        {/* Media banner. Stands in for a real event image until those are
            supported — swap this block for an <img src={event.imageUrl}>
            when that lands. */}
        <div
          className={`from-brand-primary to-brand-secondary relative w-full overflow-hidden bg-linear-to-br ${BANNER_ASPECT[size]}`}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/60 via-black/15 to-transparent"
            aria-hidden
          />

          {event.draft && (
            <span className="absolute top-0 left-0 bg-amber-600 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
              Luonnos
            </span>
          )}

          <h2
            className={`absolute right-4 bottom-3 left-4 line-clamp-2 font-bold tracking-tight text-white ${TITLE_SIZE[size]}`}
          >
            {event.title}
          </h2>
        </div>

        <div className="flex flex-col gap-2 p-4 sm:p-5">
          <div className="space-y-1 text-xs text-gray-700 sm:text-sm">
            <p className="flex min-w-0 items-center gap-1.5">
              <Calendar
                size={13}
                strokeWidth={2}
                className="shrink-0 text-gray-500"
              />
              <span className="min-w-0 truncate">
                {formatDateTime(event.date, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </p>
            {event.location && (
              <p className="flex min-w-0 items-center gap-1.5">
                <MapPin
                  size={13}
                  strokeWidth={2}
                  className="shrink-0 text-gray-500"
                />
                <span className="min-w-0 truncate">{event.location}</span>
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm">
            <span
              className={`font-semibold ${isRegistrationOpen ? "text-brand-primary" : isRegistrationClosed ? "text-brand-danger" : "text-gray-500"}`}
            >
              {closingSoon && (
                <Clock
                  size={12}
                  strokeWidth={2.5}
                  className="mr-1 inline-block -translate-y-px"
                />
              )}
              {isRegistrationClosed
                ? "Ilmoittautuminen sulkeutunut"
                : formatRegistration(
                    event.registrationStartDate,
                    event.registrationEndDate,
                  )}
            </span>
          </p>

          {size === "hero" && event.description && (
            <p className="text-brand-dark line-clamp-2 text-xs leading-snug sm:text-sm">
              {event.description}
            </p>
          )}

          {visibleQuotas.length > 0 && (
            <p className="min-w-0 truncate pt-1.5 text-xs text-gray-500">
              {visibleQuotas
                .map(
                  (quota) =>
                    `${quota.title} ${quota.signupCount}/${quota.size ?? "∞"}`,
                )
                .join(" · ")}
              {hiddenQuotaCount > 0 && ` +${hiddenQuotaCount}`}
            </p>
          )}
        </div>
      </Link>

      {isAdmin && (
        <div className="shrink-0 px-4 pb-4 sm:px-5 sm:pb-5">
          <Divider spacingY="none" className="mb-4" />
          <Button.Link
            href={routes.app.events.edit(event.id)}
            variant="filled"
            color="primary"
            size="small"
            startIcon={<SquarePen size={18} strokeWidth={2.25} />}
            className="w-auto min-w-30 justify-center"
          >
            Muokkaa
          </Button.Link>
        </div>
      )}
    </article>
  );
}
