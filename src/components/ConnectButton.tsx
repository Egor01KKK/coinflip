"use client";

import { useAccount, useDisconnect } from "wagmi";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectButton() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  if (!address) return null;

  return (
    <button
      onClick={() => disconnect()}
      className="font-pixel text-xs px-3 py-2 bg-pixel-card border-2 border-pixel-border rounded-lg text-gray-300 hover:text-white hover:border-pixel-accent transition-colors"
      title="Click to disconnect"
    >
      {truncateAddress(address)}
    </button>
  );
}
