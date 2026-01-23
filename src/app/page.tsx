/**
 * King of the Base - Main Game Page
 * Complete game layout with all components assembled
 *
 * Features:
 * - Loading states with pixel-art skeleton
 * - Error boundary for graceful error handling
 * - Responsive mobile styling (320px+)
 * - Touch-friendly UI elements
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

import { useState, useEffect, Suspense } from 'react';
import { Clock, Settings } from 'lucide-react';
import { ThroneCard } from '@/components/ThroneCard';
import { UsurpButton } from '@/components/UsurpButton';
import { MessageInput } from '@/components/MessageInput';
import { ProtectionTimer } from '@/components/ProtectionTimer';
import { Leaderboard } from '@/components/Leaderboard';
import { ShareButton } from '@/components/ShareButton';
import { useKingData } from '@/hooks/useKingData';
import { TEXTS } from '@/lib/constants';
import { isContractConfigured } from '@/lib/contract';

/**
 * Loading Skeleton Component
 * Displays animated placeholder while data loads
 * Uses pixel-art styling consistent with game theme
 */
function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6 md:space-y-8 animate-pulse">
      {/* Skeleton for Leaderboard */}
      <div className="w-full h-32 md:h-40 pixel-card">
        <div className="flex justify-center items-end gap-3 md:gap-4 h-full p-3 md:p-4">
          <div className="w-14 h-14 md:w-20 md:h-20 pixel-border-thin bg-gray-800/50"></div>
          <div className="w-18 h-20 md:w-24 md:h-28 pixel-border-thin bg-gray-800/50"></div>
          <div className="w-14 h-10 md:w-20 md:h-16 pixel-border-thin bg-gray-800/50"></div>
        </div>
      </div>

      {/* Skeleton for ThroneCard */}
      <div className="w-full max-w-md mx-auto">
        <div className="pixel-throne-card pixel-card-corners min-h-[240px] md:min-h-[280px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-sm bg-gray-800/50"></div>
            <div className="w-32 h-4 bg-gray-800/50"></div>
            <div className="w-24 h-4 bg-gray-800/50"></div>
            <div className="w-full h-16 bg-gray-800/50 mt-4"></div>
          </div>
        </div>
      </div>

      {/* Skeleton for Actions */}
      <div className="w-full max-w-md mx-auto space-y-4">
        <div className="w-full h-12 md:h-14 bg-gray-800/50 pixel-border-thin"></div>
        <div className="w-full h-14 md:h-16 bg-gray-800/50 pixel-border-thin"></div>
      </div>
    </div>
  );
}

/**
 * Contract Not Configured Component
 * Displays deployment instructions when contract is not set
 */
function ContractNotConfigured() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="pixel-card pixel-card-corners border-[var(--accent-gold)] p-6 md:p-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl md:text-5xl">🚀</div>
            <h2 className="text-base md:text-lg pixel-text-glow-gold font-['Press_Start_2P']">
              Contract Not Deployed
            </h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-['Press_Start_2P']">
              The smart contract needs to be deployed before the game can start
            </p>
          </div>

          <div className="space-y-4 text-left">
            <h3 className="text-sm pixel-text-glow-green font-['Press_Start_2P']">
              Deployment Steps:
            </h3>

            <div className="space-y-3 text-[10px] md:text-xs text-gray-300 font-['Press_Start_2P'] leading-relaxed">
              <div className="pixel-border-thin p-3 bg-gray-900/50">
                <p className="text-[var(--accent-neon)] mb-2">1. Install Foundry:</p>
                <code className="block bg-black/50 p-2 text-[9px] md:text-[10px] overflow-x-auto">
                  curl -L https://foundry.paradigm.xyz | bash
                  <br />
                  foundryup
                </code>
              </div>

              <div className="pixel-border-thin p-3 bg-gray-900/50">
                <p className="text-[var(--accent-neon)] mb-2">2. Get testnet ETH:</p>
                <p className="text-[9px] md:text-[10px] text-gray-400">
                  Visit: coinbase.com/faucets/base-ethereum-sepolia-faucet
                </p>
              </div>

              <div className="pixel-border-thin p-3 bg-gray-900/50">
                <p className="text-[var(--accent-neon)] mb-2">3. Configure private key:</p>
                <code className="block bg-black/50 p-2 text-[9px] md:text-[10px] overflow-x-auto">
                  cd contracts
                  <br />
                  cp .env.example .env
                  <br />
                  # Edit .env with your private key
                </code>
              </div>

              <div className="pixel-border-thin p-3 bg-gray-900/50">
                <p className="text-[var(--accent-neon)] mb-2">4. Deploy contract:</p>
                <code className="block bg-black/50 p-2 text-[9px] md:text-[10px] overflow-x-auto">
                  cd contracts
                  <br />
                  ./deploy.sh
                </code>
              </div>

              <div className="pixel-border-thin p-3 bg-gray-900/50">
                <p className="text-[var(--accent-neon)] mb-2">5. Update .env.local:</p>
                <code className="block bg-black/50 p-2 text-[9px] md:text-[10px] overflow-x-auto">
                  NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
                </code>
              </div>

              <div className="pixel-border-thin p-3 bg-gray-900/50">
                <p className="text-[var(--accent-neon)] mb-2">6. Restart dev server:</p>
                <code className="block bg-black/50 p-2 text-[9px] md:text-[10px] overflow-x-auto">
                  npm run dev
                </code>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[10px] md:text-xs text-gray-500 font-['Press_Start_2P'] leading-relaxed">
                See DEPLOYMENT_GUIDE.md for detailed instructions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Fallback Component
 * Displays pixel-styled error message with retry option
 */
