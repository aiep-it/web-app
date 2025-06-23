const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#fdf2f8",
              100: "#fce7f3",
              200: "#fbcfe8",
              300: "#f9a8d4",
              400: "#f472b6",
              500: "#ec008c",
              600: "#db2777",
              700: "#be185d",
              800: "#9d174d",
              900: "#831843",
              DEFAULT: "#ec008c",
              foreground: "#FFFFFF"
            },
            secondary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#6f2da8",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#6f2da8",
              foreground: "#FFFFFF"
            }
          }
        }
      }
    })
  ]
};

module.exports = config;
