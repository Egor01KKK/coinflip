/**
 * King of the Base - Main Game Page
 * Complete game layout with all components assembled
 *
 * Layout structure:
 * 1. Header (title + description)
 * 2. Leaderboard (top 3 players)
 * 3. ThroneCard (current king info)
 * 4. MessageInput (enter king message)
 * 5. ProtectionTimer (shown when protection is active)
 * 6. UsurpButton (seize throne with gasless transaction)
 * 7. ShareButton (challenge friends on Farcaster)
 */

'use client';

import { useState } from 'react';
import { ThroneCard } from '@/components/ThroneCard';
import { UsurpButton } from '@/components/UsurpButton';
import { MessageInput } from '@/components/MessageInput';
import { ProtectionTimer } from '@/components/ProtectionTimer';
import { Leaderboard } from '@/components/Leaderboard';
import { ShareButton } from '@/components/ShareButton';
import { useKingData } from '@/hooks/useKingData';
import { TEXTS } from '@/lib/constants';

export default function Home() {
  // State for king's message input
  const [message, setMessage] = useState('');

  // Get current king data for share button
  const { reignDuration } = useKingData();

  /**
   * Handle successful throne seizure
   * Clear message input on success
   */
  const handleSuccess = () => {
    console.log('🎉 You are the new King!');
    setMessage(''); // Clear message for next capture
  };

  /**
   * Handle transaction error
   */
  const handleError = (error: Error) => {
    console.error('❌ Failed to seize throne:', error);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 bg-[var(--bg-primary)]">
      <div className="w-full max-w-3xl space-y-8 py-8">
        {/* ==================== HEADER ==================== */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl neon-glow pixel-text-glow-gold animate-float">
            {TEXTS.appTitle}
          </h1>
          <p className="text-xs md:text-sm text-[var(--accent-neon)] pixel-text-glow-green">
            {TEXTS.appDescription}
          </p>
        </div>

        {/* ==================== LEADERBOARD ==================== */}
        <div className="w-full">
          <Leaderboard />
        </div>

        {/* ==================== THRONE CARD ==================== */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            <ThroneCard />
          </div>
        </div>

        {/* ==================== GAME ACTIONS ==================== */}
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Message Input */}
          <div>
            <label htmlFor="king-message" className="block text-xs text-gray-400 mb-2 font-['Press_Start_2P']">
              Your message as King:
            </label>
            <MessageInput
              value={message}
              onChange={setMessage}
              placeholder={TEXTS.messagePlaceholder}
            />
          </div>

          {/* Protection Timer (shown only when throne is protected) */}
          <div className="flex justify-center">
            <ProtectionTimer
              onExpired={() => console.log('Protection expired, throne is vulnerable!')}
            />
          </div>

          {/* Usurp Button with integrated attempts counter */}
          <div className="w-full">
            <UsurpButton
              message={message}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>

          {/* Share Button */}
          <div className="w-full flex justify-center pt-4">
            <ShareButton
              reignTime={reignDuration ? Number(reignDuration) : 0}
              onClick={() => console.log('Share button clicked')}
            />
          </div>
        </div>

        {/* ==================== FOOTER INFO ==================== */}
        <div className="text-center space-y-2 pt-8 border-t border-[var(--accent-neon)]/20">
          <p className="text-xs text-gray-500 font-['Press_Start_2P']">
            Gasless transactions powered by Coinbase Paymaster
          </p>
          <p className="text-xs text-gray-600">
            Built on Base • Real-time updates every 2s
          </p>
        </div>

        {/* ==================== MOBILE OPTIMIZED SPACING ==================== */}
        <div className="h-8 md:h-0" /> {/* Bottom padding for mobile */}
      </div>
    </main>
  );
}
