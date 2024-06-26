/** @type {import("tailwindcss").Config} */
const { createThemes } = require("tw-colors");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        CourierPrime: ["Courier Prime", "monospace"],
        Inter: ["Inter", "sans-serif"],
        CrimsonText: ["'Crimson Text'", "serif"],
        SourceSans3: ["'Source Sans 3'", "sans-serif"],
      },
      colors: {},
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "*": {
              color: theme("colors.primary"),
            },
            "input[type=checkbox]": {
              margin: 0,
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    createThemes({
      base: {
        primary: "#6C6327",
        base: "#FFFEF8",
        highlight: "#1D405C",
      },
      dark: {
        primary: "#FFFFFA",
        base: "#0A1128",
      },
      accent: {
        primary: "#1F2041",
        base: "#e9e9ec",
      },
      secondary: {
        primary: "#fffffa",
        base: "#486aa0",
      },
    }),
  ],
};
