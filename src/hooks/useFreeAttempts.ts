/**
 * useFreeAttempts Hook
 * Tracks daily free attempts using localStorage with automatic daily reset
 * Manages the 10 free attempts per day limit for throne capture
 */

'use client';

import { useState, useEffect } from 'react';
import { LIMITS, STORAGE_KEYS } from '@/lib/constants';

/**
 * Interface for free attempts tracking data stored in localStorage
 */
interface FreeAttemptsData {
  count: number;
  lastAttemptDate: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Hook return type with attempt count and management functions
 */
export interface UseFreeAttemptsReturn {
  /**
   * Number of remaining free attempts today
   */
  remainingAttempts: number;

  /**
   * Total daily limit of free attempts
   */
  dailyLimit: number;

  /**
   * Whether user has free attempts remaining
   */
  hasAttemptsLeft: boolean;

  /**
   * Use one free attempt (decrements counter)
   * Only call this after a successful transaction
   * @returns true if attempt was used, false if no attempts left
   */
  useAttempt: () => boolean;

  /**
   * Get formatted string for UI display
   * @returns String like "8/10" showing remaining/total
   */
  getDisplayString: () => string;

  /**
   * Force reset attempts to daily limit (for testing/admin)
   */
  resetAttempts: () => void;
}

/**
 * Custom hook to track and manage daily free attempts with localStorage persistence
 * Automatically resets count at midnight (daily reset)
 *
 * @returns Object with attempt count and management functions
 *
 * @example
 * ```tsx
 * const { remainingAttempts, hasAttemptsLeft, useAttempt } = useFreeAttempts();
 *
 * // Check before allowing action
 * if (hasAttemptsLeft) {
 *   // Show usurp button
 * }
 *
 * // After successful transaction
 * const onSuccess = () => {
 *   useAttempt();
 * };
 * ```
 */
export function useFreeAttempts(): UseFreeAttemptsReturn {
  const [remainingAttempts, setRemainingAttempts] = useState<number>(LIMITS.dailyFreeAttempts);

  /**
   * Get today's date as ISO string (YYYY-MM-DD) for comparison
   */
  const getTodayDate = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  /**
   * Load attempts data from localStorage
   * Returns default data if not found or if data is from previous day
   */
  const loadAttemptsData = (): FreeAttemptsData => {
    try {
      const storedCount = localStorage.getItem(STORAGE_KEYS.freeAttempts);
      const storedDate = localStorage.getItem(STORAGE_KEYS.lastAttemptDate);

      const today = getTodayDate();

      // If no data or date is different (new day), reset to full limit
      if (!storedCount || !storedDate || storedDate !== today) {
        return {
          count: LIMITS.dailyFreeAttempts,
          lastAttemptDate: today,
        };
      }

      // Parse stored count
      const count = parseInt(storedCount, 10);

      // Validate count is a valid number
      if (isNaN(count) || count < 0 || count > LIMITS.dailyFreeAttempts) {
        return {
          count: LIMITS.dailyFreeAttempts,
          lastAttemptDate: today,
        };
      }

      return {
        count,
        lastAttemptDate: storedDate,
      };
    } catch (error) {
      // If localStorage is not available or error occurs, return default
      return {
        count: LIMITS.dailyFreeAttempts,
        lastAttemptDate: getTodayDate(),
      };
    }
  };

  /**
   * Save attempts data to localStorage
   */
  const saveAttemptsData = (data: FreeAttemptsData): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.freeAttempts, data.count.toString());
      localStorage.setItem(STORAGE_KEYS.lastAttemptDate, data.lastAttemptDate);
    } catch (error) {
      // Fail silently if localStorage is not available
      // This ensures the app continues to work even if storage fails
    }
  };

  /**
   * Initialize attempts count from localStorage on mount
   */
  useEffect(() => {
    const data = loadAttemptsData();
    setRemainingAttempts(data.count);
    // Save to ensure date is updated if it was a new day
    saveAttemptsData(data);
  }, []);

  /**
   * Use one free attempt
   */
  const useAttempt = (): boolean => {
    if (remainingAttempts <= 0) {
      return false;
    }

    const newCount = remainingAttempts - 1;
    const data: FreeAttemptsData = {
      count: newCount,
      lastAttemptDate: getTodayDate(),
    };

    setRemainingAttempts(newCount);
    saveAttemptsData(data);

    return true;
  };

  /**
   * Get formatted display string for UI
   */
  const getDisplayString = (): string => {
    return `${remainingAttempts}/${LIMITS.dailyFreeAttempts}`;
  };

  /**
   * Reset attempts to daily limit
   */
  const resetAttempts = (): void => {
    const data: FreeAttemptsData = {
      count: LIMITS.dailyFreeAttempts,
      lastAttemptDate: getTodayDate(),
    };

    setRemainingAttempts(LIMITS.dailyFreeAttempts);
    saveAttemptsData(data);
  };

  return {
    remainingAttempts,
    dailyLimit: LIMITS.dailyFreeAttempts,
    hasAttemptsLeft: remainingAttempts > 0,
    useAttempt,
    getDisplayString,
    resetAttempts,
  };
}
