import { UserRound } from "lucide-react";
import { FILL_COLOR, FILL_STEPS, type EventFill } from "./eventFill";

const FIGURE_SIZE = 19;

/**
 * How full the event is, as a pill: three figures of which the filled ones
 * mark the level, plus the same thing in words.
 *
 * The figures are `UserRound` filled solid, overlapping. Each is drawn
 * twice — a fat stroke in the pill's own colour first, then the figure on
 * top — so the underlay knocks a silhouette-shaped hole in the figure
 * behind it and the shapes stay separate where they cross. A round chip
 * around each one would separate them too, but then the row reads as three
 * buttons rather than a crowd.
 */
export function EventFillIndicator({ fill }: { fill: EventFill }) {
  const filled = FILL_STEPS[fill.level];

  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold sm:text-sm ${FILL_COLOR[fill.level]}`}
      title={fill.label}
    >
      <span className="flex shrink-0 items-center -space-x-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="relative block"
            style={{ width: FIGURE_SIZE, height: FIGURE_SIZE }}
          >
            <UserRound
              size={FIGURE_SIZE}
              strokeWidth={6}
              className="absolute inset-0 fill-stone-100 text-stone-100"
            />
            <UserRound
              size={FIGURE_SIZE}
              strokeWidth={2}
              className={`absolute inset-0 fill-current ${
                i < filled ? "" : "text-stone-300"
              }`}
            />
          </span>
        ))}
      </span>
      <span className="min-w-0 truncate">{fill.availabilityText}</span>
    </span>
  );
}
