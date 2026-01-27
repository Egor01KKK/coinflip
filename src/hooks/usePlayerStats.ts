"use client";

import { useReadContract, useAccount } from "wagmi";
import { coinFlipContract } from "@/lib/contract";

export type PlayerStats = {
  wins: bigint;
  losses: bigint;
  currentStreak: bigint;
  maxStreak: bigint;
  totalFlips: bigint;
};

export function usePlayerStats(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const playerAddress = address || connectedAddress;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    ...coinFlipContract,
    functionName: "getPlayerStats",
    args: playerAddress ? [playerAddress] : undefined,
    query: {
      enabled: !!playerAddress,
      refetchInterval: 3000, // Refetch every 3 seconds
    },
  });

  const stats: PlayerStats | null = data
    ? {
        wins: data[0],
        losses: data[1],
        currentStreak: data[2],
        maxStreak: data[3],
        totalFlips: data[4],
      }
    : null;

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}
