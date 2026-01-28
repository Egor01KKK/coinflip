"use client";

type CoinProps = {
  isFlipping: boolean;
  result: "heads" | "tails" | null;
  showResult: boolean;
};

export function Coin({ isFlipping, result, showResult }: CoinProps) {
  // Determine coin appearance
  const isHeads = showResult && result === "heads";
  const isTails = showResult && result === "tails";
  const isIdle = !isFlipping && !showResult;

  // Coin colors based on state
  const coinBg = isTails
    ? "bg-gradient-to-br from-gray-300 to-gray-500"
    : "bg-gradient-to-br from-gold to-gold-dark";

  const coinBorder = isTails
    ? "border-gray-400"
    : "border-yellow-600";

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Coin */}
      <div
        className={`
          relative w-32 h-32 sm:w-40 sm:h-40
          rounded-full
          flex items-center justify-center
          ${coinBg}
          border-4 ${coinBorder}
          shadow-xl
          ${isFlipping ? "animate-spin" : ""}
          ${!isFlipping && !isTails ? "animate-pulse-glow" : ""}
          transition-all duration-300
        `}
      >
        {/* Coin content */}
        {isFlipping ? (
          // Spinning state
          <span className="text-5xl sm:text-6xl font-bold text-yellow-900/70">?</span>
        ) : showResult && result ? (
          // Result state
          <div className="flex flex-col items-center animate-bounce-in">
            <span className="text-5xl sm:text-6xl">{result === "heads" ? "🪙" : "🔘"}</span>
          </div>
        ) : (
          // Idle state - show tap to play
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl">🪙</span>
          </div>
        )}
      </div>

      {/* Result label */}
      {showResult && result && !isFlipping && (
        <div className="mt-4 font-pixel text-xl text-center animate-bounce-in">
          <span className={result === "heads" ? "text-gold" : "text-gray-300"}>
            {result === "heads" ? "HEADS!" : "TAILS!"}
          </span>
        </div>
      )}

      {/* Idle hint */}
      {isIdle && (
        <div className="mt-4 font-pixel text-xs text-gray-500">
          Pick a side below
        </div>
      )}
    </div>
  );
}
