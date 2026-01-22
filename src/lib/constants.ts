/**
 * King of the Base - Application Constants
 * Colors, limits, texts, and configuration values
 */

/**
 * Color Palette - Pixel/Neon Theme
 * 8-bit retro style with neon green accents
 */
export const COLORS = {
  bgPrimary: '#0a0a0a',      // Black background
  accentNeon: '#00ff88',     // Neon green (main accent)
  accentGold: '#ffd700',     // Gold (crown/king theme)
  accentRed: '#ff4444',      // Red (usurp/action button)
  textPrimary: '#ffffff',    // White text
  pixelBorder: '#00ff88',    // Pixel art borders (neon green)
} as const;

/**
 * Game Limits and Configuration
 */
export const LIMITS = {
  messageMaxLength: 30,        // Max characters for king message
  dailyFreeAttempts: 10,       // Free attempts per day
  protectionTimeSeconds: 3,    // Protection period after throne capture
  pollingIntervalMs: 2000,     // Real-time update interval (2 seconds)
  leaderboardTopCount: 3,      // Number of top players to display
} as const;

/**
 * Chain IDs for Base Network
 */
export const CHAIN_IDS = {
  base: 8453,           // Base Mainnet
  baseSepolia: 84532,   // Base Sepolia Testnet
} as const;

/**
 * UI Text Constants
 */
export const TEXTS = {
  appTitle: 'King of the Base',
  appDescription: 'Seize the throne. Rule the Base.',

  // Button Labels
  usurpButton: '⚔️ USURP ⚔️',
  seizeThrone: 'Seize the Throne',
  shareButton: '📢 Challenge Friends',
  connectWallet: 'Connect Wallet',

  // Status Messages
  noKing: 'The throne is empty...',
  youAreKing: '👑 You are the King!',
  protectionActive: '🛡️ Protection Active',

  // Placeholders
  messagePlaceholder: 'Your royal message...',

  // Labels
  reigningFor: 'Reigning:',
  freeAttempts: 'Free attempts:',
  topLeaders: '👑 Top Leaders',

  // Share Text Template
  shareTextTemplate: (reignTime: number) =>
    `👑 I just became King of the Base!\nReigned for ${reignTime}s\nCan you dethrone me?\n\n🎮 Play now:`,
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  freeAttempts: 'kotb_free_attempts',
  lastAttemptDate: 'kotb_last_attempt_date',
} as const;

/**
 * Warpcast (Farcaster) Configuration
 */
export const WARPCAST = {
  composeUrl: 'https://warpcast.com/~/compose',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://kingofthebase.app',
} as const;
