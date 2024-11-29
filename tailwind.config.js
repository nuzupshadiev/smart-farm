import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#e8f9e8", // Very light green, almost white
              100: "#c8edc8", // Pale green
              200: "#a4e0a4", // Soft green
              300: "#7fd47f", // Light green
              400: "#5bc85b", // Bright green
              500: "#36bc36", // Default green
              600: "#2ea12e", // Slightly darker green
              700: "#278527", // Forest green
              800: "#206920", // Darker forest green
              900: "#184b18", // Deep green
              foreground: "#FFFFFF", // White for contrast
              DEFAULT: "#278527", // Set the default green
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#1a2e1a", // Very dark green, almost black
              100: "#234423", // Deep forest green
              200: "#2d5a2d", // Dark green
              300: "#397639", // Rich green
              400: "#47a347", // Bright green for dark mode
              500: "#55c455", // Default vibrant green
              600: "#4aad4a", // Slightly muted vibrant green
              700: "#3c873c", // Deep vibrant green
              800: "#2f632f", // Dark forest green
              900: "#204220", // Almost black green
              foreground: "#E6FFE6", // Soft light green for contrast
              DEFAULT: "#3c873c", // Default green for dark mode
            },
          },
        },
      },
    }),
  ],
};
