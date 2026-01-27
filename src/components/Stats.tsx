"use client";

import { usePlayerStats } from "@/hooks/usePlayerStats";

type StatsProps = {
  showDetailed?: boolean;
};

export function Stats({ showDetailed = false }: StatsProps) {
  const { stats, isLoading } = usePlayerStats();

  if (isLoading) {
    return (
      <div className="flex justify-center gap-8 py-4 animate-pulse">
        <div className="text-center">
          <div className="h-8 w-16 bg-gray-700 rounded mb-1" />
          <div className="h-4 w-12 bg-gray-700 rounded" />
        </div>
        <div className="text-center">
          <div className="h-8 w-16 bg-gray-700 rounded mb-1" />
          <div className="h-4 w-12 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center gap-8 py-4">
        <div className="text-center">
          <div className="font-pixel text-2xl text-gold">0</div>
          <div className="font-pixel text-xs text-gray-400">STREAK</div>
        </div>
        <div className="text-center">
          <div className="font-pixel text-2xl text-pixel-accent">0</div>
          <div className="font-pixel text-xs text-gray-400">BEST</div>
        </div>
      </div>
    );
  }

  const currentStreak = Number(stats.currentStreak);
  const maxStreak = Number(stats.maxStreak);
  const wins = Number(stats.wins);
  const losses = Number(stats.losses);
  const totalFlips = Number(stats.totalFlips);
  const winRate = totalFlips > 0 ? ((wins / totalFlips) * 100).toFixed(1) : "0";

  return (
    <div className="py-4">
      {/* Main stats */}
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <div className="font-pixel text-3xl text-gold flex items-center gap-1">
            <span className="text-orange-500">🔥</span>
            {currentStreak}
          </div>
          <div className="font-pixel text-xs text-gray-400">STREAK</div>
        </div>
        <div className="text-center">
          <div className="font-pixel text-3xl text-pixel-accent">
            {maxStreak}
          </div>
          <div className="font-pixel text-xs text-gray-400">BEST</div>
        </div>
      </div>

      {/* Detailed stats */}
      {showDetailed && (
        <div className="mt-6 grid grid-cols-3 gap-4 px-4">
          <div className="text-center p-3 bg-pixel-card rounded-lg border border-pixel-border">
            <div className="font-pixel text-xl text-pixel-success">{wins}</div>
            <div className="font-pixel text-[10px] text-gray-400">WINS</div>
          </div>
          <div className="text-center p-3 bg-pixel-card rounded-lg border border-pixel-border">
            <div className="font-pixel text-xl text-red-500">{losses}</div>
            <div className="font-pixel text-[10px] text-gray-400">LOSSES</div>
          </div>
          <div className="text-center p-3 bg-pixel-card rounded-lg border border-pixel-border">
            <div className="font-pixel text-xl text-blue-400">{winRate}%</div>
            <div className="font-pixel text-[10px] text-gray-400">WIN RATE</div>
          </div>
          <div className="col-span-3 text-center p-3 bg-pixel-card rounded-lg border border-pixel-border">
            <div className="font-pixel text-xl text-gray-300">{totalFlips}</div>
            <div className="font-pixel text-[10px] text-gray-400">TOTAL FLIPS</div>
          </div>
        </div>
      )}
    </div>
  );
}
