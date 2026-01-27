"use client";

import { useState } from "react";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { SHARE_TEMPLATES, APP_URL } from "@/lib/constants";

type SharePlatform = "twitter" | "farcaster" | "copy";

export function ShareButton() {
  const { stats } = usePlayerStats();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const maxStreak = stats ? Number(stats.maxStreak) : 0;
  const wins = stats ? Number(stats.wins) : 0;
  const totalFlips = stats ? Number(stats.totalFlips) : 0;

  const getShareText = () => {
    if (maxStreak >= 5) {
      return SHARE_TEMPLATES.newRecord(maxStreak);
    }
    if (maxStreak > 0) {
      return SHARE_TEMPLATES.streak(maxStreak);
    }
    if (totalFlips > 0) {
      return SHARE_TEMPLATES.win(wins, totalFlips);
    }
    return "I'm playing CoinFlip on Base! Flip coins and build your streak!";
  };

  const shareText = getShareText();
  const shareUrl = APP_URL;

  const handleShare = async (platform: SharePlatform) => {
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;

      case "farcaster":
        // Farcaster compose cast URL
        window.open(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(
            `${shareText}\n\n${shareUrl}`
          )}`,
          "_blank"
        );
        break;

      case "copy":
        try {
          await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
        break;
    }

    setIsOpen(false);
  };

  return (
    <>
      {/* Share button */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={totalFlips === 0}
        className="font-pixel text-sm text-gray-400 hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Share
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-pixel-bg border-4 border-pixel-border rounded-lg p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-pixel text-lg text-gold">SHARE</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="font-pixel text-2xl text-gray-400 hover:text-white"
              >
                x
              </button>
            </div>

            {/* Preview */}
            <div className="bg-pixel-card p-4 rounded-lg border border-pixel-border mb-6">
              <p className="font-pixel text-xs text-gray-300 leading-relaxed">
                {shareText}
              </p>
            </div>

            {/* Share options */}
            <div className="space-y-3">
              {/* Twitter/X */}
              <button
                onClick={() => handleShare("twitter")}
                className="w-full flex items-center gap-3 p-3 bg-pixel-card hover:bg-pixel-border rounded-lg border border-pixel-border transition-colors"
              >
                <span className="text-xl">𝕏</span>
                <span className="font-pixel text-sm text-gray-300">
                  Share on X
                </span>
              </button>

              {/* Farcaster */}
              <button
                onClick={() => handleShare("farcaster")}
                className="w-full flex items-center gap-3 p-3 bg-pixel-card hover:bg-pixel-border rounded-lg border border-pixel-border transition-colors"
              >
                <span className="text-xl">🟣</span>
                <span className="font-pixel text-sm text-gray-300">
                  Share on Farcaster
                </span>
              </button>

              {/* Copy link */}
              <button
                onClick={() => handleShare("copy")}
                className="w-full flex items-center gap-3 p-3 bg-pixel-card hover:bg-pixel-border rounded-lg border border-pixel-border transition-colors"
              >
                <span className="text-xl">{copied ? "✓" : "📋"}</span>
                <span className="font-pixel text-sm text-gray-300">
                  {copied ? "Copied!" : "Copy to clipboard"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
