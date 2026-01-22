# KingOfTheBase - Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Foundry installed**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Base Sepolia testnet ETH** (for deployment gas)
   - Get from: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or: https://faucet.quicknode.com/base/sepolia

3. **Private key** with Base Sepolia ETH
   - Create a new wallet for deployment or use an existing one
   - Never commit your private key to git!

4. **Basescan API key** (for contract verification)
   - Get from: https://basescan.org/myapikey

## Deployment Steps

### Step 1: Set Environment Variables

Create a `.env` file in the `contracts/` directory:

```bash
cd contracts
cat > .env << 'EOF'
# Deployer private key (with 0x prefix)
PRIVATE_KEY=0x...your_private_key_here...

# Basescan API key for verification
BASESCAN_API_KEY=your_basescan_api_key_here

# RPC URL (optional - uses public RPC by default)
BASE_SEPOLIA_RPC=https://sepolia.base.org
EOF
```

**⚠️ IMPORTANT**: Never commit the `.env` file! It's already in `.gitignore`.

### Step 2: Install Dependencies

```bash
# Install Foundry dependencies
forge install
```

### Step 3: Build and Test

```bash
# Compile contracts
forge build

# Run tests to ensure everything works
forge test -vv

# Check gas costs
forge test --gas-report
```

Expected output:
```
[PASS] testSeizeThrone() (gas: ~75000)
[PASS] testProtectionPeriod() (gas: ~80000)
[PASS] testMessageLength() (gas: ~50000)
...
Test result: ok. 30 passed; 0 failed
```

### Step 4: Deploy to Base Sepolia

```bash
# Deploy contract
forge script script/Deploy.s.sol \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv

# Or use the public RPC directly:
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --verify \
  -vvvv
```

**What this does:**
- Deploys `KingOfTheBase.sol` to Base Sepolia
- Automatically verifies the contract on Basescan
- Saves deployment artifacts to `broadcast/` directory

### Step 5: Save Deployment Information

After successful deployment, you'll see output like:

```
== Logs ==
  KingOfTheBase deployed to: 0x1234567890abcdef1234567890abcdef12345678
  Deployer: 0xYourAddress...
  Chain ID: 84532

Transaction hash: 0xabc...
```

**Copy the contract address** (starts with 0x...) and save it.

### Step 6: Update Frontend Configuration

Update the `.env.local` file in the **root directory** (not contracts/):

```bash
cd ..  # Back to root directory
```

Edit `.env.local` and add the contract address:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

### Step 7: Verify on Basescan

1. Open https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
2. You should see:
   - ✅ Contract verified (green checkmark)
   - Contract name: `KingOfTheBase`
   - Compiler: `v0.8.23`
   - Read/Write contract tabs available

If verification failed during deployment, manually verify:

```bash
cd contracts
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/KingOfTheBase.sol:KingOfTheBase \
  --chain base-sepolia \
  --watch
```

### Step 8: Configure Paymaster (Optional for Gasless Transactions)

To enable gasless transactions via Coinbase Paymaster:

1. Go to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create a new project or select existing
3. Navigate to **Paymaster** section
4. Create a new policy:
   - **Name**: "King of the Base - Base Sepolia"
   - **Chain**: Base Sepolia
   - **Contract whitelist**: Add your contract address
   - **Rate limits**:
     - 10 transactions per user per day
     - Max 0.001 ETH per transaction
   - **Spending cap**: Set monthly budget (e.g., 0.1 ETH)
5. Save the policy

The Paymaster URL is already configured in `.env.local`:
```
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/6ba349b3-798d-4d25-b5fd-ad07828efcc0
```

## Verification Checklist

After deployment, verify everything works:

- [ ] Contract deployed to Base Sepolia
- [ ] Contract verified on Basescan (green checkmark)
- [ ] Contract address saved to `.env.local`
- [ ] Basescan shows correct contract name and functions
- [ ] Can read `getKingData()` on Basescan
- [ ] Paymaster policy configured (if using gasless)

## Testing the Deployed Contract

### Quick Test via Basescan

1. Go to your contract on Basescan
2. Click "Write Contract"
3. Connect your wallet
4. Call `seizeThrone` with message: "Hello World"
5. Confirm transaction
6. Go to "Read Contract" tab
7. Call `getKingData()` - should show your address as king

### Test via Cast (Foundry CLI)

```bash
# Read current king data
cast call YOUR_CONTRACT_ADDRESS \
  "getKingData()" \
  --rpc-url https://sepolia.base.org

# Seize throne
cast send YOUR_CONTRACT_ADDRESS \
  "seizeThrone(string)" \
  "I am the King!" \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY
```

## Troubleshooting

### Issue: "insufficient funds for gas"
**Solution**: Get more Base Sepolia ETH from faucet

### Issue: "nonce too low"
**Solution**: Reset nonce in your wallet or wait a few blocks

### Issue: "contract verification failed"
**Solution**: Manually verify using the command in Step 7

### Issue: "unknown chain"
**Solution**: Update Foundry: `foundryup`

### Issue: "contract deployment failed"
**Solution**:
1. Check you have enough Base Sepolia ETH
2. Verify your private key is correct (with 0x prefix)
3. Try with more verbose output: `-vvvv`

## Security Notes

- ⚠️ **Never commit `.env` file**
- ⚠️ Use a dedicated deployment wallet (not your main wallet)
- ⚠️ Verify contract code on Basescan matches your source
- ⚠️ Set Paymaster spending limits appropriately
- ⚠️ Monitor Paymaster usage regularly

## Next Steps

After successful deployment:

1. Continue to Phase 4: Frontend Providers & Configuration
2. Update `src/lib/contract.ts` with the deployed contract address
3. Test the full application flow
4. Deploy frontend to Vercel

## Useful Links

- Base Sepolia Explorer: https://sepolia.basescan.org
- Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Foundry Book: https://book.getfoundry.sh/
- CDP Dashboard: https://portal.cdp.coinbase.com/
- Base Docs: https://docs.base.org/

---

**Deployment Complete! 🎉**

Your KingOfTheBase contract is now live on Base Sepolia!
