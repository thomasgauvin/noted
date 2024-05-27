/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "-md": { max: "767px" },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100ch", // add required value here
          },
        },
      },
      colors: {
        primary: "#52525b",
        secondary: "#a1a1aa",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar")({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
    require("tailwindcss-bg-patterns"),
  ],
};

