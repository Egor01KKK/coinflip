'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniKit } from '@worldcoin/minikit-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { config } from '@/lib/config';

/**
 * Providers wrapper for King of the Base
 * Sets up Wagmi, TanStack Query, OnchainKit, and MiniKit
 */
export function Providers({ children }: { children: ReactNode }) {
  // Create QueryClient in state to ensure it's only created once per component mount
  const [queryClient] = useState(() => new QueryClient());

  // Initialize MiniKit on client side
  useEffect(() => {
    MiniKit.install();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: 'dark',
              theme: 'cyberpunk',
            },
            paymaster: process.env.NEXT_PUBLIC_PAYMASTER_URL,
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
