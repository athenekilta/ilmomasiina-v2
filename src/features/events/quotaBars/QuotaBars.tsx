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
 * One bar per quota plus one for the open places. Each bar carries its own
 * figure inside the filled part, anchored to that part's right edge, so the
 * figure is always white on colour and never has to change colour with the
 * situation. That anchoring is the reason the filled part has a floor: a
 * figure cannot sit inside a zone narrower than itself.
 *
 * A quota's bar shows ONLY that quota's own places, so `40 / 40` is a solid
 * block and `22 / 40` is half a block, and the two can never be mistaken for
 * each other. Places its people took from the open pool live in the open bar
 * instead, in that quota's own colour — an earlier version drew them as a
 * lighter band at the end of the quota's own bar, where they read exactly
 * like free places, which is the opposite of what they are.
 *
 * The component owns its white card because the 1.5px wall around each bar is
 * painted in the card's own background colour. Moving it onto a tinted
 * surface means changing SURFACE to match.
 */

const BAR_HEIGHT = 23;
const RADIUS = 7;
/**
 * The hairline around each bar, in the card's own background colour — so it
 * has to move with the card: the signup column sits on the page panel's white.
 */
const WALL = 1.5;
const SURFACE = "#ffffff";
const GREY = "#d8d3cc";
/** The hairline between two quotas inside the open bar. Thinner than the
 *  wall around the bar: it separates rather than encloses. */
const SEAM = 1;
const FIGURE = "#5c564f";
/**
 * Enough for "22 / 40" and its padding. The filled zone never goes below it,
 * or the figure it carries would not fit inside it. The cost is that a very
 * short filled zone stretches to this width and overstates itself — 2 of 30
 * draws as 18% rather than 7%.
 */
const MIN_FILLED = 66;

/**
 * Only the first zone has a rounded left end. The ones after it are square on
 * the left and slide under the zone before them, so that zone's rounded right
 * end cuts the notch. Round both ends of both and a lens-shaped hole opens
 * between the two curves.
 *
 * The notch costs RADIUS px, which is added back into the zone's basis:
 * otherwise every seam shortens the bar and the last zone stops short of the
 * bar's own right edge.
 */
function zoneStyle(
  index: number,
  background: string,
  basis: string | null,
  minWidth: number,
): React.CSSProperties {
  return {
    flex:
      basis === null
        ? "1 1 auto"
        : index === 0
          ? `0 1 ${basis}`
          : `0 1 calc(${basis} + ${RADIUS}px)`,
    minWidth,
    height: "100%",
    background,
    borderRadius: index === 0 ? RADIUS : `0 ${RADIUS}px ${RADIUS}px 0`,
    marginLeft: index === 0 ? 0 : -RADIUS,
    zIndex: 30 - index,
  };
}

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
        borderRadius: RADIUS,
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
  // people beyond it are in the open bar, in this quota's colour.
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
            style={zoneStyle(0, color.pale, null, 2 * RADIUS)}
          >
            <Figure value={figure} light={false} />
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-end overflow-hidden px-2"
              style={zoneStyle(
                0,
                color.fill,
                size === null || free === 0 ? null : share(taken, size),
                MIN_FILLED,
              )}
            >
              <Figure value={figure} light />
            </div>
            {free > 0 && size !== null && (
              <div
                style={zoneStyle(1, color.pale, share(free, size), 2 * RADIUS)}
              />
            )}
          </>
        )}
      </Track>
    </li>
  );
}

/**
 * The open places: one bar, split between the quotas whose people are sitting
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
            style={zoneStyle(0, GREY, null, 2 * RADIUS)}
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
                zIndex: 30,
              }}
            >
              {shared.holders
                .filter((holder) => holder.count > 0)
                .map((holder, index) => (
                  <div
                    key={holder.id}
                    style={{
                      ...zoneStyle(
                        index,
                        getQuotaColor(holder.colorIndex).fill,
                        share(holder.count, taken),
                        2 * RADIUS,
                      ),
                      // A hairline at every seam inside this bar, in the
                      // pool's own grey rather than the card's white: it
                      // reads as the open places showing through between two
                      // quotas, not as the card cutting the bar in half.
                      // Elsewhere a seam divides a colour from its own pale
                      // and needs nothing; here two quotas' fills meet at
                      // full strength and the notch alone is nearly
                      // invisible. Offset rather than spread, so it traces
                      // the rounded end and paints over the zone beneath
                      // instead of eating into this one.
                      boxShadow: `${SEAM}px 0 0 0 ${GREY}`,
                    }}
                  />
                ))}
              {/* Above the holders: they carry z-indexes of their own, and a
                  figure below them is simply invisible. */}
              <span
                className="absolute top-0 bottom-0 z-50 flex items-center pr-2"
                style={{ right: 0 }}
              >
                <Figure value={figure} light />
              </span>
            </div>
            {shared.remaining > 0 && (
              <div
                style={zoneStyle(
                  1,
                  GREY,
                  share(shared.remaining, shared.total),
                  2 * RADIUS,
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
                className="size-2 shrink-0 rounded-[2px]"
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
 * What the open places mean for this row, in the words that fit its state.
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
