/**
 * One colour per quota, so the bars read as a set rather than as a rainbow.
 *
 * Every entry is the brand green rotated around the hue circle in OKLCH with
 * lightness and chroma held constant — `oklch(0.5956 0.0786 147.8)`, eight
 * hues, 45 degrees apart. The rotations sit at 64% of the green's chroma
 * because chroma is not perceptually even across hues: at the green's own
 * value a blue or a magenta reads considerably louder than it does.
 *
 * `pale` is the same hue lifted 54% toward white at 30% chroma. It is the
 * quota's unfilled places, so it has to stay clearly quieter than the fill
 * while still belonging to it.
 *
 * To add colours, keep going around the circle with the same formula rather
 * than picking new ones by eye.
 */
export type QuotaColor = {
  /** Places taken. */
  fill: string;
  /** Places still free in this quota. */
  pale: string;
};

/*
 * Listed so that neighbours in the list are far apart on the wheel rather
 * than adjacent on it. Quotas take colours in order, and most events have
 * two to four of them: at 45 degree steps those would come out as four
 * shades of the same thing.
 */
const QUOTA_COLORS: readonly QuotaColor[] = [
  { fill: "#5e8c64", pale: "#b9c7ba" }, // 148°  brand green
  { fill: "#63849a", pale: "#bac4cb" }, // 238°
  { fill: "#967861", pale: "#cac0b9" }, //  58°
  { fill: "#90758e", pale: "#c8bfc7" }, // 328°
  { fill: "#5b8987", pale: "#b8c5c5" }, // 193°
  { fill: "#7a7c9d", pale: "#c0c1cc" }, // 283°
  { fill: "#9b7376", pale: "#ccbebf" }, //  13°
  { fill: "#84815e", pale: "#c4c3b8" }, // 103°
];

/**
 * Colours cycle once an event has more quotas than the palette holds. Two
 * quotas eight rows apart sharing a hue is not a misreading risk: the rows
 * are labelled, and nothing in the component compares them by colour.
 */
export function getQuotaColor(index: number): QuotaColor {
  return QUOTA_COLORS[index % QUOTA_COLORS.length]!;
}

export const QUOTA_COLOR_COUNT = QUOTA_COLORS.length;
