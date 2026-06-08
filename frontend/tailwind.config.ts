import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
        danger: "hsl(var(--danger))",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.12)",
        line: "inset 0 1px 0 rgba(255,255,255,0.72)",
      },
      fontFamily: {
        display: ["Space Grotesk", "Manrope", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "Aptos", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
