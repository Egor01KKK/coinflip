"use client";

import { useConnect } from "wagmi";

export function LoginScreen() {
  const { connect, connectors, isPending } = useConnect();

  // Find connectors
  const metaMaskConnector = connectors.find(
    (c) => c.id === "injected" || c.name === "MetaMask"
  );
  const coinbaseConnector = connectors.find(
    (c) => c.id === "coinbaseWalletSDK" || c.name.includes("Coinbase")
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pixel-bg p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-3xl text-gold mb-2">COINFLIP</h1>
        <p className="font-pixel text-xs text-gray-400">Flip coins on Base</p>
      </div>

      {/* Coin decoration */}
      <div className="mb-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-gold-dark border-4 border-yellow-600 flex items-center justify-center text-4xl animate-pulse-glow">
          ?
        </div>
      </div>

      {/* Connect buttons */}
      <div className="w-full max-w-xs space-y-4">
        <p className="font-pixel text-sm text-center text-gray-300 mb-6">
          Connect wallet to play
        </p>

        {/* Coinbase Wallet */}
        <button
          onClick={() => coinbaseConnector && connect({ connector: coinbaseConnector })}
          disabled={isPending || !coinbaseConnector}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-b from-blue-500 to-blue-700 text-white font-pixel text-sm border-4 border-blue-400 rounded-lg shadow-[0_4px_0_0_#1d4ed8] hover:shadow-[0_2px_0_0_#1d4ed8] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl">🔵</span>
          <span>Coinbase Wallet</span>
        </button>

        {/* MetaMask */}
        <button
          onClick={() => metaMaskConnector && connect({ connector: metaMaskConnector })}
          disabled={isPending || !metaMaskConnector}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-b from-orange-500 to-orange-700 text-white font-pixel text-sm border-4 border-orange-400 rounded-lg shadow-[0_4px_0_0_#c2410c] hover:shadow-[0_2px_0_0_#c2410c] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl">🦊</span>
          <span>MetaMask</span>
        </button>
      </div>

      {/* Loading state */}
      {isPending && (
        <p className="font-pixel text-xs text-gray-500 mt-6 animate-pulse">
          Connecting...
        </p>
      )}

      {/* Footer */}
      <div className="absolute bottom-4">
        <p className="font-pixel text-[10px] text-gray-600">Built on Base</p>
      </div>
    </div>
  );
}
