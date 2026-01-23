/**
 * UsurpButton Component
 * OnchainKit Transaction button for seizing the throne
 * Handles gasless transactions via Coinbase Paymaster
 */

'use client';

import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import { useSeizeThrone } from '@/hooks/useSeizeThrone';
import { useKingData } from '@/hooks/useKingData';
import { useFreeAttempts } from '@/hooks/useFreeAttempts';
import { CHAIN_IDS, TEXTS } from '@/lib/constants';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

/**
 * UsurpButton Props
 */
export interface UsurpButtonProps {
  /** King's message to set when seizing throne (max 30 chars) */
  message: string;
  /** Optional callback when transaction succeeds */
  onSuccess?: () => void;
  /** Optional callback when transaction fails */
  onError?: (error: Error) => void;
}

/**
 * UsurpButton Component
 * Displays a transaction button for seizing the throne
 * Automatically disables when:
 * - Throne is protected (3 sec cooldown)
 * - No free attempts remaining
 * - Message is invalid
 *
 * @example
 * ```tsx
 * const [message, setMessage] = useState('');
 *
 * <UsurpButton
 *   message={message}
 *   onSuccess={() => console.log('You are the new king!')}
 * />
 * ```
 */
export function UsurpButton({ message, onSuccess, onError }: UsurpButtonProps) {
  const { prepareSeizeThrone, isValidMessage } = useSeizeThrone();
  const { isProtected } = useKingData();
  const { remainingAttempts, useAttempt } = useFreeAttempts();

  // Prepare transaction calls
  const calls = (() => {
    try {
      return isValidMessage(message) ? prepareSeizeThrone(message) : [];
    } catch (error) {
      console.error('Failed to prepare transaction:', error);
      return [];
    }
  })();

  // Determine if button should be disabled
  const isDisabled =
    isProtected === true || // Throne is protected
    remainingAttempts === 0 || // No attempts left
    !isValidMessage(message) || // Invalid message
    calls.length === 0; // Failed to prepare transaction

  /**
   * Handle transaction status updates
   */
  const handleStatus = (status: LifecycleStatus) => {
    if (status.statusName === 'success') {
      // Decrement free attempts count
      useAttempt();

      // Call success callback
      onSuccess?.();
    }

    if (status.statusName === 'error') {
      console.error('Transaction failed:', status);
      onError?.(new Error('Transaction failed'));
    }
  };

  /**
   * Get disabled reason for display
   */
  const getDisabledReason = (): string | undefined => {
    if (isProtected) return TEXTS.protectionActive;
    if (remainingAttempts === 0) return 'No attempts remaining';
    if (!isValidMessage(message)) return 'Message too long';
    return undefined;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Transaction
        chainId={CHAIN_IDS.baseSepolia}
        isSponsored={true}
        calls={calls}
        onStatus={handleStatus}
      >
        <TransactionButton
          text={TEXTS.usurpButton}
          disabled={isDisabled}
          className="pixel-button-usurp w-full md:w-auto px-12 py-4 text-lg"
        />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>

      {/* Show disabled reason */}
      {isDisabled && getDisabledReason() && (
        <p className="text-sm text-red-400 pixel-text-glow-red text-center">
          {getDisabledReason()}
        </p>
      )}

      {/* Show remaining attempts */}
      {!isDisabled && remainingAttempts > 0 && (
        <p className="text-sm text-gray-400 text-center">
          {TEXTS.freeAttempts} {remainingAttempts}/{10}
        </p>
      )}
    </div>
  );
}
