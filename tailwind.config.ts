import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#07090d",
          900: "#0b0e14",
          850: "#0f131b",
          800: "#131824",
          700: "#1b2231",
          600: "#252e42",
        },
        ink: {
          100: "#f2f5fa",
          200: "#d6dce8",
          300: "#a9b3c6",
          400: "#7c87a0",
          500: "#5a6478",
        },
        accent: {
          300: "#8ab8ff",
          400: "#5e96f5",
          500: "#3b76e0",
          600: "#2c5cbb",
        },
        mint: { 400: "#4fd1a5" },
        amber: { 350: "#f2b25c" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { content: "72rem" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "flow-dash": {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.9s ease both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "flow-dash": "flow-dash 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
