import { CONTRACT_ADDRESS } from "./constants";

// CoinFlip contract ABI
export const COINFLIP_ABI = [
  {
    type: "function",
    name: "flip",
    inputs: [{ name: "guessHeads", type: "bool", internalType: "bool" }],
    outputs: [
      { name: "won", type: "bool", internalType: "bool" },
      { name: "wasHeads", type: "bool", internalType: "bool" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getPlayerStats",
    inputs: [{ name: "player", type: "address", internalType: "address" }],
    outputs: [
      { name: "wins", type: "uint256", internalType: "uint256" },
      { name: "losses", type: "uint256", internalType: "uint256" },
      { name: "currentStreak", type: "uint256", internalType: "uint256" },
      { name: "maxStreak", type: "uint256", internalType: "uint256" },
      { name: "totalFlips", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLeaderboard",
    inputs: [],
    outputs: [
      {
        name: "entries",
        type: "tuple[]",
        internalType: "struct CoinFlip.LeaderboardEntry[]",
        components: [
          { name: "player", type: "address", internalType: "address" },
          { name: "maxStreak", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLeaderboardSize",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "playerStats",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "wins", type: "uint256", internalType: "uint256" },
      { name: "losses", type: "uint256", internalType: "uint256" },
      { name: "currentStreak", type: "uint256", internalType: "uint256" },
      { name: "maxStreak", type: "uint256", internalType: "uint256" },
      { name: "totalFlips", type: "uint256", internalType: "uint256" },
      { name: "lastFlipBlock", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "FlipResult",
    inputs: [
      { name: "player", type: "address", indexed: true, internalType: "address" },
      { name: "guessedHeads", type: "bool", indexed: false, internalType: "bool" },
      { name: "wasHeads", type: "bool", indexed: false, internalType: "bool" },
      { name: "won", type: "bool", indexed: false, internalType: "bool" },
      { name: "currentStreak", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "maxStreak", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NewHighScore",
    inputs: [
      { name: "player", type: "address", indexed: true, internalType: "address" },
      { name: "maxStreak", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
] as const;

// Contract configuration for wagmi
export const coinFlipContract = {
  address: CONTRACT_ADDRESS,
  abi: COINFLIP_ABI,
} as const;
