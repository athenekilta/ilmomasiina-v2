import {
  ChairIcon,
  PersonIcon,
} from "@/features/events/quotaBars/seatIcons";
import type { EventFill } from "./eventFill";

/*
 * A full event keeps its colour. The bar reaching the end, with no pale zone
 * and no seats figure, is the signal — the same one a full quota gives on the
 * event page. Recolouring it here would make one fact look different in two
 * places, and colour is already carrying "whose places" everywhere else.
 *
 * How full the event is, as one bar in the same grammar the event page uses
 * per quota: the taken places carry the headcount, the free ones carry what
 * is left, and each figure sits inside the zone it describes.
 *
 * One bar for the whole event, never one per quota. The card has no legend
 * and no quota names, so coloured segments would be decoration that looks
 * like information — and worse, the same colour would mean a different group
 * on every card, since each event's quotas start at the top of the palette.
 * Which quota you can actually reach is the event page's job.
 *
 * The figure in the pale zone is the whole event's free places. Someone whose
 * own quota is full cannot necessarily take them; the card cannot say that in
 * the space it has, and the page they land on says it immediately.
 */

const BAR_HEIGHT = 23;
const RADIUS = 7;
/** So the headcount fits even when almost nobody has signed up. */
const MIN_FILL = 54;
/** And so the last places left still fit when the event is nearly full. */
const MIN_PALE = 58;

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
/** Nobody gets in without queueing, so the bar stops being an invitation. */

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
  const unlimited = capacity === null;
  const isFull = !unlimited && capacity > 0 && signupCount >= capacity;
  const freePlaces = unlimited ? null : Math.max(capacity - signupCount, 0);
  const ratio = unlimited || capacity === 0 ? 1 : Math.min(signupCount / capacity, 1);

  if (unlimited) {
    return (
      <div
        // Allowed past the card's padding: the fade only reads as "no end"
        // if it has somewhere to go.
        className="-mr-4 flex items-center gap-1 px-2 sm:-mr-5"
        style={{
          height: BAR_HEIGHT,
          borderRadius: `${RADIUS}px 0 0 ${RADIUS}px`,
          background: noLimitFade(fillColor),
        }}
        role="img"
        aria-label={`${signupCount} ilmonnutta, paikkamäärää ei ole rajattu`}
      >
        <Figure value={signupCount} className="text-white" />
        <PersonIcon size={16} className="text-white" />
      </div>
    );
  }

  return (
    <div
      className="flex"
      style={{ height: BAR_HEIGHT, borderRadius: RADIUS }}
      role="img"
      aria-label={`${signupCount} ilmonnutta, ${freePlaces} paikkaa vapaana`}
    >
      <div
        className="relative z-20 flex h-full items-center gap-1 overflow-hidden px-2"
        style={{
          flex: `0 1 ${ratio * 100}%`,
          minWidth: MIN_FILL,
          borderRadius: RADIUS,
          background: fillColor,
        }}
      >
        <Figure value={signupCount} className="text-white" />
        <PersonIcon size={16} className="text-white" />
      </div>

      {!isFull && (
        <div
          className="relative z-10 flex h-full flex-auto items-center justify-end gap-1 overflow-hidden pr-2"
          style={{
            marginLeft: -RADIUS,
            minWidth: MIN_PALE,
            paddingLeft: RADIUS + 5,
            borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
            background: paleColor,
          }}
        >
          <Figure value={freePlaces ?? 0} style={{ color: "#5c564f" }} />
          <ChairIcon size={18} style={{ color: "#6b645c" }} />
        </div>
      )}
    </div>
  );
}

function Figure({
  value,
  className,
  style,
}: {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`block text-[12.5px] leading-none font-bold whitespace-nowrap tabular-nums ${className ?? ""}`}
      style={style}
    >
      {value}
    </span>
  );
}
