"use client";

import { useState } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAccount } from "wagmi";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { leaderboard, isLoading } = useLeaderboard();
  const { address } = useAccount();

  return (
    <>
      {/* Leaderboard button */}
      <button
        onClick={() => setIsOpen(true)}
        className="font-pixel text-sm text-gray-400 hover:text-gold transition-colors"
      >
        Leaderboard
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-pixel-bg border-4 border-pixel-border rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-pixel text-xl text-gold">LEADERBOARD</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="font-pixel text-2xl text-gray-400 hover:text-white"
              >
                x
              </button>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-pixel-card rounded animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded" />
                      <div className="w-24 h-4 bg-gray-700 rounded" />
                    </div>
                    <div className="w-12 h-6 bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-pixel text-gray-400 text-sm">
                  No players yet!
                </p>
                <p className="font-pixel text-gray-500 text-xs mt-2">
                  Be the first to get a streak!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const isCurrentPlayer =
                    address?.toLowerCase() === entry.player.toLowerCase();
                  const medal =
                    index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

                  return (
                    <div
                      key={entry.player}
                      className={`
                        flex justify-between items-center p-3 rounded-lg
                        ${
                          isCurrentPlayer
                            ? "bg-gold/20 border-2 border-gold"
                            : "bg-pixel-card border border-pixel-border"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-pixel text-lg w-8 text-center">
                          {medal || `#${index + 1}`}
                        </span>
                        <span
                          className={`font-pixel text-sm ${
                            isCurrentPlayer ? "text-gold" : "text-gray-300"
                          }`}
                        >
                          {truncateAddress(entry.player)}
                          {isCurrentPlayer && (
                            <span className="ml-2 text-xs text-gold">(you)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-orange-500">🔥</span>
                        <span className="font-pixel text-lg text-white">
                          {Number(entry.maxStreak)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="font-pixel text-xs text-gray-500">
                Top 10 players by max streak
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
