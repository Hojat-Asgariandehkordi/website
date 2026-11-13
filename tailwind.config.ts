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
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px" },
      boxShadow: {
        soft: "0 1px 2px rgba(19,42,31,.04), 0 8px 24px -8px rgba(19,42,31,.10)",
        lift: "0 2px 4px rgba(19,42,31,.04), 0 24px 48px -16px rgba(19,42,31,.22)",
        glow: "0 0 0 1px rgba(255,255,255,.06), 0 30px 80px -20px rgba(0,0,0,.55)",
      },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        draw: { "0%": { strokeDasharray: "0 94.2" } },
        grow: { "0%": { transform: "scaleY(0)" }, "100%": { transform: "scaleY(1)" } },
        fadein: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "none" } },
        drift: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "50%": { transform: "translate(-40px,30px) scale(1.08)" } },
        shine: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
      },
      animation: {
        rise: "rise .7s cubic-bezier(.2,.7,.2,1) both",
        float: "float 7s ease-in-out infinite",
        draw: "draw 1.6s cubic-bezier(.2,.7,.2,1) .6s both",
        grow: "grow .9s cubic-bezier(.2,.7,.2,1) both",
        fadein: "fadein .5s cubic-bezier(.2,.7,.2,1) both",
        drift: "drift 18s ease-in-out infinite",
        shine: "shine 6s linear infinite",
      },
    },
  },
  plugins: [typography],
};

export default config;
