# KingOfTheBase Deployment Guide

Complete guide for deploying the KingOfTheBase contract to Base Sepolia testnet.

## Prerequisites

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:
```bash
forge --version
```

### 2. Get Base Sepolia Testnet ETH

You need testnet ETH to pay for deployment gas:

**Option A: Base Sepolia Faucet**
- Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Connect your wallet
- Request testnet ETH (free)

**Option B: Bridge from Ethereum Sepolia**
- Get Sepolia ETH from: https://sepoliafaucet.com/
- Bridge to Base Sepolia: https://bridge.base.org/

### 3. Get Basescan API Key

For automatic contract verification:
- Visit: https://basescan.org/myapikey
- Sign up / Log in
- Create a new API key
- Copy the key for later

### 4. Prepare Your Deployer Wallet

- Create a new wallet or use an existing one
- **IMPORTANT**: Use a dedicated deployment wallet, not your main wallet
- Export the private key (with 0x prefix)
- Fund it with ~0.01 ETH on Base Sepolia

## Deployment Steps

### Step 1: Set Up Environment Variables

Create a `.env` file in the `contracts/` directory:

```bash
cd contracts
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Your deployer wallet private key (with 0x prefix)
PRIVATE_KEY=0x1234567890abcdef...

# Your Basescan API key
BASESCAN_API_KEY=ABC123XYZ...
```

**⚠️ SECURITY WARNING**: Never commit the `.env` file to git! It's already in `.gitignore`.

### Step 2: Install Dependencies

```bash
cd contracts
forge install
```

### Step 3: Run Tests (Optional but Recommended)

Verify everything works before deploying:

```bash
forge test -vv
```

Expected output: All tests pass ✅

### Step 4: Deploy Contract

**Option A: Using the deployment script (Recommended)**

```bash
./deploy.sh
```

The script will:
- ✅ Check environment variables
- ✅ Build the contracts
- ✅ Run tests
- ✅ Deploy to Base Sepolia
- ✅ Verify on Basescan

**Option B: Manual deployment**

```bash
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --verify \
  -vvvv
```

### Step 5: Save the Contract Address

After successful deployment, you'll see output like:

```
== Logs ==
  KingOfTheBase deployed to: 0x1234567890abcdef1234567890abcdef12345678
  Deployer: 0xYourWalletAddress
  Chain ID: 84532
```

**Copy the contract address** (the one after "deployed to:").

### Step 6: Update .env.local

Navigate back to the project root and update `.env.local`:

```bash
cd ..
nano .env.local
```

Set the contract address:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

Save the file.

### Step 7: Verify on Basescan

1. Open your browser
2. Go to: https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
3. Verify you see:
   - ✅ Contract is verified (green checkmark)
   - ✅ Contract name: KingOfTheBase
   - ✅ Compiler version: 0.8.23
   - ✅ Source code is visible

If verification failed during deployment, manually verify:

```bash
cd contracts
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/KingOfTheBase.sol:KingOfTheBase \
  --chain base-sepolia \
  --watch
```

## Verification Checklist

After deployment, verify the following:

- [ ] Contract is deployed on Base Sepolia
- [ ] Contract address is visible on https://sepolia.basescan.org
- [ ] Contract is verified (source code visible)
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` is set in `../.env.local`
- [ ] Contract functions are accessible (you can read `currentKing`, `reignStartTime`, etc.)

## Next Steps

After successful deployment:

1. **Configure Paymaster** (for gasless transactions)
   - Go to: https://portal.cdp.coinbase.com/
   - Navigate to: Paymaster → Policies
   - Create new policy for Base Sepolia
   - Add your contract address to the whitelist
   - Set rate limits (e.g., 10 transactions per user per day)

2. **Test the Contract**
   ```bash
   # From project root
   npm run dev
   # Open http://localhost:3000 and test the game
   ```

3. **Continue with frontend integration** (Phase 4)

## Troubleshooting

### Error: "insufficient funds for gas"

**Solution**: Your deployer wallet needs more Base Sepolia ETH. Get more from the faucet.

### Error: "PRIVATE_KEY not set"

**Solution**: Make sure you created `.env` file in the `contracts/` directory with your private key.

### Error: "contract verification failed"

**Solution**: Run manual verification:
```bash
forge verify-contract YOUR_ADDRESS src/KingOfTheBase.sol:KingOfTheBase --chain base-sepolia
```

### Error: "failed to get EIP-1559 fees"

**Solution**: Base Sepolia RPC might be down. Try again in a few minutes or use a custom RPC:
```bash
forge script script/Deploy.s.sol \
  --rpc-url https://base-sepolia.blockpi.network/v1/rpc/public \
  --broadcast --verify -vvvv
```

### Contract deployed but verification failed

1. Wait 1-2 minutes for the contract to be indexed
2. Run manual verification:
   ```bash
   forge verify-contract \
     <CONTRACT_ADDRESS> \
     src/KingOfTheBase.sol:KingOfTheBase \
     --chain base-sepolia \
     --etherscan-api-key $BASESCAN_API_KEY \
     --watch
   ```

## Deployed Contract Info

After deployment, update this section:

```
Contract Address: 0x...
Deployer: 0x...
Block Number: ...
Transaction Hash: 0x...
Deployment Date: YYYY-MM-DD
Basescan Link: https://sepolia.basescan.org/address/0x...
```

## Security Notes

- ✅ The contract has no owner/admin functions (fully decentralized)
- ✅ No upgrade mechanism (immutable once deployed)
- ✅ No external calls (no re-entrancy risks)
- ✅ Protection period prevents spam (3 seconds)
- ✅ Message length is validated (max 30 characters)

The contract is safe to use on mainnet after thorough testing on testnet.

## Cost Estimates

- Deployment gas: ~500,000 gas
- Cost on Base Sepolia: FREE (testnet)
- Cost on Base Mainnet: ~$0.50 (at 0.5 gwei gas price)

## Resources

- Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Base Sepolia Explorer: https://sepolia.basescan.org
- Foundry Book: https://book.getfoundry.sh/
- Base Documentation: https://docs.base.org/

---

**Need help?** Check the troubleshooting section or reach out in the project's communication channel.
