/**
 * useSeizeThrone Hook
 * Prepares transaction calls for seizing the throne via OnchainKit Transaction component
 * Handles message validation and transaction preparation
 */

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { LIMITS } from '@/lib/constants';
import type { ContractFunctionParameters } from 'viem';

/**
 * Transaction call structure for OnchainKit Transaction component
 */
export interface SeizeThroneCall {
  to: `0x${string}`;
  abi: typeof CONTRACT_ABI;
  functionName: 'seizeThrone';
  args: [string];
}

/**
 * Hook return type with transaction preparation function
 */
export interface UseSeizeThroneReturn {
  /**
   * Prepares transaction call for seizing the throne
   * @param message - King's message (max 30 characters)
   * @returns Transaction call object for OnchainKit Transaction component
   * @throws Error if message exceeds character limit
   */
  prepareSeizeThrone: (message: string) => SeizeThroneCall[];

  /**
   * Validates if a message meets requirements
   * @param message - Message to validate
   * @returns true if valid, false otherwise
   */
  isValidMessage: (message: string) => boolean;
}

/**
 * Custom hook to prepare seizeThrone transaction calls
 * Used with OnchainKit's Transaction component for gasless transactions
 *
 * @returns Object with prepareSeizeThrone function and message validation
 *
 * @example
 * ```tsx
 * const { prepareSeizeThrone, isValidMessage } = useSeizeThrone();
 *
 * const handleUsurp = () => {
 *   const message = "Follow @mychannel";
 *   if (isValidMessage(message)) {
 *     const calls = prepareSeizeThrone(message);
 *     // Use calls with OnchainKit Transaction component
 *   }
 * };
 * ```
 */
export function useSeizeThrone(): UseSeizeThroneReturn {
  /**
   * Validates message against character limit
   */
  const isValidMessage = (message: string): boolean => {
    return message.length <= LIMITS.messageMaxLength;
  };

  /**
   * Prepares the transaction call for seizing the throne
   * Validates message length and returns properly typed call structure
   */
  const prepareSeizeThrone = (message: string): SeizeThroneCall[] => {
    // Validate message length
    if (!isValidMessage(message)) {
      throw new Error(`Message too long. Maximum ${LIMITS.messageMaxLength} characters allowed.`);
    }

    // Return transaction call array for OnchainKit Transaction component
    return [
      {
        to: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'seizeThrone',
        args: [message],
      },
    ];
  };

  return {
    prepareSeizeThrone,
    isValidMessage,
  };
}
