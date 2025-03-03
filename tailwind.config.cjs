/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

const BRAND_GREEN = "#688B67";
const BRAND_LIME = "#D8DA71";
const BRAND_DARKBEIGE = "#EEE4D5";
const BRAND_BEIGE = "#F4EEE7";

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
        primary: ["Gentium Book Plus", "sans-serif"],
        secondary: ["Open Sans", "sans-serif"]
      },
      colors: {
        brand: {
          DEFAULT: BRAND_GREEN,
          primary: BRAND_GREEN,
          secondary: BRAND_LIME,
          green: BRAND_GREEN,
          lime: BRAND_LIME,
          beige: BRAND_BEIGE,
          darkbeige: BRAND_DARKBEIGE,
        },
        green: colors.green,
        lime: colors.lime,
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
    require("@headlessui/tailwindcss"),
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
