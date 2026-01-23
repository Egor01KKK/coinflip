/**
 * ShareButton Component
 * Opens Warpcast compose dialog with pre-filled text for Farcaster sharing
 * Allows users to share their king status and challenge friends
 */

'use client';

import { TEXTS, WARPCAST } from '@/lib/constants';

/**
 * ShareButton Props
 */
export interface ShareButtonProps {
  /** Reign time in seconds to display in share message */
  reignTime?: number;
  /** Optional custom message to share */
  customMessage?: string;
  /** Optional className for styling */
  className?: string;
  /** Optional callback when share button is clicked */
  onClick?: () => void;
}

/**
 * ShareButton Component
 * Opens Warpcast (Farcaster) compose UI with pre-filled text about the player's king status
 *
 * @example
 * ```tsx
 * // Share current reign status
 * <ShareButton reignTime={42} />
 *
 * // Share with custom message
 * <ShareButton customMessage="Check out King of the Base!" />
 * ```
 */
export function ShareButton({
  reignTime = 0,
  customMessage,
  className,
  onClick,
}: ShareButtonProps) {
  /**
   * Opens Warpcast compose dialog with pre-filled text and embed
   * Opens https://warpcast.com/~/compose with pre-filled parameters
   */
  const handleShare = () => {
    // Use custom message or generate from template
    const text = customMessage || TEXTS.shareTextTemplate(reignTime);
    const url = WARPCAST.appUrl;

    // Build Warpcast compose URL with query parameters
    // text: pre-filled message text
    // embeds[]: embedded URL (app link)
    const warpcastUrl = `${WARPCAST.composeUrl}?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`;

    // Open Warpcast in new tab
    window.open(warpcastUrl, '_blank', 'noopener,noreferrer');

    // Call optional callback
    onClick?.();
  };

  return (
    <button
      onClick={handleShare}
      className={
        className ||
        'pixel-button pixel-button-gold w-full md:w-auto px-8 py-3 text-sm hover:scale-105 transition-transform'
      }
      type="button"
      aria-label="Share on Farcaster"
    >
      {TEXTS.shareButton}
    </button>
  );
}
