"use client";

import { useEffect, useState } from "react";

type CoinProps = {
  isFlipping: boolean;
  result: "heads" | "tails" | null;
  onAnimationEnd?: () => void;
};

export function Coin({ isFlipping, result, onAnimationEnd }: CoinProps) {
  const [showResult, setShowResult] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isFlipping) {
      setShowResult(false);
      setAnimationClass("animate-coin-spin");
    }
  }, [isFlipping]);

  useEffect(() => {
    if (result && !isFlipping) {
      // Start flip animation
      setAnimationClass("animate-coin-flip");

      // Show result after animation
      const timer = setTimeout(() => {
        setShowResult(true);
        setAnimationClass("animate-bounce-in");
        onAnimationEnd?.();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [result, isFlipping, onAnimationEnd]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Coin container */}
      <div
        className={`
          relative w-32 h-32 md:w-40 md:h-40
          ${animationClass}
          transition-transform duration-300
        `}
        style={{ perspective: "1000px" }}
      >
        {/* Coin face */}
        <div
          className={`
            absolute inset-0 rounded-full
            flex items-center justify-center
            text-6xl md:text-7xl
            ${
              showResult && result === "heads"
                ? "bg-gradient-to-br from-gold to-gold-dark"
                : showResult && result === "tails"
                ? "bg-gradient-to-br from-gray-400 to-gray-600"
                : "bg-gradient-to-br from-gold to-gold-dark"
            }
            shadow-lg
            border-4 border-yellow-600
            animate-pulse-glow
          `}
        >
          {/* Coin content */}
          <div className="flex flex-col items-center">
            {isFlipping ? (
              <span className="animate-pulse">?</span>
            ) : showResult && result ? (
              <>
                <span>{result === "heads" ? "H" : "T"}</span>
                <span className="text-xs font-pixel mt-1 text-yellow-900">
                  {result.toUpperCase()}
                </span>
              </>
            ) : (
              <span className="text-4xl">?</span>
            )}
          </div>
        </div>

        {/* Coin edge effect */}
        <div
          className={`
            absolute inset-1 rounded-full
            border-2 border-yellow-500/30
            pointer-events-none
          `}
        />
      </div>

      {/* Result text */}
      {showResult && result && (
        <div
          className={`
            mt-6 font-pixel text-lg
            ${result === "heads" ? "text-gold" : "text-gray-400"}
            animate-bounce-in
          `}
        >
          {result === "heads" ? "HEADS!" : "TAILS!"}
        </div>
      )}
    </div>
  );
}
