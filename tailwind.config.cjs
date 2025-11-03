/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

const BRAND_GREEN = "#5E8C63";
const BRAND_DARKGREEN ="#355E3B";
const BRAND_LIME = "#D8DA71";
const BRAND_LIGHT = "#FCFAF7";
const BRAND_BEIGE = "#F4EEE7";
const BRAND_DARK = "#333333";
const BRAND_DANGER = "#E07A5F";

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
        secondary: ["Open Sans", "sans-serif"]
      },
      colors: {
        ...colors,
        brand: {
          DEFAULT: BRAND_GREEN,
          primary: BRAND_GREEN,
          secondary: BRAND_LIME,
          green: BRAND_GREEN,
          darkgreen: BRAND_DARKGREEN,
          lime: BRAND_LIME,
          beige: BRAND_BEIGE,
          light: BRAND_LIGHT,
          dark: BRAND_DARK,
          danger: BRAND_DANGER,
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
