/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#EEF1F7",
          100: "#D7DDEB",
          200: "#AEB9D3",
          300: "#8593B8",
          400: "#5C6E9D",
          500: "#3A4D7E",
          600: "#283864",
          700: "#1B2A4A",
          800: "#131F38",
          900: "#0B1426",
        },
        brass: {
          50: "#FBF3E7",
          100: "#F5E2C2",
          200: "#EBC788",
          300: "#DDAA5C",
          400: "#C8893A",
          500: "#AD712D",
          600: "#8C5A23",
          700: "#6B441A",
        },
        rust: {
          50: "#F7EAE6",
          400: "#C2543D",
          500: "#A13D2B",
          600: "#812F20",
        },
        bone: "#F7F4ED",
        linen: "#F0EAE0",
        ink: {
          50: "#F1F2F4",
          100: "#E1E3E8",
          200: "#C4C8D1",
          300: "#9CA2B0",
          400: "#6B7180",
          500: "#4A4F5C",
          600: "#363A44",
          700: "#262932",
          800: "#1A1C22",
          900: "#0E0F13",
        },
        verified: {
          50: "#E9F4ED",
          400: "#3E9764",
          500: "#2A7A4C",
          600: "#1F5E3A",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,20,38,0.04), 0 10px 28px -10px rgba(11,20,38,0.14)",
        "card-lg": "0 4px 14px rgba(11,20,38,0.06), 0 28px 56px -18px rgba(11,20,38,0.20)",
      },
      borderRadius: {
        card: "0.875rem",
      },
    },
  },
  plugins: [],
};
