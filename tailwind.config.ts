import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F6F1E7", deep: "#EDE5D4", card: "#FBF8F2" },
        ink: { DEFAULT: "#1C2420", soft: "#4A544E", faint: "#6B736D" },
        cedar: { 50: "#EEF3EF", 100: "#D5E2D9", 300: "#7FA08A", 500: "#2F5A43", 700: "#1F3D2E", 900: "#132A1F" },
        clay: { 100: "#F4E1D3", 500: "#B5562F", 700: "#8A3F21" },
        brass: { 100: "#F3E8C9", 500: "#A9822C" },
        line: "#DCD3C1",
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', "Georgia", "serif"],
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
      },
      maxWidth: { prose: "68ch" },
      borderRadius: { xl: "14px", "2xl": "20px" },
    },
  },
  plugins: [typography],
};

export default config;
