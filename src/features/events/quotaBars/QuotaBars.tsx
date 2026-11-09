import {
  buildQuotaBars,
  type QuotaBarRow,
  type SharedPlaces,
  type QuotaBarsInput,
} from "./quotaBarModel";
import { getQuotaColor } from "./quotaColors";

/*
 * How full each quota is, and how many places are left where.
 *
 * One bar per quota plus one for the shared places. Each bar carries its own
 * figure inside the filled part, anchored to that part's right edge, so the
 * figure is always white on colour and never has to change colour with the
 * situation. That anchoring is the reason the filled part has a floor: a
 * figure cannot sit inside a zone narrower than itself.
 *
 * A quota's bar shows ONLY that quota's own places, so `40 / 40` is a solid
 * block and `22 / 40` is half a block, and the two can never be mistaken for
 * each other. Places its people took from the shared pool live in that bar
 * instead, in that quota's own colour — an earlier version drew them as a
 * lighter band at the end of the quota's own bar, where they read exactly
 * like free places, which is the opposite of what they are.
 *
 * The component owns its white card because the 1.5px wall around each bar is
 * painted in the card's own background colour. Moving it onto a tinted
 * surface means changing SURFACE to match.
 *
 * The track carries the corner and clips what is inside it, so the zones
 * themselves stay square and flush. Rounding each zone instead was what used
 * to open a lens-shaped hole exactly at the boundary between taken and free
 * -- the one place in the bar a reader actually looks.
 */

const BAR_HEIGHT = 23;
/** Matches `rounded-control`: felt, not seen. */
const TRACK_RADIUS = 2;
/**
 * The hairline around each bar, in the card's own background colour — so it
 * has to move with the card: the signup column sits on the page panel's white.
 */
const WALL = 1.5;
const SURFACE = "#ffffff";
const GREY = "#d8d3cc";
/**
 * The cut between two quotas inside the shared-places bar.
 *
 * This is the only place in the whole component where two full-strength
 * colours meet, and a straight hairline between them was not enough to see:
 * at a glance the bar read as one long block that happened to change hue.
 * So the cut is wider than a hairline and leans, which no other edge on the
 * page does — the eye finds it before it has read anything.
 */
const SEAM = 3;
const SEAM_LEAN = "-14deg";
const FIGURE = "#5c564f";
/**
 * Enough for "22 / 40" and its padding. The filled zone never goes below it,
 * or the figure it carries would not fit inside it. The cost is that a very
 * short filled zone stretches to this width and overstates itself — 2 of 30
 * draws as 18% rather than 7%.
 */
const MIN_FILLED = 66;

/**
 * A zone of the bar: its share of the width, or the rest of it when `basis` is
 * null. Zones sit flush against each other and add up to the whole track, so
 * nothing here has to compensate for anything.
 */
function zoneStyle(
  background: string,
  basis: string | null,
  minWidth: number,
): React.CSSProperties {
  return {
    flex: basis === null ? "1 1 auto" : `0 1 ${basis}`,
    minWidth,
    height: "100%",
    background,
  };
}

/** A sliver of a zone still has to be visible as one. */
const MIN_ZONE = 4;

const share = (part: number, whole: number) => `${(part / whole) * 100}%`;

export function QuotaBars({ event }: { event: QuotaBarsInput }) {
  const { rows, totalSignupCount, shared, queuedCount } = buildQuotaBars(event);
  if (rows.length === 0 && shared === null) return null;

  return (
    <section className="flex flex-col gap-[18px]">
      <h3 className="eyebrow text-brand-secondary tabular-nums">
        {totalSignupCount} ilmonnutta
      </h3>

      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {rows.map((row) => (
          <QuotaBarItem key={row.id} row={row} />
        ))}
      </ul>

      {shared !== null && <SharedPlacesBar shared={shared} />}

      {queuedCount > 0 && (
        <div className="flex flex-col items-end text-[12.5px] text-stone-600">
          <span>
            Jonossa:{" "}
            <b className="text-brand-dark font-bold tabular-nums">
              {queuedCount}
            </b>
          </span>
        </div>
      )}
    </section>
  );
}

function Track({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="relative flex w-full"
      role="img"
      aria-label={label}
      style={{
        height: BAR_HEIGHT,
        borderRadius: TRACK_RADIUS,
        overflow: "hidden",
        boxShadow: `0 0 0 ${WALL}px ${SURFACE}`,
      }}
    >
      {children}
    </div>
  );
}

function Figure({ value, light }: { value: string; light: boolean }) {
  return (
    <span
      className="block text-[12.5px] leading-none font-bold whitespace-nowrap tabular-nums"
      style={{ color: light ? "#ffffff" : FIGURE }}
    >
      {value}
    </span>
  );
}

function QuotaBarItem({ row }: { row: QuotaBarRow }) {
  const color = getQuotaColor(row.colorIndex);
  const size = row.size;
  // Capped on purpose: a quota's own bar never runs past its own size. The
  // people beyond it are in the shared-places bar, in this quota's colour.
  const taken =
    size === null ? row.signupCount : Math.min(row.signupCount, size);
  const free = size === null ? 0 : Math.max(size - taken, 0);
  const figure = size === null ? `${taken}` : `${taken} / ${size}`;
  const note = sharedNote(row, free === 0);

  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-[12.5px] font-bold text-stone-600">
          {row.title}
        </span>
        {note !== null && (
          <span
            className={`text-[12px] ${
              note.urgent
                ? "text-brand-secondary font-semibold"
                : "text-stone-600"
            }`}
          >
            {note.text}
          </span>
        )}
      </div>

      <Track label={describeRow(row)}>
        {taken === 0 ? (
          // No filled part, so the figure cannot live inside one. It moves to
          // the empty zone in dark ink rather than giving an empty quota a
          // 66px block of colour with nobody in it.
          <div
            className="flex items-center px-2"
            style={zoneStyle(color.pale, null, MIN_ZONE)}
          >
            <Figure value={figure} light={false} />
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-end overflow-hidden px-2"
              style={zoneStyle(
                color.fill,
                size === null || free === 0 ? null : share(taken, size),
                MIN_FILLED,
              )}
            >
              <Figure value={figure} light />
            </div>
            {free > 0 && size !== null && (
              <div style={zoneStyle(color.pale, share(free, size), MIN_ZONE)} />
            )}
          </>
        )}
      </Track>
    </li>
  );
}

