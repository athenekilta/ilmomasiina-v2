import {
  buildQuotaBars,
  type QuotaBarRow,
  type QuotaBarsInput,
} from "./quotaBarModel";
import { getQuotaColor } from "./quotaColors";
import { BenchIcon, ChairIcon, PersonIcon } from "./seatIcons";

/*
 * How full each quota is, and whether a full one still lets you in.
 *
 * One row per quota: the name above, a bar below. Inside the bar the taken
 * places carry the signup count and the free ones carry what is left, so each
 * figure sits in the zone it describes and nothing has to be matched up by
 * eye. When a quota can overflow into the shared places, its bar continues
 * past the track into a grey that fades out — a full quota is then visibly
 * not a dead end, which is the whole reason this component exists.
 *
 * The component owns its white card because the 1.5px walls that separate the
 * bar from the grey are painted in the card's own background colour. Moving
 * it onto a tinted surface means changing SURFACE to match.
 */

const BAR_HEIGHT = 23;
const RADIUS = 7;
/**
 * Gap between the bar and the grey continuation, and the colour the
 * continuation fades out into. Both are the card's own background, so they
 * have to move together with it: the signup column sits on the page panel's white.
 */
const WALL = 1.5;
const SURFACE = "#ffffff";
/** Width kept clear on the right for the continuation. */
const LANE = 42;
/**
 * How far the grey runs past the bars' own right edge, into whatever padding
 * surrounds them. Nothing clips it: the gradient has to reach the background
 * colour in free space, or it ends mid-fade on a hard edge.
 */
const OVERSHOOT = 5;
/**
 * The grey reaches back under the bar's rounded end so the wall cuts the
 * notch out of it. Without this the grey stops at a straight edge and the
 * bar's curve is left standing in white.
 */
const REACH_BACK = RADIUS + WALL;
/** So the signup count fits even when a quota is at 1 of 30. */
const MIN_FILL = 54;
/**
 * And so the last places left still fit: a quota at 38 of 40 has a 5% pale
 * zone, which would swallow the very figure people are watching. Both ends
 * of the bar keep a floor, and the proportion gives way — the figures are
 * what the row is for.
 */
const MIN_PALE = 58;
/** Fewer shared places than this and the continuation stops rather than fades. */
const FEW_SHARED = 5;

const GREY = "#d8d3cc";
const FADE = `linear-gradient(to right, ${GREY} 0%, ${GREY} 42%, ${SURFACE} 100%)`;

/* The chair covers 59% of its viewBox, the person 67%, the bench 91%, so
   equal sizes would read as three different weights. Same reason the chair
   is a shade darker than the bench: less ink over the same area. */
const PERSON_SIZE = 16;
const CHAIR_SIZE = 18;
const BENCH_SIZE = 17;
const FIGURE = "#5c564f";
const CHAIR_COLOR = "#6b645c";
const BENCH_COLOR = "#7a736a";

export function QuotaBars({ event }: { event: QuotaBarsInput }) {
  const { rows, totalSignupCount, shared, queuedCount } = buildQuotaBars(event);
  if (rows.length === 0) return null;

  // The lane exists only for rows that actually run into it. With no shared
  // places — or none left, or no quota allowed to use them — there is nothing
  // to keep clear, and the bars take the full width.
  const lane = rows.some((row) => row.continuesToShared) ? LANE : 0;

  return (
    <section className="flex flex-col gap-[18px]">
      <h3 className="text-brand-dark text-base font-extrabold tracking-[0.015em] uppercase tabular-nums">
        {totalSignupCount} ilmonnutta
      </h3>

      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {rows.map((row) => (
          <QuotaBarItem key={row.id} row={row} lane={lane} shared={shared} />
        ))}
      </ul>

      {(shared !== null || queuedCount > 0) && (
        <div className="flex flex-col items-end gap-1.5 pr-2 text-[12.5px]">
          {shared !== null &&
            (shared.remaining > 0 ? (
              <span className="flex items-center gap-[7px] text-stone-600">
                <BenchIcon size={16} style={{ color: BENCH_COLOR }} />
                Yhteisiä paikkoja jäljellä:{" "}
                <b className="text-brand-secondary font-bold tabular-nums">
                  {shared.remaining}
                </b>
              </span>
            ) : (
              <span className="flex items-center gap-[7px] text-stone-400">
                <BenchIcon size={16} />
                Ei vapaita yhteisiä paikkoja
              </span>
            ))}
          {queuedCount > 0 && (
            <span className="text-stone-600">
              Jonossa:{" "}
              <b className="text-brand-dark font-bold tabular-nums">
                {queuedCount}
              </b>
            </span>
          )}
        </div>
      )}

      <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 border-t border-stone-100 pt-3 text-[10px] text-stone-400">
        <span className="flex items-center gap-1">
          <PersonIcon size={PERSON_SIZE} className="text-stone-300" />
          Ilmonneita
        </span>
        <span className="flex items-center gap-1">
          <ChairIcon size={CHAIR_SIZE} className="text-stone-300" />
          Kiintiön paikkoja
        </span>
        {shared !== null && (
          <span className="flex items-center gap-1">
            <BenchIcon size={BENCH_SIZE} className="text-stone-300" />
            Yhteisiä paikkoja
          </span>
        )}
      </p>
    </section>
  );
}

