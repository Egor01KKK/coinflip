/**
 * useKingData Hook
 * Polls contract state every 2 seconds using TanStack Query
 * Returns current king data: address, reign duration, message, and protection status
 */

import { useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { LIMITS } from '@/lib/constants';

/**
 * Hook return type matching getKingData contract function
 */
export interface KingData {
  king: `0x${string}` | undefined;
  reignDuration: bigint | undefined;
  message: string | undefined;
  isProtected: boolean | undefined;
}

/**
 * Custom hook to read and poll king data from the contract
 *
 * @returns KingData object with current throne state
 *
 * @example
 * ```tsx
 * const { king, reignDuration, message, isProtected } = useKingData();
 * ```
 */
export function useKingData(): KingData {
  // Read contract data using wagmi
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getKingData',
  });

  // Set up polling with TanStack Query
  // Refetch every 2 seconds for real-time updates
  useQuery({
    queryKey: ['kingData'],
    queryFn: () => refetch(),
    refetchInterval: LIMITS.pollingIntervalMs,
  });

  // Return destructured data with proper typing
  // getKingData returns a tuple: [address king, uint256 reignDuration, string message, bool isProtected]
  return {
    king: data?.[0],
    reignDuration: data?.[1],
    message: data?.[2],
    isProtected: data?.[3],
  };
}
