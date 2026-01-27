import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

// Wagmi configuration for Base
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    // MetaMask and other browser wallets
    injected({
      target: "metaMask",
    }),
    // Coinbase Wallet (optional)
    coinbaseWallet({
      appName: "CoinFlip",
      preference: "all", // Allow both extension and smart wallet
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

// Export chains for use in components
export { base, baseSepolia };
