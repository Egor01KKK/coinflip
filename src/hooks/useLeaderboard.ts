"use client";

import { useReadContract } from "wagmi";
import { coinFlipContract } from "@/lib/contract";
import { LEADERBOARD_REFRESH_INTERVAL } from "@/lib/constants";

export type LeaderboardEntry = {
  player: `0x${string}`;
  maxStreak: bigint;
};

export function useLeaderboard() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    ...coinFlipContract,
    functionName: "getLeaderboard",
    query: {
      refetchInterval: LEADERBOARD_REFRESH_INTERVAL,
    },
  });

  const leaderboard: LeaderboardEntry[] = data
    ? data.map((entry) => ({
        player: entry.player,
        maxStreak: entry.maxStreak,
      }))
    : [];

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
  };
}
