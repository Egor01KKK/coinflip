/**
 * useLeaderboardData Hook
 * Manages leaderboard state by tracking players and fetching their total reign times
 * Uses localStorage to persist player addresses and polls contract for current stats
 */

'use client';

import { useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { LIMITS } from '@/lib/constants';
import { useKingData } from './useKingData';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kotb_known_players';
const MAX_TRACKED_PLAYERS = 20;

/**
 * Leaderboard entry with address and total reign time
 */
export interface LeaderboardEntry {
  address: `0x${string}`;
  totalReignTime: bigint;
  rank: number;
}

/**
 * Get known player addresses from localStorage
 */
function getKnownPlayers(): `0x${string}`[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const players = JSON.parse(stored) as string[];
    return players.map(addr => addr as `0x${string}`);
  } catch {
    return [];
  }
}

/**
 * Add a new player address to known players list
 */
function addKnownPlayer(address: `0x${string}`): void {
  if (typeof window === 'undefined') return;
  if (!address || address === '0x0000000000000000000000000000000000000000') return;

  try {
    const players = getKnownPlayers();

    // Don't add if already exists
    if (players.includes(address)) return;

    // Add new player, keep only last MAX_TRACKED_PLAYERS
    const updated = [...players, address].slice(-MAX_TRACKED_PLAYERS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding known player:', error);
  }
}

/**
 * Custom hook to fetch and manage leaderboard data
 *
 * @returns Array of top 3 leaderboard entries sorted by total reign time
 *
 * @example
 * ```tsx
 * const leaderboard = useLeaderboardData();
 * leaderboard.forEach(entry => console.log(entry.address, entry.totalReignTime));
 * ```
 */
export function useLeaderboardData(): LeaderboardEntry[] {
  const { king } = useKingData();
  const [knownPlayers, setKnownPlayers] = useState<`0x${string}`[]>([]);

  // Track current king in known players list
  useEffect(() => {
    if (king && king !== '0x0000000000000000000000000000000000000000') {
      addKnownPlayer(king);
      setKnownPlayers(getKnownPlayers());
    }
  }, [king]);

  // Initialize known players from localStorage
  useEffect(() => {
    setKnownPlayers(getKnownPlayers());
  }, []);

  // Read leaderboard data from contract
  const { data: reignTimes, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getLeaderboard',
    args: [knownPlayers],
    query: {
      enabled: knownPlayers.length > 0,
    },
  });

  // Poll leaderboard data every 2 seconds
  useQuery({
    queryKey: ['leaderboardData', knownPlayers.length],
    queryFn: () => refetch(),
    refetchInterval: LIMITS.pollingIntervalMs,
    enabled: knownPlayers.length > 0,
  });

  // Process and sort leaderboard entries
  if (!reignTimes || !Array.isArray(reignTimes) || reignTimes.length === 0) {
    return [];
  }

  // Combine addresses with reign times
  const entries: LeaderboardEntry[] = knownPlayers
    .map((address, index) => ({
      address,
      totalReignTime: reignTimes[index] || BigInt(0),
      rank: 0,
    }))
    .filter(entry => entry.totalReignTime > BigInt(0)) // Only show players who have reigned
    .sort((a, b) => {
      // Sort by total reign time (descending)
      if (a.totalReignTime > b.totalReignTime) return -1;
      if (a.totalReignTime < b.totalReignTime) return 1;
      return 0;
    })
    .slice(0, LIMITS.leaderboardTopCount) // Take top 3
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return entries;
}
