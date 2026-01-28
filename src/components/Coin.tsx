"use client";

type CoinProps = {
  isFlipping: boolean;
  result: "heads" | "tails" | null;
  showResult: boolean;
};

export function Coin({ isFlipping, result, showResult }: CoinProps) {
  // Determine what to show on the coin
  const getCoinContent = () => {
    if (isFlipping) {
      return (
        <div className="animate-spin">
          <span className="text-5xl">?</span>
        </div>
      );
    }

    if (showResult && result) {
      return (
        <div className="flex flex-col items-center animate-bounce-in">
          <span className="text-6xl font-bold">{result === "heads" ? "H" : "T"}</span>
          <span className="text-[10px] font-pixel mt-1 text-yellow-900">
            {result === "heads" ? "HEADS" : "TAILS"}
          </span>
        </div>
      );
    }

    return <span className="text-5xl">?</span>;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Coin */}
      <div
        className={`
          relative w-36 h-36
          rounded-full
          flex items-center justify-center
          ${result === "tails" && showResult
            ? "bg-gradient-to-br from-gray-300 to-gray-500 border-gray-400"
            : "bg-gradient-to-br from-gold to-gold-dark border-yellow-600"
          }
          border-4
          shadow-lg
          ${isFlipping ? "" : "animate-pulse-glow"}
          transition-all duration-300
        `}
      >
        {getCoinContent()}
      </div>

      {/* Result label below coin */}
      {showResult && result && !isFlipping && (
        <div className="mt-4 font-pixel text-xl text-center animate-bounce-in">
          <span className={result === "heads" ? "text-gold" : "text-gray-400"}>
            {result === "heads" ? "HEADS!" : "TAILS!"}
          </span>
        </div>
      )}
    </div>
  );
}
