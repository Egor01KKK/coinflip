import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

/**
 * Wagmi configuration for King of the Base
 * Supports both Base Mainnet and Base Sepolia testnet
 */
export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
