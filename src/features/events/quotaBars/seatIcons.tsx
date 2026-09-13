/**
 * One family of furniture, drawn solid.
 *
 * A front-view chair with the parts that make one recognisable: a wide
 * backrest floating above the seat on two posts, and legs that splay
 * outwards. The bench is the same chair stretched — same viewpoint, same
 * parts, one unbroken backrest, and the only difference is width. That
 * difference is the message: narrow is one place, wide is many. Solid rather
 * than outlined because at 14-16px outlined shapes close up into a smudge.
 *
 * Sizes are tuned per glyph rather than shared, because each one covers a
 * different share of its viewBox: the chair 59%, the person 67%, the bench
 * 91%. Equal `size` values would read as three different weights.
 */
type IconProps = {
  size: number;
  className?: string;
  style?: React.CSSProperties;
};

function Glyph({
  size,
  className,
  style,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="currentColor"
      stroke="none"
      aria-hidden
      focusable="false"
      className={`block shrink-0 ${className ?? ""}`}
      style={style}
    >
      {children}
    </svg>
  );
}

/** A person who has signed up. */
export function PersonIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="7" cy="4.1" r="2.3" />
      <path d="M7 7.2c-2.5 0-4.4 1.9-4.4 4.3 0 .3.2.5.5.5h7.8c.3 0 .5-.2.5-.5 0-2.4-1.9-4.3-4.4-4.3z" />
    </Glyph>
  );
}

/** One free place inside a quota. */
export function ChairIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3.6" y="1.8" width="6.8" height="2.8" rx="1.1" />
      <rect x="4.4" y="4.6" width="1" height="2" />
      <rect x="8.6" y="4.6" width="1" height="2" />
      <rect x="2.8" y="6.5" width="8.4" height="1.5" rx="0.7" />
      <path d="M4 8.1h1l-.6 3.6h-1z" />
      <path d="M10 8.1h-1l.6 3.6h1z" />
    </Glyph>
  );
}

/** The shared places, which belong to no single quota. */
export function BenchIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="0.9" y="1.8" width="12.2" height="2.8" rx="1.1" />
      <rect x="1.9" y="4.6" width="1" height="1.9" />
      <rect x="11.1" y="4.6" width="1" height="1.9" />
      <rect x="0.4" y="6.5" width="13.2" height="1.5" rx="0.7" />
      <path d="M1.6 8.1h1l-.6 3.6h-1z" />
      <path d="M12.4 8.1h-1l.6 3.6h1z" />
    </Glyph>
  );
}
