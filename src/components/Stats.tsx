"use client";

import { usePlayerStats } from "@/hooks/usePlayerStats";

type StatsProps = {
  showDetailed?: boolean;
};

export function Stats({ showDetailed = false }: StatsProps) {
  const { stats, isLoading } = usePlayerStats();

  if (isLoading) {
    return (
      <div className="flex justify-center gap-8 py-2 animate-pulse">
        <div className="h-10 w-20 bg-gray-700/50 rounded" />
        <div className="h-10 w-20 bg-gray-700/50 rounded" />
      </div>
    );
  }

  const currentStreak = stats ? Number(stats.currentStreak) : 0;
  const maxStreak = stats ? Number(stats.maxStreak) : 0;
  const wins = stats ? Number(stats.wins) : 0;
  const losses = stats ? Number(stats.losses) : 0;
  const totalFlips = stats ? Number(stats.totalFlips) : 0;
  const winRate = totalFlips > 0 ? ((wins / totalFlips) * 100).toFixed(0) : "0";

  // Simple view - just streak counters
  if (!showDetailed) {
    return (
      <div className="flex justify-center gap-8 py-2">
        <div className="text-center">
          <div className="font-pixel text-2xl text-gold flex items-center justify-center gap-1">
            <span className="text-orange-500">🔥</span>
            <span>{currentStreak}</span>
          </div>
          <div className="font-pixel text-[10px] text-gray-500">STREAK</div>
        </div>
        <div className="text-center">
          <div className="font-pixel text-2xl text-pixel-accent">
            {maxStreak}
          </div>
          <div className="font-pixel text-[10px] text-gray-500">BEST</div>
        </div>
      </div>
    );
  }

  // Detailed view
  return (
    <div className="py-4 px-4">
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        <div className="text-center p-3 bg-pixel-card rounded-lg border border-pixel-border">
          <div className="font-pixel text-xl text-pixel-success">{wins}</div>
          <div className="font-pixel text-[10px] text-gray-500">WINS</div>
        </div>
        <div className="text-center p-3 bg-pixel-card rounded-lg border border-pixel-border">
          <div className="font-pixel text-xl text-red-400">{losses}</div>
          <div className="font-pixel text-[10px] text-gray-500">LOSSES</div>
        </div>
        <div className="text-center p-3 bg-pixel-card rounded-lg border border-pixel-border">
          <div className="font-pixel text-xl text-blue-400">{winRate}%</div>
          <div className="font-pixel text-[10px] text-gray-500">WIN RATE</div>
        </div>
      </div>
      <div className="text-center mt-3">
        <span className="font-pixel text-xs text-gray-500">
          Total: {totalFlips} flips
        </span>
      </div>
    </div>
  );
}
