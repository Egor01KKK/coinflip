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
    <div className="flex gap-4 justify-center py-4">
      {/* HEADS Button */}
      <button
        onClick={() => onFlip(true)}
        disabled={disabled}
        className={`
          relative px-8 py-4
          font-pixel text-lg
          bg-gradient-to-b from-gold to-gold-dark
          text-black
          border-4 border-yellow-600
          rounded-lg
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
        <span className="flex items-center gap-2">
          <span className="text-2xl">H</span>
          <span>HEADS</span>
        </span>
      </button>

      {/* TAILS Button */}
      <button
        onClick={() => onFlip(false)}
        disabled={disabled}
        className={`
          relative px-8 py-4
          font-pixel text-lg
          bg-gradient-to-b from-gray-400 to-gray-600
          text-black
          border-4 border-gray-500
          rounded-lg
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
        <span className="flex items-center gap-2">
          <span className="text-2xl">T</span>
          <span>TAILS</span>
        </span>
      </button>
    </div>
  );
}
