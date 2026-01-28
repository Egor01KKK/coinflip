"use client";

type FlipButtonsProps = {
  onFlip: (guessHeads: boolean) => void;
  disabled: boolean;
  isConnected: boolean;
};

export function FlipButtons({ onFlip, disabled, isConnected }: FlipButtonsProps) {
  if (!isConnected) {
    return (
      <div className="text-center py-4">
        <p className="font-pixel text-sm text-gray-400">
          Connect wallet to play
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {/* Instruction */}
      <p className="font-pixel text-xs text-gray-400 text-center mb-4">
        Guess the coin flip:
      </p>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        {/* HEADS Button - Gold coin */}
        <button
          onClick={() => onFlip(true)}
          disabled={disabled}
          className={`
            flex-1 px-4 py-5
            font-pixel text-base
            bg-gradient-to-b from-gold to-gold-dark
            text-black
            border-4 border-yellow-600
            rounded-xl
            shadow-[0_6px_0_0_#8B6914]
            hover:shadow-[0_4px_0_0_#8B6914]
            hover:translate-y-[2px]
            active:shadow-none
            active:translate-y-[6px]
            transition-all duration-100
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:translate-y-0
            disabled:hover:shadow-[0_6px_0_0_#8B6914]
          `}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🪙</span>
            <span className="text-xs">HEADS</span>
          </div>
        </button>

        {/* TAILS Button - Silver coin */}
        <button
          onClick={() => onFlip(false)}
          disabled={disabled}
          className={`
            flex-1 px-4 py-5
            font-pixel text-base
            bg-gradient-to-b from-gray-300 to-gray-500
            text-black
            border-4 border-gray-400
            rounded-xl
            shadow-[0_6px_0_0_#4a5568]
            hover:shadow-[0_4px_0_0_#4a5568]
            hover:translate-y-[2px]
            active:shadow-none
            active:translate-y-[6px]
            transition-all duration-100
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:translate-y-0
            disabled:hover:shadow-[0_6px_0_0_#4a5568]
          `}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🔘</span>
            <span className="text-xs">TAILS</span>
          </div>
        </button>
      </div>
    </div>
  );
}
