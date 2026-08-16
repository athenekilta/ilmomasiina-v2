import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Lock, MapPin, SquarePen } from "lucide-react";
import { routes } from "@/utils/routes";
import { formatEventDateTime } from "@/utils/format";
import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import { type EnrichedEvent } from "./eventCardVariant";
import { getEventImage } from "./eventCardImage";
import { getEventFill } from "./eventFill";
import { BADGE_TONE_CLASS } from "./badgeTone";
import { EventFillIndicator } from "./EventFillIndicator";
import { getRegistrationStatus } from "./registrationStatus";

/* A real, fixed aspect ratio rather than a min-height fighting for
   leftover flex space — the image itself never stretches to fill a
   taller row (the card as a whole does, via `h-full`/`flex-1` below, so
   its white background — not the image — absorbs any extra height).
   2:1 matches the banner crops the images ship in. */
const BANNER_ASPECT = "aspect-[2/1]";

/* Unmounts itself when the file is missing, so the gradient behind it
   shows through instead of the browser's broken-image glyph. */
function BannerImage({ src, muted }: { src: string; muted: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      className={`absolute inset-0 h-full w-full object-cover ${
        muted ? "opacity-60 grayscale" : ""
      }`}
      onError={() => setFailed(true)}
    />
  );
}

export function EventCard({
  event,
  isAdmin,
}: {
  event: EnrichedEvent;
  isAdmin: boolean;
}) {
  const fill = getEventFill(event);
  const registration = getRegistrationStatus(event);
  const isClosed = registration.state === "closed";

  return (
    <article className="rounded-card flex h-full w-full min-w-0 flex-col overflow-hidden border border-stone-200 bg-white">
      <Link
        href={routes.app.events.event(event.id)}
        className="focus-visible:ring-brand-secondary flex min-w-0 flex-1 flex-col focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
      >
        {/* Media banner. The fade under the title is the images' own
            background colour rather than a dark scrim, so it reads as the
            picture continuing rather than a bar dropped on top of it — and
            the text sits on a light surface, dark, like the rest of the
            card. `brand-sand` is also the banner's own background, so a
            missing image leaves a plain sand block that the fade blends
            into invisibly. */}
        <div
          className={`relative w-full overflow-hidden ${BANNER_ASPECT} ${
            isClosed ? "bg-stone-200" : "bg-brand-sand"
          }`}
        >
          <BannerImage src={getEventImage(event.id)} muted={isClosed} />

          {event.draft && (
            <span className="absolute top-0 left-0 bg-amber-600 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
              Luonnos
            </span>
          )}

          {/* Corner stack, so a closed event that also carries an editorial
              tag shows both instead of one landing on top of the other. */}
          <div className="absolute top-3 right-3 flex max-w-[80%] flex-col items-end gap-2">
            {/* A closed event still belongs in the list, but it is not
                actionable — the drained image and this padlock say so
                before any text is read. */}
            {isClosed && (
              <span className="shadow-card flex items-center gap-1.5 rounded-full bg-stone-900/70 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase sm:text-[0.8125rem]">
                <Lock size={13} strokeWidth={2.75} aria-hidden />
                Ilmo päättynyt
              </span>
            )}

            {/* Editorial tag ("Vuoden haippisin"). Deliberately not the
                solid rectangle glued to the corner: a floating pill that
                reads as a sticker on the picture. */}
            {event.badgeText && (
              <span
                className={`shadow-card max-w-full truncate rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase sm:text-[0.8125rem] ${BADGE_TONE_CLASS[event.badgeTone]}`}
              >
                {event.badgeText}
              </span>
            )}
          </div>

          {/* Two layers rather than one gradient over the whole block: the
              ramp is a fixed height that always sits directly above the
              text, and the text itself gets an even ground underneath. A
              single gradient spanning the box stretched with the content,
              so a third line of text pushed the ramp's midpoint up into the
              title and left it sitting on a half-transparent wash. This way
              the ground grows with the content and the fade never changes
              shape. */}
          <div className="absolute inset-x-0 bottom-0">
            <div
              className={`h-10 bg-linear-to-t to-transparent ${
                isClosed ? "from-stone-200/95" : "from-brand-sand/91"
              }`}
              aria-hidden
            />
            <div
              className={`px-4 pb-3 sm:px-5 ${
                isClosed ? "bg-stone-200/95" : "bg-brand-sand/91"
              }`}
            >
              <h2
                className={`line-clamp-2 text-base font-bold tracking-tight sm:text-lg ${
                  isClosed ? "text-stone-500" : "text-brand-secondary"
                }`}
              >
                {event.title}
              </h2>
              {/* When and where, on one line where they fit — the two facts
                people scan for before anything else. */}
              <div
                className={`mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm ${
                  isClosed ? "text-stone-500" : "text-brand-dark"
                }`}
              >
                <p className="flex min-w-0 items-center gap-1.5">
                  <Calendar
                    size={13}
                    strokeWidth={2}
                    className="shrink-0 opacity-60"
                  />
                  <span className="min-w-0 truncate">
                    {formatEventDateTime(event.date)}
                  </span>
                </p>
                {event.location && (
                  <p className="flex min-w-0 items-center gap-1.5">
                    <MapPin
                      size={13}
                      strokeWidth={2}
                      className="shrink-0 opacity-60"
                    />
                    <span className="min-w-0 truncate">{event.location}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Below the image: everything about signing up — when, and how
            many have. The image and its overlay carry what the event is. */}
        <div className="min-w-0 p-4 sm:p-5">
          <div className="min-w-0">
            <p
              className={`flex min-w-0 items-center gap-1.5 text-sm font-semibold sm:text-base ${
                registration.state === "closed"
                  ? "text-brand-danger"
                  : registration.urgent
                    ? "text-brand-danger"
                    : registration.state === "open"
                      ? "text-brand-primary"
                      : "text-brand-secondary"
              }`}
            >
              {registration.state !== "closed" && (
                <Clock size={14} strokeWidth={2.5} className="shrink-0" />
              )}
              <span className="min-w-0 truncate">{registration.headline}</span>
            </p>
            <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
              {registration.detail}
            </p>

            {/* Quota names are an inside detail — on the card they only
                added noise, and showing one of five quotas told you less
                than the totals do. The event page still lists them. */}
            {event.Quotas.length > 0 && (
              <div className="mt-3 min-w-0">
                <EventFillIndicator fill={fill} />
                <p className="mt-1.5 truncate text-sm text-gray-500">
                  {fill.countText}
                </p>
              </div>
            )}
          </div>
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
