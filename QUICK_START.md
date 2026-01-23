# Quick Start Guide - King of the Base

## Why Your App Shows Empty Screens

The app is loading correctly, but it cannot display data because **the smart contract has not been deployed yet**.

Your `.env.local` file has an empty `NEXT_PUBLIC_CONTRACT_ADDRESS`, which means the frontend doesn't know which blockchain contract to connect to.

## What You'll See

- ✅ Page loads with title and styling
- ✅ Layout and components render
- ❌ Empty/dark boxes where data should be
- ❌ Leaderboard shows empty squares
- ❌ Throne card shows no king info

This is expected! The frontend needs a deployed contract to fetch data from.

---

## Quick Fix (5 minutes)

### Prerequisites
- Node.js installed (you already have this)
- A wallet with Base Sepolia testnet ETH

### Step 1: Install Foundry

```bash
# Install Foundry (Ethereum development toolkit)
curl -L https://foundry.paradigm.xyz | bash

# Restart your terminal, then run:
foundryup
```

Verify installation:
```bash
forge --version
# Should show: forge 0.2.0 (or later)
```

### Step 2: Get Testnet ETH

1. Go to: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Connect your wallet
3. Request Base Sepolia ETH (it's free!)
4. Wait 1-2 minutes for confirmation

### Step 3: Configure Deployment Wallet

```bash
cd contracts

# Copy the example env file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

Add your private key:
```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

⚠️ **NEVER commit this file to git!** It's already in `.gitignore`.

**How to get your private key:**
- MetaMask: Account menu → Account details → Export private key
- Other wallets: Check their documentation

### Step 4: Deploy the Contract

```bash
# Make sure you're in the contracts directory
cd contracts

# Run the deployment script
./deploy.sh
```

You'll see output like:
```
✅ Contract deployed to: 0x1234567890abcdef1234567890abcdef12345678
```

**Copy that address!** You'll need it in the next step.

### Step 5: Configure Frontend

Edit `.env.local` in the project root:

```bash
# Go back to project root
cd ..

# Edit .env.local
nano .env.local
```

Update this line:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```
(Use your actual deployed contract address)

### Step 6: Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

Open http://localhost:3000

🎉 **You should now see the game working!**
- Throne card shows "No King Yet" (initial state)
- Leaderboard works
- You can connect wallet and seize the throne

---

## Troubleshooting

### Issue: "forge not found"
**Solution:** Install Foundry (see Step 1 above)

### Issue: "insufficient funds for gas"
**Solution:** Get testnet ETH from the Base Sepolia faucet (see Step 2)

### Issue: "PRIVATE_KEY not set"
**Solution:** Create `contracts/.env` file with your private key (see Step 3)

### Issue: "Failed to connect to RPC"
**Solution:** Try using a different RPC endpoint. Edit `contracts/deploy.sh`:
```bash
# Change this line to use a different RPC
RPC_URL="https://base-sepolia.blockpi.network/v1/rpc/public"
```

### Issue: Still seeing empty screens after deployment
**Solution:**
1. Verify contract address is set in `.env.local`
2. Check the contract deployed successfully: https://sepolia.basescan.org/address/YOUR_ADDRESS
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for errors (F12)

---

## What Happens After Deployment

Once deployed, the smart contract:
- ✅ Lives permanently on Base Sepolia testnet
- ✅ Has no king initially (zero address)
- ✅ Accepts anyone to seize the throne
- ✅ Tracks reign times and leaderboard
- ✅ Enforces 3-second protection periods
- ✅ Validates message length (max 30 chars)

The frontend will:
- ✅ Connect to the deployed contract
- ✅ Read current king data every 2 seconds
- ✅ Show real-time updates
- ✅ Allow wallet connection via OnchainKit
- ✅ Submit gasless transactions via Paymaster

---

## Next Steps

### Test the Game
1. Connect your wallet (click "Connect Wallet")
2. Enter a message (max 30 characters)
3. Click "⚔️ USURP ⚔️" to seize the throne
4. You become the king!
5. Wait 3 seconds (protection period)
6. Try to seize again or share on Farcaster

### Configure Paymaster (Optional - For Gasless Transactions)

The app is configured to use Coinbase Paymaster for gasless transactions. To enable:

1. Verify your CDP API key is set in `.env.local`:
```env
NEXT_PUBLIC_CDP_API_KEY=6ba349b3-798d-4d25-b5fd-ad07828efcc0
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/6ba349b3-798d-4d25-b5fd-ad07828efcc0
```

2. Add your deployed contract to the Paymaster allowlist:
   - Go to: https://portal.cdp.coinbase.com/
   - Navigate to Paymaster settings
   - Add contract address: `YOUR_CONTRACT_ADDRESS`
   - Set spending limits

See `PAYMASTER_SETUP_GUIDE.md` for detailed instructions.

### Deploy to Production

When ready for mainnet:

1. Deploy contract to Base Mainnet:
```bash
cd contracts
# Update deploy.sh to use Base Mainnet RPC
./deploy.sh
```

2. Update `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_MAINNET_ADDRESS
NEXT_PUBLIC_CHAIN_ID=8453  # Base Mainnet
```

3. Deploy frontend to Vercel:
```bash
vercel deploy
```

---

## Need More Help?

- 📚 **Detailed Deployment Guide**: `contracts/DEPLOYMENT_GUIDE.md`
- 💰 **Paymaster Setup**: `PAYMASTER_SETUP_GUIDE.md`
- 🧪 **Testing Guide**: `E2E_TESTING_GUIDE.md`
- 📱 **Mobile Testing**: `MOBILE_TESTING_GUIDE.md`

## Support

- Base Documentation: https://docs.base.org/
- Foundry Book: https://book.getfoundry.sh/
- OnchainKit Docs: https://onchainkit.xyz/
- Base Discord: https://base.org/discord
