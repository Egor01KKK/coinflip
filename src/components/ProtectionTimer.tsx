/**
 * ProtectionTimer Component
 * Displays a countdown timer for throne protection period (3 seconds)
 * Shows remaining time when throne is protected after capture
 */

'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useEffect, useState } from 'react';

/**
 * ProtectionTimer Props
 */
export interface ProtectionTimerProps {
  /** Optional callback when protection expires */
  onExpired?: () => void;
  /** Optional custom className */
  className?: string;
}

/**
 * ProtectionTimer Component
 * Displays real-time countdown of remaining protection time
 *
 * Features:
 * - Reads protectionEndTime from contract
 * - Live countdown that updates every 100ms for smooth animation
 * - Shows only when protection is active
 * - Visual indicators with neon glow effects
 *
 * @example
 * ```tsx
 * <ProtectionTimer onExpired={() => console.log('Protection expired!')} />
 * ```
 */
export function ProtectionTimer({ onExpired, className = '' }: ProtectionTimerProps) {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Read protectionEndTime from contract
  const { data: protectionEndTime, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'protectionEndTime',
  });

  // Update remaining time every 100ms for smooth countdown
  useEffect(() => {
    const updateTimer = () => {
      if (!protectionEndTime) {
        setIsVisible(false);
        return;
      }

      const endTime = Number(protectionEndTime);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const remaining = endTime - currentTime;

      if (remaining > 0) {
        setRemainingTime(remaining);
        setIsVisible(true);
      } else {
        setRemainingTime(0);
        setIsVisible(false);

        // Call onExpired callback if protection just ended
        if (isVisible) {
          onExpired?.();
        }
      }
    };

    // Initial update
    updateTimer();

    // Update every 100ms for smooth countdown
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [protectionEndTime, onExpired, isVisible]);

  // Refetch protectionEndTime every second
  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(refetchInterval);
  }, [refetch]);

  // Don't render if protection is not active
  if (!isVisible || remainingTime <= 0) {
    return null;
  }

  /**
   * Format remaining time to display (e.g., "2.5s")
   */
  const formatTime = (seconds: number): string => {
    if (seconds >= 1) {
      return `${seconds.toFixed(1)}s`;
    }
    return `${(seconds * 1000).toFixed(0)}ms`;
  };

  /**
   * Get color class based on remaining time
   * - Green: 3-2s
   * - Yellow: 2-1s
   * - Red: <1s
   */
  const getColorClass = (): string => {
    if (remainingTime >= 2) {
      return 'text-accent-neon pixel-text-glow-green';
    } else if (remainingTime >= 1) {
      return 'text-yellow-400 pixel-text-glow-yellow';
    } else {
      return 'text-accent-red pixel-text-glow-red';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Shield icon */}
      <div className="text-2xl animate-pulse">
        🛡️
      </div>

      {/* Timer display */}
      <div className="flex flex-col gap-1">
        <div className={`
          font-['Press_Start_2P'] text-sm
          ${getColorClass()}
          transition-colors duration-200
        `}>
          {formatTime(remainingTime)}
        </div>
        <div className="text-xs text-gray-400">
          Protected
        </div>
      </div>

      {/* Visual progress indicator */}
      <div className="flex-1 max-w-[100px] h-2 bg-gray-800 border border-accent-neon/30 overflow-hidden">
        <div
          className={`h-full ${
            remainingTime >= 2 ? 'bg-accent-neon' : remainingTime >= 1 ? 'bg-yellow-400' : 'bg-accent-red'
          } transition-all duration-100`}
          style={{
            width: `${(remainingTime / 3) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
