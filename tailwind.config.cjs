/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

const BRAND_GREEN = "#5E8C64";
const BRAND_DARKGREEN = "#355E3B";
const BRAND_LIGHT = "#FAFAFA";
const BRAND_BEIGE = "#F4EEE7";
const BRAND_PAPER_SHADOW = "#ECE4DB";

const BRAND_DARK = "#33302B";
/* Metadata and other quiet text: the same ink, lightened, never a cold grey. */
const BRAND_MUTED = "#6E665C";
const BRAND_DANGER = "#E07A5F";
const BRAND_LIME = "#DDE8B8";
/* Background colour the event images are drawn on — the card banner fades
   into this exact value, so the fade reads as part of the image. */
const BRAND_SAND = "#EDE3D7";
/* Loud accent, used only for the hype badge. Magenta-leaning rather than
   warm, so it never gets mistaken for the coral that means "closed". */
const BRAND_PINK = "#D2497F";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      opacity: {
        15: "0.15",
        85: "0.85",
      },
      fontFamily: {
        primary: ["Lexend", "sans-serif"],
        secondary: ["Lexend Exa", "sans-serif"],
        display: ["DM Serif Display", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(51, 51, 51, 0.05), 0 1px 3px rgba(51, 51, 51, 0.08)",
        card: "0 4px 6px -1px rgba(51, 51, 51, 0.06), 0 2px 4px -2px rgba(51, 51, 51, 0.04)",
      },
      borderRadius: {
        /*
          Nearly square, and deliberately not square.

          The guild's site draws blocks as rectangles, so a 12px radius read
          as a generic product that had wandered in. But a true 90° corner
          reads as an engineering guild's house style, and Athene is not
          that: its own shared principles are "kunnioita, ole avoin, puutu,
          kannusta, rentoudu", and the programme describes itself as
          technology, communications, social science, design and business
          combined in a creative way. Warm, open, relaxed.

          So the corner is cut just enough to be felt and not enough to be
          seen as a shape of its own. The warmth is carried by the things
          that should carry it — the paper tones, the illustrations, the
          tags taped on at an angle — rather than by rounding everything.
        */
        /* Buttons, inputs, selects: the smallest step, because a control is
           the densest thing on the page and the only one with many corners
           close together. */
        control: "0.125rem",
        /* Cards and other large surfaces. */
        card: "0.25rem",
        /* Boxes nested inside a card: a step tighter than the card, so the
           nesting still reads as nesting. */
        inner: "0.1875rem",
      },
      colors: {
        ...colors,
        brand: {
          DEFAULT: BRAND_GREEN,
          primary: BRAND_GREEN,
          secondary: BRAND_DARKGREEN,
          green: BRAND_GREEN,
          darkgreen: BRAND_DARKGREEN,
          beige: BRAND_BEIGE,
          paperShadow: BRAND_PAPER_SHADOW,

          light: BRAND_LIGHT,
          dark: BRAND_DARK,
          muted: BRAND_MUTED,
          danger: BRAND_DANGER,
          lime: BRAND_LIME,
          sand: BRAND_SAND,
          pink: BRAND_PINK,
        },
        gray: colors.stone,
        primary: colors.green,
        secondary: colors.lime,
        success: { ...colors.emerald, DEFAULT: colors.emerald[600] },
        warning: { ...colors.amber, DEFAULT: colors.amber[600] },
        /*
          Danger in the brand's own coral rather than Tailwind's rose.

          Rose is a cold magenta red. On this warm paper it read as a
          different product's alert colour, and it sat uncomfortably close to
          the hype badge's pink — two unrelated meanings in nearly the same
          hue. The ramp below is built around the brand's existing
          `#E07A5F`, so a destructive control is unmistakably a warning and
          unmistakably ours.
        */
        danger: {
          50: "#FCF1EC",
          100: "#F8DFD5",
          200: "#F1C4B1",
          300: "#E9A88D",
          400: "#E49174",
          500: BRAND_DANGER,
          600: BRAND_DANGER,
          700: "#C6624A",
          800: "#A14E3B",
          900: "#7E3E2F",
          DEFAULT: BRAND_DANGER,
        },
      },
      keyframes: {
        "float-custom": {
          "0%, 100%": {
            transform: "translateY(var(--float-amount, 5%))",
          },
          "50%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "float-custom":
          "float-custom var(--animation-duration, 4s) var(--animation-delay, 0s) infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
    require("tailwind-current-hue"),
    plugin(({ addVariant }) => {
      // Data-active states
      addVariant(`d-active`, `&[data-active=true]`);
      addVariant(`d-inactive`, `&[data-active=false]`);

      // Data-loading states
      addVariant(`d-loading`, `&[data-loading=true]`);
      addVariant(`d-notloading`, `&[data-loading=false]`);

      // Data-error states
      addVariant(`d-error`, `&[data-error=true]`);
      addVariant(`d-noerror`, `&[data-error=false]`);

      // Orientation states
      addVariant(`d-row`, `&[data-orientation=row]`);
      addVariant(`d-col`, `&[data-orientation=column]`);
      addVariant(`d-horizontal`, `&[data-orientation=horizontal]`);
      addVariant(`d-vertical`, `&[data-orientation=vertical]`);

      // Read states
      addVariant(`d-read`, `&[data-is-read=true]`);
      addVariant(`d-unread`, `&[data-is-read=false]`);
    }),
  ],
};
