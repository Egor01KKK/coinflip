// Chain configuration
export const CHAIN_ID = 8453; // Base Mainnet
export const CHAIN_ID_SEPOLIA = 84532; // Base Sepolia

// Use Sepolia for development, switch to mainnet for production
export const IS_TESTNET = process.env.NODE_ENV === "development";
export const ACTIVE_CHAIN_ID = IS_TESTNET ? CHAIN_ID_SEPOLIA : CHAIN_ID;

// Contract address - update after deployment
export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

// Leaderboard refresh interval (ms)
export const LEADERBOARD_REFRESH_INTERVAL = 5000;

// Share text templates
export const SHARE_TEMPLATES = {
  streak: (streak: number) =>
    `I just hit a ${streak} flip streak on CoinFlip! Can you beat it?`,
  win: (wins: number, total: number) =>
    `I've won ${wins}/${total} flips on CoinFlip! Playing on Base.`,
  newRecord: (streak: number) =>
    `NEW RECORD! ${streak} flip streak on CoinFlip! Who can beat this?`,
};

// App metadata
export const APP_NAME = "CoinFlip";
export const APP_DESCRIPTION =
  "Flip coins onchain on Base. Build your streak and climb the leaderboard!";
export const APP_URL = "https://coinflip.base.org"; // Update with actual URL

// Farcaster frame metadata
export const FARCASTER_FRAME = {
  version: "next",
  imageUrl: `${APP_URL}/og-image.png`,
  button: {
    title: "Play CoinFlip",
    action: {
      type: "launch_frame",
      name: APP_NAME,
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#1a1a2e",
    },
  },
};