function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="pixel-card pixel-card-corners border-[var(--accent-red)] p-6 md:p-8">
        <div className="text-center space-y-4">
          <div className="text-4xl md:text-5xl animate-shake">⚠️</div>
          <h2 className="text-base md:text-lg pixel-text-glow-red font-['Press_Start_2P']">
            Error Loading
          </h2>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-['Press_Start_2P']">
            {error.message || 'Failed to load game data'}
          </p>
          <button
            onClick={reset}
            className="pixel-button pixel-button-usurp w-full mt-4 text-xs md:text-sm"
            aria-label="Retry loading game"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Game Component
 * Wrapped with loading and error states
 */
function GameContent() {
  // State for king's message input
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if contract is configured
  const contractConfigured = isContractConfigured();

  // Get current king data (only if contract is configured)
  const { reignDuration, king } = useKingData();

  // Handle initial loading state
  useEffect(() => {
    // If contract is not configured, show config screen after brief delay
    if (!contractConfigured) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    try {
      // Mark as loaded once we have data
      if (king !== undefined) {
        setIsLoading(false);
        setError(null);
      } else {
        // If no data after 3 seconds, something might be wrong
        const timeout = setTimeout(() => {
          if (king === undefined) {
            setIsLoading(false);
          }
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [king, contractConfigured]);

  /**
   * Handle successful throne seizure
   * Clear message input on success
   */
  const handleSuccess = () => {
    setMessage(''); // Clear message for next capture
  };

  /**
   * Handle transaction error
   */
  const handleError = (error: Error) => {
    // Error handling is done in the component itself
  };

  /**
   * Retry loading after error
   */
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  };

  // Show contract not configured screen
  if (!contractConfigured && !isLoading) {
    return <ContractNotConfigured />;
  }

  // Show error state
  if (error) {
    return <ErrorFallback error={error} reset={handleRetry} />;
  }

  // Show loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {/* ==================== LEADERBOARD ==================== */}
      <div className="w-full">
        <Suspense fallback={<div className="h-40 pixel-card animate-pulse" />}>
          <Leaderboard />
        </Suspense>
      </div>

      {/* ==================== THRONE CARD ==================== */}
      <div className="w-full flex justify-center px-4 sm:px-0">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <div className="pixel-throne-card pixel-card-corners min-h-[240px] md:min-h-[280px] animate-pulse" />
          }>
            <ThroneCard />
          </Suspense>
        </div>
      </div>

      {/* ==================== GAME ACTIONS ==================== */}
      <div className="w-full max-w-md mx-auto space-y-4 md:space-y-6 px-4 sm:px-0">
        {/* Message Input */}
        <div className="space-y-2 md:space-y-3">
          <label
            htmlFor="king-message"
            className="block text-[10px] sm:text-xs text-gray-400 font-['Press_Start_2P'] leading-relaxed"
          >
            Your message as King:
          </label>
          <MessageInput
            value={message}
            onChange={setMessage}
            placeholder={TEXTS.messagePlaceholder}
          />
        </div>

        {/* Protection Timer (shown only when throne is protected) */}
        <div className="flex justify-center py-2">
          <ProtectionTimer
            onExpired={() => {
              // Timer expired, throne is vulnerable
            }}
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
        <div className="w-full flex justify-center pt-2 md:pt-4">
          <ShareButton
            reignTime={reignDuration ? Number(reignDuration) : 0}
            onClick={() => {
              // Share button clicked
            }}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Header Component
 * Displays timer with clock icon and settings button
 */
function Header() {
  // Timer state in format: hours:minutes:seconds:centiseconds (00:08:43:65)
  const [time, setTime] = useState({ hours: 0, minutes: 8, seconds: 43, centiseconds: 65 });

  useEffect(() => {
    // Update timer every 10ms (for centisecond precision)
    const interval = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds, centiseconds } = prev;

        // Increment centiseconds
        centiseconds += 1;

        // Handle overflow
        if (centiseconds >= 100) {
          centiseconds = 0;
          seconds += 1;
        }

        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
        }

        if (minutes >= 60) {
          minutes = 0;
          hours += 1;
        }

        // Keep hours within 2 digits (max 99)
        if (hours >= 100) {
          hours = 99;
          minutes = 59;
          seconds = 59;
          centiseconds = 99;
        }

        return { hours, minutes, seconds, centiseconds };
      });
    }, 10);

    return () => clearInterval(interval);
  }, []);

  /**
   * Format time to 00:08:43:65 format
   */
  const formatTime = () => {
    const h = String(time.hours).padStart(2, '0');
    const m = String(time.minutes).padStart(2, '0');
    const s = String(time.seconds).padStart(2, '0');
    const cs = String(time.centiseconds).padStart(2, '0');
    return `${h}:${m}:${s}:${cs}`;
  };

  return (
    <div className="w-full flex items-center justify-between px-3 py-3">
      {/* Timer with Clock Icon */}
      <div className="flex items-center gap-2">
        <Clock
          className="w-5 h-5 text-[var(--accent-cyan)]"
          style={{
            shapeRendering: 'crispEdges',
            strokeWidth: 2,
          }}
        />
        <div
          className="text-xs sm:text-sm font-['Press_Start_2P'] text-[var(--accent-cyan)] neon-glow"
          style={{
            textShadow: '0 0 10px var(--accent-cyan), 0 0 20px var(--accent-cyan)',
          }}
        >
          {formatTime()}
        </div>
      </div>

      {/* Settings Button */}
      <button
        className="stone-frame p-2 transition-transform active:translate-y-0.5"
        aria-label="Settings"
      >
        <Settings
          className="w-5 h-5 text-gray-400"
          style={{
            shapeRendering: 'crispEdges',
            strokeWidth: 2,
          }}
        />
      </button>
    </div>
  );
}

