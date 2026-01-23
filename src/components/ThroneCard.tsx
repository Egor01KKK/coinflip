/**
 * ThroneCard Component
 * Displays the current king's information including avatar, address, reign duration, and message
 * Uses pixel-art styling with gold accents and neon effects
 */

'use client';

import { useKingData } from '@/hooks/useKingData';
import { TEXTS } from '@/lib/constants';
import { useEffect, useState } from 'react';

/**
 * Format reign duration from bigint seconds to human-readable time
 * @param seconds - Duration in seconds as bigint
 * @returns Formatted string (e.g., "00:42" or "01:23:45")
 */
function formatReignDuration(seconds: bigint | undefined): string {
  if (!seconds) return '00:00';

  const totalSeconds = Number(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Truncate Ethereum address for display
 * @param address - Full Ethereum address
 * @returns Truncated address (e.g., "0x1234...5678")
 */
function truncateAddress(address: string | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generate a simple deterministic avatar emoji based on address
 * @param address - Ethereum address
 * @returns Emoji character
 */
function getAvatarEmoji(address: string | undefined): string {
  if (!address) return '👤';

  const avatars = ['👑', '🤴', '👸', '🦁', '🐉', '⚔️', '🛡️', '💎', '🔥', '⚡'];
  const index = parseInt(address.slice(2, 4), 16) % avatars.length;
  return avatars[index];
}

export function ThroneCard() {
  const { king, reignDuration, message, isProtected } = useKingData();
  const [animatedDuration, setAnimatedDuration] = useState<bigint>(BigInt(0));

  // Update animated duration every second for smooth countdown
  useEffect(() => {
    if (reignDuration !== undefined) {
      setAnimatedDuration(reignDuration);
    }

    const interval = setInterval(() => {
      if (reignDuration !== undefined) {
        // Increment by 1 second for live update effect
        setAnimatedDuration((prev) => prev + BigInt(1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reignDuration]);

  // Empty throne state
  if (!king || king === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="pixel-throne-card pixel-card-corners">
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="pixel-avatar pixel-avatar-gold">
            <span className="text-4xl">👑</span>
          </div>
          <p className="pixel-username text-center">{TEXTS.noKing}</p>
          <p className="text-sm text-gray-400 text-center px-4">
            Be the first to claim the throne!
          </p>
        </div>
      </div>
    );
  }

  // Active king state
  return (
    <div className="pixel-throne-card pixel-card-corners relative">
      {/* Protection indicator */}
      {isProtected && (
        <div className="absolute top-4 right-4">
          <div className="pixel-status pixel-status-protected">
            <span className="pixel-dot" />
            🛡️ Protected
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 py-4">
        {/* King Avatar */}
        <div className="pixel-avatar pixel-avatar-gold" style={{ width: '80px', height: '80px', fontSize: '48px' }}>
          {getAvatarEmoji(king)}
        </div>

        {/* King Address */}
        <div className="flex flex-col items-center gap-2">
          <p className="pixel-username text-center break-all px-4">
            {truncateAddress(king)}
          </p>

          {/* Reign Duration Timer */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{TEXTS.reigningFor}</span>
            <span className="pixel-timer text-sm">
              {formatReignDuration(animatedDuration)}
            </span>
          </div>
        </div>

        {/* Pixel Divider */}
        <div className="pixel-divider w-full" />

        {/* King's Message */}
        <div className="w-full">
          {message && message.length > 0 ? (
            <div className="pixel-message-box">
              <p className="font-['Press_Start_2P'] text-xs leading-relaxed">
                "{message}"
              </p>
            </div>
          ) : (
            <div className="pixel-message-box pixel-message-empty">
              <p className="text-xs">No message from the king</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
