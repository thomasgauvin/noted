import tailwindScrollbar from "tailwind-scrollbar";
import tailwindBgPatterns from "tailwindcss-bg-patterns";
import tailwindTypography from "@tailwindcss/typography";

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
    tailwindTypography,
    tailwindScrollbar({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
    tailwindBgPatterns,
  ],
};

