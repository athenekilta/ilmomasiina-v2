import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  PencilLine,
  SquarePen,
  Star,
  Zap,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { routes } from "@/utils/routes";
import { formatDateTime, formatRegistration } from "@/utils/format";
import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import {
  isClosingSoon,
  type EnrichedEvent,
  type EventCardSize,
  type EventEmphasis,
} from "./eventCardVariant";

/* Both sizes use the same rule — the banner grows to fill whatever the
   (deliberately compact) content below doesn't need, so the image reads
   as the dominant element and both squares behave consistently. The
   min-height is only a mobile fallback, where cards stack in a single
   column with no forced aspect ratio to grow into. */
const BANNER_HEIGHT: Record<EventCardSize, string> = {
  hero: "flex-1 min-h-56",
  standard: "flex-1 min-h-32",
};

const TITLE_SIZE: Record<EventCardSize, string> = {
  hero: "text-2xl sm:text-4xl",
  standard: "text-base sm:text-lg",
};

const WATERMARK_ICON_SIZE: Record<EventCardSize, number> = {
  hero: 180,
  standard: 72,
};

/* Quotas render as a single row of compact chips rather than a labeled
   list, so they stay a footnote next to the image instead of a block of
   their own — capped low enough that a card with many quotas doesn't grow
   past its slot. */
const QUOTA_PREVIEW_COUNT: Record<EventCardSize, number> = {
  hero: 2,
  standard: 1,
};

/* Fixed height, not content-driven — every card's text block ends up the
   same height whether or not it has a location/description/quotas, so the
   banner above it (which eats whatever's left) comes out the same height
   too across a whole row instead of jittering per card. Tall enough for
   the worst case (date + location + registration status + quotas, plus
   description on hero) so nothing gets clipped. */
const CONTENT_HEIGHT: Record<EventCardSize, string> = {
  hero: "h-40 sm:h-44",
  standard: "h-32 sm:h-36",
};

/* Flat, solid-color flags — sharp corners, no border, no shadow — instead
   of bordered pill badges. */
const EMPHASIS_BADGE: Record<
  Exclude<EventEmphasis, null>,
  { icon: LucideIcon; label: string; className: string }
> = {
  spotlight: {
    icon: Star,
    label: "Nostettu",
    className: "bg-brand-dark text-white",
  },
  open: {
    icon: Zap,
    label: "Ilmo käynnissä",
    className: "bg-brand-primary text-white",
  },
  next: {
    icon: ArrowRight,
    label: "Seuraavana",
    className: "bg-stone-700 text-white",
  },
};

export function EventCard({
  event,
  isAdmin,
  size = "standard",
  emphasis = null,
}: {
  event: EnrichedEvent;
  isAdmin: boolean;
  size?: EventCardSize;
  emphasis?: EventEmphasis;
}) {
  const now = new Date();
  const endDate = new Date(event.registrationEndDate);
  const isRegistrationClosed = endDate < now;
  const closingSoon = isClosingSoon(event);

  const visibleQuotas = event.Quotas.slice(0, QUOTA_PREVIEW_COUNT[size]);
  const hiddenQuotaCount = event.Quotas.length - visibleQuotas.length;

  const WatermarkIcon =
    emphasis === "spotlight" || emphasis === "open" ? Zap : Calendar;
  const badge = emphasis ? EMPHASIS_BADGE[emphasis] : null;
  const BadgeIcon = badge?.icon;

  return (
    <article className="surface-panel group relative flex h-full w-full min-w-0 flex-col overflow-hidden">
      <Link
        href={routes.app.events.event(event.id)}
        className="focus-visible:ring-brand-secondary flex min-w-0 flex-1 flex-col rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
      >
        {/* Media banner. Stands in for a real event image until those are supported —
            swap this block for an <img src={event.imageUrl}> when that lands. */}
        <div
          className={`relative overflow-hidden bg-linear-to-br from-brand-primary to-brand-secondary ${BANNER_HEIGHT[size]}`}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)",
            }}
            aria-hidden
          />
          <WatermarkIcon
            size={WATERMARK_ICON_SIZE[size]}
            strokeWidth={1.25}
            className="pointer-events-none absolute -right-6 -bottom-8 text-white/15"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/60 via-black/15 to-transparent"
            aria-hidden
          />

          <div className="absolute top-0 left-0 flex flex-col items-start">
            {event.draft && (
              <span className="inline-flex items-center gap-1 bg-amber-500 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                <PencilLine size={12} strokeWidth={2.5} />
                Luonnos
              </span>
            )}
            {closingSoon && (
              <span className="bg-brand-danger inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                <Clock size={12} strokeWidth={2.5} />
                Sulkeutuu pian
              </span>
            )}
          </div>

          {badge && BadgeIcon && (
            <span
              className={`absolute top-0 right-0 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold tracking-wide uppercase ${badge.className}`}
            >
              <BadgeIcon size={12} strokeWidth={2.5} />
              {badge.label}
            </span>
          )}

          <h2
            className={`absolute right-4 bottom-3 left-4 line-clamp-2 font-bold tracking-tight text-white drop-shadow-sm ${TITLE_SIZE[size]}`}
          >
            {event.title}
          </h2>
        </div>

        <div
          className={`shrink-0 space-y-1.5 overflow-hidden p-3 sm:p-4 ${CONTENT_HEIGHT[size]}`}
        >
          <div className="space-y-0.5 text-xs text-gray-700 sm:text-sm">
            <p className="flex min-w-0 items-center gap-1.5">
              <Calendar
                size={14}
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
                  size={14}
                  strokeWidth={2}
                  className="shrink-0 text-gray-500"
                />
                <span className="min-w-0 truncate">{event.location}</span>
              </p>
            )}
          </div>

          <div>
            {isRegistrationClosed ? (
              <span className="text-brand-danger inline-block text-xs font-semibold sm:text-sm">
                Ilmoittautuminen sulkeutunut
              </span>
            ) : (
              <span className="text-brand-primary inline-block text-xs font-semibold sm:text-sm">
                {formatRegistration(
                  event.registrationStartDate,
                  event.registrationEndDate,
                )}
              </span>
            )}
          </div>

          {size === "hero" && event.description && (
            <p className="text-brand-dark line-clamp-1 text-xs leading-snug sm:text-sm">
              {event.description}
            </p>
          )}

          {/* Quotas as a single-line row of compact chips — each chip's fill
              shows how full it is, so this stays a glance-sized footnote
              instead of a labeled list section — plain labels with a hairline
              fill bar underneath, not a row of button-shaped pills. */}
          {visibleQuotas.length > 0 && (
            <div className="flex flex-nowrap gap-3 overflow-hidden">
              {visibleQuotas.map((quota) => {
                const fillPct =
                  quota.size && quota.size > 0
                    ? Math.min(100, (quota.signupCount / quota.size) * 100)
                    : null;

                return (
                  <div key={quota.id} className="min-w-0 max-w-24 shrink">
                    <div className="flex items-baseline gap-1 text-[11px] font-semibold">
                      <span className="text-brand-dark min-w-0 truncate">
                        {quota.title}
                      </span>
                      <span className="shrink-0 text-gray-500 tabular-nums">
                        {quota.signupCount}/{quota.size ?? "∞"}
                      </span>
                    </div>
                    {fillPct !== null && (
                      <div className="bg-brand-primary/15 mt-1 h-0.75 w-full overflow-hidden">
                        <div
                          className="bg-brand-primary h-full"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {hiddenQuotaCount > 0 && (
                <span className="shrink-0 self-start text-[11px] font-medium text-gray-500">
                  +{hiddenQuotaCount}
                </span>
              )}
            </div>
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
