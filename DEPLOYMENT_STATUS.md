# Deployment Status - King of the Base

This file tracks the deployment status of the KingOfTheBase smart contract.

## Current Status

### Base Sepolia (Testnet)

**Status**: ⏳ **AWAITING MANUAL DEPLOYMENT**

This subtask requires manual deployment outside the automated build environment because it needs:
- A funded wallet with Base Sepolia testnet ETH
- Access to Base Sepolia RPC network
- Foundry (forge) installed on the deployment machine

### Deployment Information

```yaml
Network: Base Sepolia
Chain ID: 84532
Contract: KingOfTheBase
Compiler: Solidity 0.8.23
Status: Pending Deployment
```

## How to Deploy

### Quick Start

```bash
cd contracts
./deploy.sh
```

### Detailed Instructions

For complete step-by-step deployment instructions, see:
**[contracts/DEPLOYMENT_GUIDE.md](./contracts/DEPLOYMENT_GUIDE.md)**

## Verification

After deployment, run the verification script:

```bash
cd contracts
./verify-deployment.sh
```

This will check:
- ✅ Contract address is set in `.env.local`
- ✅ Address format is valid
- ✅ Contract code exists on Base Sepolia
- ✅ Contract interface is correct (getKingData callable)

## Post-Deployment Checklist

After successful deployment, complete these steps:

- [ ] Contract deployed to Base Sepolia
- [ ] Contract address saved to `.env.local` as `NEXT_PUBLIC_CONTRACT_ADDRESS`
- [ ] Contract verified on Basescan (https://sepolia.basescan.org)
- [ ] Verification script passes: `./contracts/verify-deployment.sh`
- [ ] Paymaster policy configured in CDP dashboard
- [ ] Contract whitelisted for gasless transactions
- [ ] Tested seizeThrone function works
- [ ] Frontend can read contract data
- [ ] Update this file with deployment details

## Deployment Details

**After deployment, fill in this section:**

```yaml
Contract Address: [TO BE FILLED]
Deployer Address: [TO BE FILLED]
Block Number: [TO BE FILLED]
Transaction Hash: [TO BE FILLED]
Deployment Date: [TO BE FILLED]
Gas Used: [TO BE FILLED]
Basescan URL: https://sepolia.basescan.org/address/[ADDRESS]
```

## Troubleshooting

### Common Issues

1. **"insufficient funds for gas"**
   - Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

2. **"PRIVATE_KEY not set"**
   - Create `contracts/.env` file with your private key
   - See `contracts/.env.example` for template

3. **"contract verification failed"**
   - Run manual verification: `forge verify-contract <address> src/KingOfTheBase.sol:KingOfTheBase --chain base-sepolia`

4. **"RPC connection failed"**
   - Base Sepolia RPC might be down
   - Try alternative RPC: https://base-sepolia.blockpi.network/v1/rpc/public

For more troubleshooting, see [contracts/DEPLOYMENT_GUIDE.md](./contracts/DEPLOYMENT_GUIDE.md).

## Paymaster Configuration

After contract deployment, configure Coinbase Paymaster for gasless transactions.

### Status: ⏳ **AWAITING MANUAL CONFIGURATION**

**Required**: CDP (Coinbase Developer Platform) account access

### Quick Setup

```bash
# 1. Go to CDP dashboard
open https://portal.cdp.coinbase.com/

# 2. Follow the setup guide
# See: PAYMASTER_SETUP_GUIDE.md
```

### Configuration Checklist

- [ ] CDP account created/accessed
- [ ] Paymaster service enabled for Base Sepolia
- [ ] Policy created: "King of the Base - Gasless"
- [ ] Contract address whitelisted: [YOUR_DEPLOYED_ADDRESS]
- [ ] Rate limits configured: 10 per user per day
- [ ] Spending caps set: $100 monthly
- [ ] CDP API Key copied to `.env.local`
- [ ] Paymaster URL copied to `.env.local`
- [ ] Origin restrictions added (localhost + production domains)
- [ ] Test transaction successful in CDP dashboard

### Paymaster Details

**After configuration, fill in this section:**

```yaml
Paymaster Status: [TO BE FILLED]
Policy Name: King of the Base - Gasless
Network: Base Sepolia (84532)
CDP API Key: [CONFIGURED in .env.local]
Paymaster URL: [CONFIGURED in .env.local]
Rate Limits:
  Per-User Daily: 10 transactions
  Per-User Hourly: 3 transactions
  Global Daily Budget: $10 USD
  Global Monthly Budget: $100 USD
Configuration Date: [TO BE FILLED]
```

## Resources

- 📚 Deployment Guide: [contracts/DEPLOYMENT_GUIDE.md](./contracts/DEPLOYMENT_GUIDE.md)
- 🔍 Verification Script: [contracts/verify-deployment.sh](./contracts/verify-deployment.sh)
- 💰 **Paymaster Setup Guide**: [PAYMASTER_SETUP_GUIDE.md](./PAYMASTER_SETUP_GUIDE.md)
- 💳 **Quick Paymaster Setup**: [contracts/PAYMASTER_SETUP.md](./contracts/PAYMASTER_SETUP.md)
- 🎛️ CDP Dashboard: https://portal.cdp.coinbase.com/
- 🌐 Base Sepolia Explorer: https://sepolia.basescan.org
- 💧 Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- 📖 Base Documentation: https://docs.base.org/

## Next Steps

Once deployment is complete and verified:

1. ✅ Mark subtask-3-1 as completed
2. ➡️ **CURRENT**: subtask-3-2: Configure Coinbase Paymaster (see [PAYMASTER_SETUP_GUIDE.md](./PAYMASTER_SETUP_GUIDE.md))
3. ➡️ Then continue to Phase 4: Frontend Providers & Configuration

---

**Last Updated**: 2026-01-22
**Phase**: 3 - Contract Deployment to Base Sepolia
**Current Subtask**: 3-2 - Configure Coinbase Paymaster policy in CDP dashboard
