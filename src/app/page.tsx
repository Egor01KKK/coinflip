"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { Coin } from "@/components/Coin";
import { FlipButtons } from "@/components/FlipButtons";
import { Stats } from "@/components/Stats";
import { Leaderboard } from "@/components/Leaderboard";
import { ShareButton } from "@/components/ShareButton";
import { ResultOverlay } from "@/components/ResultOverlay";
import { ConnectButton } from "@/components/ConnectButton";
import { LoginScreen } from "@/components/LoginScreen";
import { useFlip, type FlipResult } from "@/hooks/useFlip";
import { usePlayerStats } from "@/hooks/usePlayerStats";

export default function Home() {
  const { isConnected } = useAccount();
  const { flip, isFlipping, isConfirmed, processResult, resetFlip, error, hash } = useFlip();
  const { stats, refetch: refetchStats } = usePlayerStats();

  const [coinResult, setCoinResult] = useState<"heads" | "tails" | null>(null);
  const [showCoinResult, setShowCoinResult] = useState(false);
  const [flipResult, setFlipResult] = useState<FlipResult | null>(null);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [prevMaxStreak, setPrevMaxStreak] = useState(0);

  // Process result when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      processResult().then((result) => {
        if (result) {
          // Show coin result
          setCoinResult(result.wasHeads ? "heads" : "tails");
          setShowCoinResult(true);
          setFlipResult(result);

          // Show result overlay after short delay
          setTimeout(() => {
            setShowResultOverlay(true);
            refetchStats();
          }, 500);
        }
      });
    }
  }, [isConfirmed, processResult, refetchStats]);

  // Track previous max streak for "new record" detection
  useEffect(() => {
    if (stats) {
      setPrevMaxStreak(Number(stats.maxStreak));
    }
  }, [stats]);

  // Handle flip action
  const handleFlip = useCallback(
    async (guessHeads: boolean) => {
      // Reset previous state
      setCoinResult(null);
      setShowCoinResult(false);
      setFlipResult(null);
      setShowResultOverlay(false);

      // Store current max streak before flip
      if (stats) {
        setPrevMaxStreak(Number(stats.maxStreak));
      }

      // Execute flip
      await flip(guessHeads);
    },
    [flip, stats]
  );

  // Close result overlay
  const handleCloseResult = useCallback(() => {
    setShowResultOverlay(false);
    resetFlip();
  }, [resetFlip]);

  // Show login screen if not connected
  if (!isConnected) {
    return <LoginScreen />;
  }

  const isNewRecord = flipResult ? flipResult.maxStreak > prevMaxStreak : false;

  // Game screen
  return (
    <main className="min-h-screen flex flex-col bg-pixel-bg">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-pixel-border">
        <h1 className="font-pixel text-lg text-gold">COINFLIP</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="font-pixel text-xs text-gray-400 hover:text-gold transition-colors"
          >
            {showStats ? "Hide" : "Stats"}
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
            showResult={showCoinResult}
          />
        </div>

        {/* Status text */}
        <div className="h-8 mb-4">
          {isFlipping && (
            <p className="font-pixel text-sm text-gray-400 animate-pulse">
              Flipping...
            </p>
          )}
        </div>

        {/* Flip buttons */}
        <FlipButtons
          onFlip={handleFlip}
          disabled={isFlipping}
          isConnected={true}
        />

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg max-w-xs">
            <p className="font-pixel text-xs text-red-400 text-center">
              {error.message.includes("Wait for next block")
                ? "Wait a moment before flipping again!"
                : error.message.includes("User rejected")
                ? "Transaction cancelled"
                : "Error! Try again."}
            </p>
          </div>
        )}

        {/* Transaction link */}
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
      {showResultOverlay && flipResult && (
        <ResultOverlay
          won={flipResult.won}
          streak={flipResult.currentStreak}
          isNewRecord={isNewRecord}
          onClose={handleCloseResult}
        />
      )}
    </main>
  );
}
