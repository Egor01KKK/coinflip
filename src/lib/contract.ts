/**
 * KingOfTheBase Contract Constants
 * Contract ABI and deployed address for Base Sepolia testnet
 */

/**
 * Contract address from environment variable
 * Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local after deployment
 */
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

/**
 * KingOfTheBase Contract ABI
 * Generated from contracts/src/KingOfTheBase.sol
 */
export const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'seizeThrone',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'message',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getKingData',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: 'king',
        type: 'address',
      },
      {
        name: 'reignDuration',
        type: 'uint256',
      },
      {
        name: 'message',
        type: 'string',
      },
      {
        name: 'isProtected',
        type: 'bool',
      },
    ],
  },
  {
    type: 'function',
    name: 'getLeaderboard',
    stateMutability: 'view',
    inputs: [
      {
        name: 'players',
        type: 'address[]',
      },
    ],
    outputs: [
      {
        name: 'times',
        type: 'uint256[]',
      },
    ],
  },
  {
    type: 'function',
    name: 'currentKing',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    type: 'function',
    name: 'reignStartTime',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    name: 'protectionEndTime',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    name: 'kingMessage',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
  },
  {
    type: 'function',
    name: 'totalReignTime',
    stateMutability: 'view',
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    type: 'event',
    name: 'ThroneSeized',
    inputs: [
      {
        name: 'newKing',
        type: 'address',
        indexed: true,
      },
      {
        name: 'message',
        type: 'string',
        indexed: false,
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
      },
    ],
  },
] as const;
