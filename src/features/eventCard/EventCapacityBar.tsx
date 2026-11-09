import type { EventFill } from "./eventFill";

/*
 * How full the event is, as one bar in the same grammar the event page uses
 * per quota: `18 / 30` inside the filled part, anchored to its right edge, so
 * the figure is always white on colour and never changes colour with the
 * situation. No icons and no legend — the card has no room to explain either,
 * and a fraction explains itself.
 *
 * A full event keeps its colour. The bar reaching the end with no pale zone is
 * the signal, the same one a full quota gives on the event page. Recolouring
 * it here would make one fact look different in two places.
 *
 * One bar for the whole event, never one per quota. The card has no quota
 * names, so coloured segments would be decoration that looks like information
 * -- and the same colour would mean a different group on every card, since
 * each event's quotas start at the top of the palette. Which quota you can
 * actually reach is the event page's job.
 */

const BAR_HEIGHT = 23;
const RADIUS = 7;
/**
 * Enough for "18 / 30" and its padding. The filled zone never goes below it,
 * or the figure it carries would not fit inside it.
 */
const MIN_FILLED = 66;

const FILL = "#5e8c64";
const PALE = "#b9c7ba";
/*
 * A closed event keeps the same bar, drained of colour. The shape still says
 * how full it got, which is worth knowing, but the green's job was "you can
 * still get in" and that is no longer true.
 */
const CLOSED_FILL = "#a8a29e";
const CLOSED_PALE = "#e7e5e4";
/**
 * An event with no ceiling: the bar runs most of the way and then dissolves
 * instead of ending. No pale zone at all — pale means free places, and with
 * no ceiling there is no defined set of them to draw. Nothing marks an
 * endpoint, so no width here can be read as a proportion.
 */
const noLimitFade = (colour: string) =>
  `linear-gradient(to right, ${colour} 0%, ${colour} 65%, #ffffff 100%)`;

export function EventCapacityBar({
  fill,
  closed = false,
}: {
  fill: EventFill;
  closed?: boolean;
}) {
  const fillColor = closed ? CLOSED_FILL : FILL;
  const paleColor = closed ? CLOSED_PALE : PALE;
  const { signupCount, capacity } = fill;

  if (capacity === null) {
    return (
      <div
        // Allowed past the card's padding: the fade only reads as "no end"
        // if it has somewhere to go.
        className="-mr-4 flex items-center px-2 sm:-mr-5"
        style={{
          height: BAR_HEIGHT,
          borderRadius: `${RADIUS}px 0 0 ${RADIUS}px`,
          background: noLimitFade(fillColor),
        }}
        role="img"
        aria-label={`${signupCount} ilmonnutta, paikkamäärää ei ole rajattu`}
      >
        <Figure value={`${signupCount}`} light />
      </div>
    );
  }

  // Capped like a quota's own bar: the numerator never runs past the
  // denominator, because "35 / 30" reads as a mistake rather than as a queue.
  const taken = Math.min(signupCount, capacity);
  const free = Math.max(capacity - taken, 0);
  const figure = `${taken} / ${capacity}`;

  return (
    <div
      className="relative flex w-full"
      style={{ height: BAR_HEIGHT, borderRadius: RADIUS }}
      role="img"
      aria-label={`${signupCount} ilmonnutta, ${free} paikkaa vapaana`}
    >
      {taken === 0 ? (
        // No filled part, so the figure cannot live inside one — it moves to
        // the empty zone rather than giving an empty event a block of colour.
        <div
          className="flex items-center px-2"
          style={{
            flex: "1 1 auto",
            height: "100%",
            borderRadius: RADIUS,
            background: paleColor,
          }}
        >
          <Figure value={figure} light={false} />
        </div>
      ) : (
        <>
          <div
            className="relative z-20 flex h-full items-center justify-end overflow-hidden px-2"
            style={{
              flex:
                free === 0 ? "1 1 auto" : `0 1 ${(taken / capacity) * 100}%`,
              minWidth: MIN_FILLED,
              borderRadius: RADIUS,
              background: fillColor,
            }}
          >
            <Figure value={figure} light />
          </div>

          {free > 0 && (
            <div
              className="relative z-10 h-full"
              style={{
                // The notch costs RADIUS px and it is added back here, or the
                // bar stops that far short of its own right edge.
                flex: `0 1 calc(${(free / capacity) * 100}% + ${RADIUS}px)`,
                minWidth: 2 * RADIUS,
                marginLeft: -RADIUS,
                borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
                background: paleColor,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

function Figure({ value, light }: { value: string; light: boolean }) {
  return (
    <span
      className="block text-[12.5px] leading-none font-bold whitespace-nowrap tabular-nums"
      style={{ color: light ? "#ffffff" : "#5c564f" }}
    >
      {value}
    </span>
  );
}
