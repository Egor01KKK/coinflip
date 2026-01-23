# KingOfTheBase Smart Contracts

This directory contains the Solidity smart contracts for the King of the Base game.

## Quick Start

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Install Dependencies

```bash
forge install
```

### 3. Build

```bash
forge build
```

### 4. Test

```bash
# Run all tests
forge test

# Run with verbose output
forge test -vv

# Run with gas report
forge test --gas-report

# Run specific test
forge test --match-test testSeizeThrone -vv
```

### 5. Deploy to Base Sepolia

**Option A: Using the deployment script (recommended)**

```bash
# 1. Create .env file with your keys
cp .env.example .env
# Edit .env and add your PRIVATE_KEY and BASESCAN_API_KEY

# 2. Run deployment script
./deploy.sh
```

**Option B: Manual deployment**

```bash
forge script script/Deploy.s.sol \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv
```

### 6. Verify on Basescan

If auto-verification fails, manually verify:

```bash
forge verify-contract \
  <CONTRACT_ADDRESS> \
  src/KingOfTheBase.sol:KingOfTheBase \
  --chain base-sepolia \
  --watch
```

## Contract Overview

### KingOfTheBase.sol

Main game contract with the following features:

- **seizeThrone(string message)**: Capture the throne and become king
- **getKingData()**: Get current king information
- **getLeaderboard(address[])**: Get total reign times for players

### Key Parameters

- **Protection period**: 3 seconds after seizing
- **Message length**: Max 30 characters
- **Chain**: Base Sepolia (testnet) / Base (mainnet)

## Testing

The test suite includes:

- ✅ Initial state tests
- ✅ Throne seizure functionality
- ✅ Protection period validation
- ✅ Message length limits
- ✅ Total reign time tracking
- ✅ Leaderboard queries
- ✅ Edge cases and boundary conditions
- ✅ Fuzz testing

Run tests:

```bash
forge test -vv
```

## Gas Optimization

The contract is optimized for gas efficiency:

- Uses `calldata` for string parameters
- Minimal storage operations
- Efficient mapping lookups
- Optimized loops in leaderboard function

Gas costs (approximate):
- First seizeThrone: ~75,000 gas
- Subsequent seizeThrone: ~50,000 gas
- getKingData: ~3,000 gas (view)
- getLeaderboard: ~5,000 gas per player (view)

## Security

- 3-second protection period prevents spam
- Message length validation (max 30 chars)
- No re-entrancy risks (no external calls)
- No owner privileges (fully decentralized)
- Tested with fuzz testing (256 runs)

## Deployed Contracts

### Base Sepolia (Testnet)

- Contract: `TBD` (deploy using instructions above)
- Explorer: https://sepolia.basescan.org

### Base Mainnet

- Contract: `TBD` (not yet deployed)
- Explorer: https://basescan.org

## Development

### Project Structure

```
contracts/
├── src/
│   └── KingOfTheBase.sol      # Main contract
├── test/
│   └── KingOfTheBase.t.sol    # Test suite
├── script/
│   └── Deploy.s.sol           # Deployment script
├── foundry.toml               # Foundry configuration
├── deploy.sh                  # Quick deploy script
└── README.md                  # This file
```

### Useful Commands

```bash
# Format code
forge fmt

# Check code coverage
forge coverage

# Generate documentation
forge doc

# Run gas snapshots
forge snapshot

# Clean build artifacts
forge clean
```

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Base Documentation](https://docs.base.org/)
- [Basescan](https://basescan.org/)

## License

MIT
