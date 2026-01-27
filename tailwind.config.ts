import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
      },
      colors: {
        gold: "#FFD700",
        "gold-dark": "#B8860B",
        "pixel-bg": "#1a1a2e",
        "pixel-card": "#16213e",
        "pixel-border": "#0f3460",
        "pixel-accent": "#e94560",
        "pixel-success": "#00ff88",
        "pixel-warning": "#ffaa00",
      },
      animation: {
        "coin-flip": "coinFlip 1s ease-in-out",
        "coin-spin": "coinSpin 0.1s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "bounce-in": "bounceIn 0.5s ease-out",
      },
      keyframes: {
        coinFlip: {
          "0%": { transform: "rotateY(0deg) translateY(0)" },
          "50%": { transform: "rotateY(900deg) translateY(-100px)" },
          "100%": { transform: "rotateY(1800deg) translateY(0)" },
        },
        coinSpin: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px #FFD700, 0 0 20px #FFD700" },
          "50%": { boxShadow: "0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700" },
        },
        bounceIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