/**
 * Main Home Page Export
 * Includes error boundary and layout wrapper
 */
export default function Home() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      setError(new Error(event.message));
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleReset = () => {
    setError(null);
  };

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[var(--bg-primary)]">
        <ErrorFallback error={error} reset={handleReset} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-[var(--bg-primary)] overflow-x-hidden">
      {/* Mobile-optimized container with proper padding and spacing */}
      <div className="w-full max-w-3xl space-y-6 md:space-y-8 py-6 md:py-8 px-2 sm:px-4 md:px-8">
        {/* ==================== HEADER WITH TIMER ==================== */}
        <Header />

        {/* ==================== TITLE AND DESCRIPTION ==================== */}
        <div className="text-center space-y-3 md:space-y-4 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl neon-glow pixel-text-glow-gold animate-float font-['Press_Start_2P'] leading-tight">
            {TEXTS.appTitle}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-[var(--accent-neon)] pixel-text-glow-green font-['Press_Start_2P'] leading-relaxed max-w-2xl mx-auto">
            {TEXTS.appDescription}
          </p>
        </div>

        {/* ==================== GAME CONTENT ==================== */}
        <Suspense fallback={<LoadingSkeleton />}>
          <GameContent />
        </Suspense>

        {/* ==================== FOOTER INFO ==================== */}
        <div className="text-center space-y-2 md:space-y-3 pt-6 md:pt-8 border-t border-[var(--accent-neon)]/20 px-4">
          <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 font-['Press_Start_2P'] leading-relaxed">
            Gasless transactions powered by Coinbase Paymaster
          </p>
          <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 font-['Press_Start_2P']">
            Built on Base • Real-time updates every 2s
          </p>
        </div>

        {/* ==================== MOBILE SAFE AREA ==================== */}
        {/* Extra bottom padding for mobile devices to avoid notch/home indicator */}
        <div className="h-8 sm:h-6 md:h-0" />
      </div>
    </main>
  );
}