function QuotaBarItem({
  row,
  lane,
  shared,
}: {
  row: QuotaBarRow;
  lane: number;
  shared: { total: number; remaining: number } | null;
}) {
  const color = getQuotaColor(row.colorIndex);
  const continues = row.continuesToShared && shared !== null;
  const isFull = row.fillRatio !== null && row.fillRatio >= 1;

  return (
    <li className="flex flex-col gap-1.5">
      <span
        className="truncate text-[12.5px] font-bold text-stone-600"
        style={{ paddingRight: continues ? 0 : lane }}
      >
        {row.title}
      </span>

      <div
        className="flex items-center"
        role="img"
        aria-label={describeRow(row, continues)}
      >
        <div
          className="relative z-10 flex"
          style={{
            flex: lane === 0 ? "0 0 100%" : `0 0 calc(100% - ${lane}px)`,
            height: BAR_HEIGHT,
            borderRadius: RADIUS,
            boxShadow: `0 0 0 ${WALL}px ${SURFACE}`,
          }}
        >
          <div
            className="relative z-20 flex h-full items-center gap-1 overflow-hidden px-2"
            style={{
              // An unlimited quota has no proportion to draw, so its block is
              // only as wide as the figure inside it.
              flex:
                row.fillRatio === null
                  ? "0 0 auto"
                  : `0 1 ${row.fillRatio * 100}%`,
              minWidth: MIN_FILL,
              borderRadius: RADIUS,
              background: color.fill,
            }}
          >
            <Figure value={row.signupCount} className="text-white" />
            <PersonIcon size={PERSON_SIZE} className="text-white" />
          </div>

          {!isFull && (
            <PlacesLeft freePlaces={row.freePlaces} pale={color.pale} />
          )}
        </div>

        {continues && <Continuation remaining={shared.remaining} />}
      </div>
    </li>
  );
}

/** The quota's own free places, shown in the zone that represents them. */
function PlacesLeft({
  freePlaces,
  pale,
}: {
  freePlaces: number | null;
  pale: string;
}) {
  return (
    <div
      className="relative z-10 flex h-full flex-auto items-center justify-end gap-1 overflow-hidden pr-2"
      style={{
        marginLeft: -RADIUS,
        minWidth: MIN_PALE,
        // Clears the notch the filled block's rounded end cuts into this
        // one, so the figure never ends up against the seam.
        paddingLeft: RADIUS + 5,
        borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
        background: pale,
      }}
    >
      {/* An unlimited quota has no figure here: there is no ceiling to
          subtract from. */}
      {freePlaces !== null && (
        <>
          <Figure value={freePlaces} style={{ color: FIGURE }} />
          <ChairIcon size={CHAIR_SIZE} style={{ color: CHAIR_COLOR }} />
        </>
      )}
    </div>
  );
}

/**
 * The row running on into the shared places. It fades out while there is room
 * and stops at a rounded end once only a few places are left, so "there is
 * more" and "this is nearly it" never look the same.
 */
function Continuation({ remaining }: { remaining: number }) {
  const fading = remaining >= FEW_SHARED;
  // Only the fade runs past the padding, and only because it needs free space
  // to finish in. A capped end is a definite end, so it stops on the line.
  const over = fading ? OVERSHOOT : 0;
  return (
    <div
      className="relative z-0 box-border flex items-center"
      style={{
        flex: `0 0 ${LANE + over + REACH_BACK}px`,
        marginLeft: -REACH_BACK,
        marginRight: -over,
        height: BAR_HEIGHT,
        background: fading ? FADE : GREY,
        borderRadius: fading ? 0 : `0 ${RADIUS}px ${RADIUS}px 0`,
        // The marks sit at the head of the grey, just clear of the notch the
        // bar's rounded end cuts into it.
        paddingLeft: REACH_BACK + 7,
        color: BENCH_COLOR,
      }}
    >
      <span className="mr-[3px] text-xs leading-none font-bold">+</span>
      <BenchIcon size={BENCH_SIZE} />
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

function describeRow(row: QuotaBarRow, continues: boolean): string {
  const parts = [`${row.title}: ${row.signupCount} ilmonnutta`];
  if (row.size === null) {
    parts.push("paikkamäärää ei ole rajattu");
  } else {
    parts.push(`${row.freePlaces} kiintiön paikkaa vapaana`);
  }
  if (continues) parts.push("lisäksi yhteisiä paikkoja");
  return parts.join(", ");
}
