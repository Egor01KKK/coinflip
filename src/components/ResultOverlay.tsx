"use client";

import { useEffect, useState } from "react";

type ResultOverlayProps = {
  won: boolean | null;
  streak: number;
  isNewRecord: boolean;
  onDismiss: () => void;
};

export function ResultOverlay({
  won,
  streak,
  isNewRecord,
  onDismiss,
}: ResultOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (won !== null) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [won, onDismiss]);

  if (!show || won === null) return null;

  return (
    <div
      className={`
        fixed inset-0 z-40 flex items-center justify-center
        pointer-events-none
        animate-bounce-in
      `}
    >
      <div
        className={`
          p-8 rounded-2xl text-center
          ${won ? "bg-pixel-success/20" : "bg-red-500/20"}
          border-4
          ${won ? "border-pixel-success" : "border-red-500"}
        `}
      >
        {/* Result icon */}
        <div className="text-6xl mb-4">{won ? "✓" : "✗"}</div>

        {/* Result text */}
        <div
          className={`
            font-pixel text-3xl mb-2
            ${won ? "text-pixel-success" : "text-red-500"}
          `}
        >
          {won ? "WIN!" : "LOSE!"}
        </div>

        {/* Streak info */}
        {won && streak > 0 && (
          <div className="font-pixel text-lg text-gold">
            🔥 {streak} streak!
          </div>
        )}

        {/* New record */}
        {isNewRecord && (
          <div className="font-pixel text-sm text-pixel-warning mt-2 animate-pulse">
            NEW RECORD!
          </div>
        )}
      </div>
    </div>
  );
}
