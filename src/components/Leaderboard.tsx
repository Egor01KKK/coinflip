/**
 * Leaderboard Component
 * Displays the top 3 players with their total reign times
 * Uses pixel-art styling with podium ordering (2nd, 1st, 3rd)
 */

'use client';

import { useLeaderboardData } from '@/hooks/useLeaderboardData';
import { TEXTS } from '@/lib/constants';

/**
 * Format reign time from bigint seconds to human-readable duration
 * @param seconds - Total reign time in seconds as bigint
 * @returns Formatted string (e.g., "42s", "5m 23s", "2h 15m")
 */
function formatLeaderboardTime(seconds: bigint): string {
  if (!seconds) return '0s';

  const totalSeconds = Number(seconds);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}m ${secs}s`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Truncate Ethereum address for display
 * @param address - Full Ethereum address
 * @returns Truncated address (e.g., "0x12...34")
 */
function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-2)}`;
}

/**
 * Generate a deterministic avatar emoji based on address
 * Same algorithm as ThroneCard for consistency
 * @param address - Ethereum address
 * @returns Emoji character
 */
function getAvatarEmoji(address: string): string {
  const avatars = ['👑', '🤴', '👸', '🦁', '🐉', '⚔️', '🛡️', '💎', '🔥', '⚡'];
  const index = parseInt(address.slice(2, 4), 16) % avatars.length;
  return avatars[index];
}

/**
 * Get medal emoji based on rank
 * @param rank - Player rank (1-3)
 * @returns Medal emoji
 */
function getMedalEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '🏅';
  }
}

/**
 * Leaderboard component showing top 3 players in podium style
 */
export function Leaderboard() {
  const leaderboard = useLeaderboardData();

  // Empty state - no players yet
  if (leaderboard.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-center text-lg mb-4 pixel-text-glow">
          {TEXTS.topLeaders}
        </h2>
        <div className="pixel-card pixel-card-corners p-4">
          <p className="text-center text-sm text-gray-400">
            No players yet. Be the first to seize the throne!
          </p>
        </div>
      </div>
    );
  }

  // Pad leaderboard to ensure we have 3 slots (with placeholders if needed)
  const displayEntries = [...leaderboard];
  while (displayEntries.length < 3) {
    displayEntries.push({
      address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      totalReignTime: BigInt(0),
      rank: displayEntries.length + 1,
    });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-center text-lg mb-4 pixel-text-glow">
        {TEXTS.topLeaders}
      </h2>

      {/* Leaderboard in podium style: 2nd, 1st, 3rd */}
      <div className="pixel-leaderboard">
        {displayEntries.map((entry) => {
          const isEmpty = entry.totalReignTime === BigInt(0);

          return (
            <div
              key={`${entry.rank}-${entry.address}`}
              className="pixel-leaderboard-item"
            >
              {/* Crown for 1st place */}
              {entry.rank === 1 && !isEmpty && (
                <div className="pixel-leaderboard-crown">👑</div>
              )}

              {/* Medal */}
              <div className="text-2xl">{getMedalEmoji(entry.rank)}</div>

              {/* Avatar */}
              <div
                className={`pixel-avatar ${
                  entry.rank === 1
                    ? 'pixel-avatar-gold'
                    : 'pixel-avatar-neon'
                }`}
                style={{
                  width: entry.rank === 1 ? '56px' : '48px',
                  height: entry.rank === 1 ? '56px' : '48px',
                  fontSize: entry.rank === 1 ? '32px' : '28px',
                }}
              >
                {isEmpty ? '❓' : getAvatarEmoji(entry.address)}
              </div>

              {/* Address */}
              <p className="pixel-username text-xs">
                {isEmpty ? '---' : truncateAddress(entry.address)}
              </p>

              {/* Reign Time */}
              <div className="pixel-counter text-xs">
                {isEmpty ? '0s' : formatLeaderboardTime(entry.totalReignTime)}
              </div>

              {/* Rank */}
              <div className="text-xs text-gray-500">#{entry.rank}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
