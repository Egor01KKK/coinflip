"use client";

import { useState, useCallback } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { Coin } from "@/components/Coin";
import { FlipButtons } from "@/components/FlipButtons";
import { Stats } from "@/components/Stats";
import { Leaderboard } from "@/components/Leaderboard";
import { ShareButton } from "@/components/ShareButton";
import { ResultOverlay } from "@/components/ResultOverlay";
import { ConnectButton } from "@/components/ConnectButton";
import { LoginScreen } from "@/components/LoginScreen";
import { useFlip } from "@/hooks/useFlip";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { coinFlipContract } from "@/lib/contract";

export default function Home() {
  const { isConnected } = useAccount();
  const { flip, isFlipping, setResult, resetFlip, error, hash } = useFlip();
  const { stats, refetch: refetchStats } = usePlayerStats();

  const [coinResult, setCoinResult] = useState<"heads" | "tails" | null>(null);
  const [lastFlipResult, setLastFlipResult] = useState<{
    won: boolean;
    streak: number;
    isNewRecord: boolean;
  } | null>(null);
  const [showStats, setShowStats] = useState(false);

  // Watch for FlipResult events
  useWatchContractEvent({
    ...coinFlipContract,
    eventName: "FlipResult",
    onLogs(logs) {
      const log = logs[0];
      if (log && log.args) {
        const { guessedHeads, wasHeads, won, currentStreak, maxStreak } = log.args;

        // Update coin result
        setCoinResult(wasHeads ? "heads" : "tails");

        // Update flip result
        setResult({
          won: won ?? false,
          wasHeads: wasHeads ?? false,
          guessedHeads: guessedHeads ?? false,
        });

        // Check if new record
        const prevMaxStreak = stats?.maxStreak ?? 0n;
        const isNewRecord = maxStreak !== undefined && maxStreak > prevMaxStreak;

        setLastFlipResult({
          won: won ?? false,
          streak: Number(currentStreak ?? 0),
          isNewRecord,
        });

        // Refetch stats
        refetchStats();
      }
    },
  });

  // Handle flip action
  const handleFlip = useCallback(
    async (guessHeads: boolean) => {
      setCoinResult(null);
      setLastFlipResult(null);
      await flip(guessHeads);
    },
    [flip]
  );

  // Handle result overlay dismiss
  const handleDismissResult = useCallback(() => {
    setLastFlipResult(null);
    resetFlip();
  }, [resetFlip]);

  // Show login screen if not connected
  if (!isConnected) {
    return <LoginScreen />;
  }

  // Game screen
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-pixel-border">
        <h1 className="font-pixel text-lg text-gold">COINFLIP</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="font-pixel text-xs text-gray-400 hover:text-gold transition-colors"
          >
            Stats
          </button>
          <ConnectButton />
        </div>
      </header>

      {/* Stats panel */}
      {showStats && (
        <div className="border-b border-pixel-border bg-pixel-card/50">
          <Stats showDetailed />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Quick stats */}
        <Stats />

        {/* Coin */}
        <div className="my-8">
          <Coin
            isFlipping={isFlipping}
            result={coinResult}
            onAnimationEnd={() => {}}
          />
        </div>

        {/* Flip buttons */}
        <FlipButtons
          onFlip={handleFlip}
          disabled={isFlipping}
          isConnected={true}
        />

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="font-pixel text-xs text-red-400">
              {error.message.includes("Wait for next block")
                ? "Wait for next block to flip again!"
                : "Transaction failed. Try again!"}
            </p>
          </div>
        )}

        {/* Transaction hash */}
        {hash && (
          <div className="mt-4">
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-xs text-blue-400 hover:text-blue-300 underline"
            >
              View transaction
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-pixel-border">
        <div className="flex justify-center gap-6">
          <Leaderboard />
          <ShareButton />
        </div>
        <div className="text-center mt-4">
          <p className="font-pixel text-[10px] text-gray-600">
            Built on Base
          </p>
        </div>
      </footer>

      {/* Result overlay */}
      {lastFlipResult && (
        <ResultOverlay
          won={lastFlipResult.won}
          streak={lastFlipResult.streak}
          isNewRecord={lastFlipResult.isNewRecord}
          onDismiss={handleDismissResult}
        />
      )}
    </main>
  );
}