/**
 * The shared places: one bar, split between the quotas whose people are sitting
 * in them, then the free remainder in grey.
 *
 * The floor belongs to the group of holders rather than to any one of them.
 * On the last holder it would stretch a two-place share to 66px and the bar
 * would lie about the very thing it exists to show; on the group it only
 * moves the boundary between taken and free, like every other bar.
 */
function SharedPlacesBar({ shared }: { shared: SharedPlaces }) {
  const taken = shared.total - shared.remaining;
  const figure = `${taken} / ${shared.total}`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h4 className="text-[12.5px] font-bold text-stone-700">
          Yhteiset paikat
        </h4>
        <span className="text-[12px] font-semibold text-stone-600 tabular-nums">
          {shared.remaining} vapaana
        </span>
      </div>

      <Track label={describeShared(shared)}>
        {taken === 0 ? (
          <div
            className="flex items-center px-2"
            style={zoneStyle(GREY, null, MIN_ZONE)}
          >
            <Figure value={figure} light={false} />
          </div>
        ) : (
          <>
            <div
              className="relative flex"
              style={{
                flex: `0 1 ${share(taken, shared.total)}`,
                minWidth: MIN_FILLED,
                height: "100%",
              }}
            >
              {shared.holders
                .filter((holder) => holder.count > 0)
                .map((holder, index, holders) => (
                  <div
                    key={holder.id}
                    className="relative"
                    style={zoneStyle(
                      getQuotaColor(holder.colorIndex).fill,
                      share(holder.count, taken),
                      MIN_ZONE,
                    )}
                  >
                    {/* The cut is in the pool's own grey, not the card's
                        white: between two quotas sitting in the shared
                        places it should read as the pool showing through,
                        not as the card slicing the bar in half. Laid over
                        the boundary rather than inside either zone, so
                        neither quota's share is measured a pixel short. */}
                    {index < holders.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute inset-y-0"
                        style={{
                          right: -SEAM / 2,
                          width: SEAM,
                          background: GREY,
                          transform: `skewX(${SEAM_LEAN})`,
                        }}
                      />
                    )}
                  </div>
                ))}
              {/* Over the holders rather than inside the last of them: the
                  figure counts the whole filled part, not one quota's share
                  of it. */}
              <span
                className="absolute top-0 bottom-0 z-10 flex items-center pr-2"
                style={{ right: 0 }}
              >
                <Figure value={figure} light />
              </span>
            </div>
            {shared.remaining > 0 && (
              <div
                style={zoneStyle(
                  GREY,
                  share(shared.remaining, shared.total),
                  MIN_ZONE,
                )}
              />
            )}
          </>
        )}
      </Track>

      {shared.holders.length > 0 && (
        <div className="-mt-px flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-500">
          {shared.holders.map((holder) => (
            <span key={holder.id} className="flex items-center gap-1.5">
              <span
                className="size-2 shrink-0"
                style={{ background: getQuotaColor(holder.colorIndex).fill }}
              />
              <span className="truncate">{holder.title}</span>
              <b className="font-bold tabular-nums" style={{ color: FIGURE }}>
                {holder.count}
              </b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * What the shared places mean for this row, in the words that fit its state.
 * Only the one the reader can act on right now is given the brand colour;
 * the rest are quiet, because they are context rather than news.
 */
function sharedNote(
  row: QuotaBarRow,
  isFull: boolean,
): { text: string; urgent: boolean } | null {
  if (row.sharedAccess === "never" || row.size === null) return null;
  if (row.sharedAccess === "afterClose") {
    return {
      text: "+ yhteiset paikat ilmoittautumisen päätyttyä",
      urgent: false,
    };
  }
  if (!isFull) {
    return {
      text: "+ yhteiset paikat kiintiön täytyttyä",
      urgent: false,
    };
  }
  return row.continuesToShared
    ? { text: "→ yhteisiä paikkoja vapaana", urgent: true }
    : { text: "Myös yhteiset paikat täynnä", urgent: false };
}

function describeShared(shared: SharedPlaces): string {
  const parts = [
    `Yhteiset paikat: ${shared.total - shared.remaining} / ${shared.total} käytössä`,
  ];
  for (const holder of shared.holders) {
    parts.push(`${holder.title} ${holder.count}`);
  }
  if (shared.remaining > 0) parts.push(`${shared.remaining} vapaana`);
  return parts.join(", ");
}

function describeRow(row: QuotaBarRow): string {
  const parts = [`${row.title}: ${row.signupCount} ilmonnutta`];
  if (row.size === null) {
    parts.push("paikkamäärää ei ole rajattu");
  } else {
    const taken = Math.min(row.signupCount, row.size);
    parts.push(`kiintiössä ${taken} / ${row.size}`);
    if (row.sharedPlacesUsed > 0) {
      parts.push(`lisäksi ${row.sharedPlacesUsed} yhteisillä paikoilla`);
    }
  }
  const note = sharedNote(row, row.freePlaces === 0);
  if (note) parts.push(note.text.toLowerCase());
  return parts.join(", ");
}
