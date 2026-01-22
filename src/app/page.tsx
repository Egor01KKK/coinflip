/**
 * Main game page - placeholder
 * Full implementation will be done in Phase 7
 */
'use client';

import { ThroneCard } from '@/components/ThroneCard';
import { TEXTS } from '@/lib/constants';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[var(--bg-primary)]">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl neon-glow pixel-text-glow-gold">
            {TEXTS.appTitle}
          </h1>
          <p className="text-sm text-[var(--accent-neon)]">
            {TEXTS.appDescription}
          </p>
        </div>

        {/* ThroneCard Component */}
        <ThroneCard />

        {/* Development Note */}
        <p className="text-xs text-center text-gray-500">
          Phase 6: UI Components - ThroneCard Implementation
        </p>
      </div>
    </main>
  );
}
