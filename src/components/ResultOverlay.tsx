"use client";

type ResultOverlayProps = {
  won: boolean;
  streak: number;
  isNewRecord: boolean;
  onClose: () => void;
};

export function ResultOverlay({
  won,
  streak,
  isNewRecord,
  onClose,
}: ResultOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className={`
          p-8 rounded-2xl text-center
          ${won ? "bg-green-900/90 border-4 border-pixel-success" : "bg-red-900/90 border-4 border-red-500"}
          animate-bounce-in
          max-w-sm w-full
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Big icon */}
        <div className="text-7xl mb-4">
          {won ? "✓" : "✗"}
        </div>

        {/* Result text */}
        <div
          className={`
            font-pixel text-4xl mb-4
            ${won ? "text-pixel-success" : "text-red-400"}
          `}
        >
          {won ? "WIN!" : "LOSE!"}
        </div>

        {/* Streak info */}
        {won && streak > 0 && (
          <div className="font-pixel text-xl text-gold mb-2">
            🔥 {streak} streak!
          </div>
        )}

        {/* New record */}
        {isNewRecord && (
          <div className="font-pixel text-lg text-pixel-warning animate-pulse mb-4">
            ⭐ NEW RECORD! ⭐
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 px-6 py-3 bg-pixel-card border-2 border-pixel-border rounded-lg font-pixel text-sm text-white hover:border-gold transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
