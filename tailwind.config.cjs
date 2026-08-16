/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

const BRAND_GREEN = "#5E8C63";
const BRAND_DARKGREEN = "#355E3B";
const BRAND_LIGHT = "#FCFAF7";
const BRAND_BEIGE = "#F4EEE7";
const BRAND_DARK = "#333333";
const BRAND_DANGER = "#E07A5F";
const BRAND_LIME = "#DDE8B8";

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
        primary: ["Open Sans", "sans-serif"],
        secondary: ["Open Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(51, 51, 51, 0.05), 0 1px 3px rgba(51, 51, 51, 0.08)",
        card: "0 4px 6px -1px rgba(51, 51, 51, 0.06), 0 2px 4px -2px rgba(51, 51, 51, 0.04)",
      },
      borderRadius: {
        /* Shared buttons, inputs, selects — tight, not pill-shaped */
        control: "0.3125rem",
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
          light: BRAND_LIGHT,
          dark: BRAND_DARK,
          danger: BRAND_DANGER,
          lime: BRAND_LIME,
        },
        gray: colors.stone,
        primary: colors.green,
        secondary: colors.lime,
        success: { ...colors.emerald, DEFAULT: colors.emerald[600] },
        warning: { ...colors.amber, DEFAULT: colors.amber[600] },
        danger: { ...colors.rose, DEFAULT: colors.rose[600] },
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