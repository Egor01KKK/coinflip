import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050510',
        'bg-secondary': '#0a0a0a',
        'border-stone': '#2d3748',
        'accent-neon': '#00ff88',
        'accent-cyan': '#00ffff',
        'accent-gold': '#ffd700',
        'accent-red': '#FF0000',
        'text-primary': '#ffffff',
        'pixel-border': '#00ff88',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      boxShadow: {
        'neon': '0 0 10px #00ff88, 0 0 20px #00ff88',
        'neon-strong': '0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88',
        'gold': '0 0 10px #ffd700, 0 0 20px #ffd700',
      },
    },
  },
  plugins: [],
};

export default config;
