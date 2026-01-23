# Coinbase Paymaster Configuration Guide

This guide explains how to configure the Coinbase Paymaster policy in the CDP (Coinbase Developer Platform) dashboard for gasless transactions in the King of the Base game.

## Prerequisites

Before configuring the Paymaster, ensure you have:

- ✅ **CDP Account**: Sign up at https://portal.cdp.coinbase.com/
- ✅ **Contract Deployed**: KingOfTheBase contract must be deployed to Base Sepolia
- ✅ **Contract Address**: You need the deployed contract address from subtask-3-1
- ✅ **CDP API Key**: Required for OnchainKit integration

## What is Coinbase Paymaster?

Coinbase Paymaster is a service that sponsors gas fees for your users' transactions, enabling a gasless user experience. This is crucial for King of the Base because:

- Users can seize the throne without holding ETH
- Reduces friction for new users
- Makes the game more accessible on mobile/Base App
- Improves conversion rates

## Configuration Steps

### Step 1: Access CDP Dashboard

1. Go to **https://portal.cdp.coinbase.com/**
2. Sign in with your Coinbase Developer account
3. Select your project or create a new one

### Step 2: Enable Paymaster Service

1. Navigate to **"Paymaster"** in the left sidebar
2. Click **"Enable Paymaster"** if not already enabled
3. Select **"Base Sepolia"** network for testnet deployment
4. Accept the terms of service

### Step 3: Create Paymaster Policy

1. Click **"Create Policy"** or **"New Policy"**
2. Configure the policy settings:

```yaml
Policy Name: King of the Base - Gasless Transactions
Network: Base Sepolia (84532)
Policy Type: Contract Whitelist
Status: Active
```

### Step 4: Whitelist Contract Address

Add your deployed KingOfTheBase contract to the whitelist:

```yaml
Contract Address: [YOUR_DEPLOYED_CONTRACT_ADDRESS]
Contract Name: KingOfTheBase
Allowed Methods:
  - seizeThrone(string)
```

**Important**: Only whitelist the `seizeThrone` function to prevent abuse.

### Step 5: Configure Rate Limits

Set appropriate rate limits to prevent abuse and manage costs:

```yaml
# Per-User Limits (Recommended)
Max Transactions per User per Day: 10
Max Transactions per User per Hour: 3
Max Gas per Transaction: 200,000 units

# Global Limits (Recommended)
Max Daily Transactions: 10,000
Max Daily Gas Budget: 2,000,000,000 units (2 Gwei)
Max Monthly Spending: $100 USD equivalent
```

**Rationale**:
- 10 daily attempts align with the game's free attempt limit
- 3 per hour prevents spam/bot attacks
- 200k gas is sufficient for seizeThrone function (~100k actual usage)
- Global limits protect against unexpected costs

### Step 6: Configure Additional Security

Enable these security features:

```yaml
# Origin Restrictions
Allowed Origins:
  - https://kingofthebase.app
  - https://king-of-base-*.vercel.app  # Vercel preview deployments
  - http://localhost:3000              # Local development

# IP Rate Limiting
Max Requests per IP per Minute: 10

# User Verification (Optional)
Require Verified Farcaster Account: true
Min Account Age: 7 days
```

### Step 7: Get Paymaster URL and API Key

After creating the policy:

1. Copy the **Paymaster URL** (looks like: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/[YOUR_KEY]`)
2. Copy the **CDP API Key** for OnchainKit

Add these to your `.env.local` file:

```env
# Coinbase Developer Platform (CDP)
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key_here
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/your_key_here

# Contract Address (from subtask-3-1)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### Step 8: Test Paymaster Configuration

Use the CDP dashboard's built-in testing tool:

1. Go to **"Test Paymaster"** tab
2. Enter your contract address
3. Simulate a `seizeThrone` transaction
4. Verify that:
   - ✅ Transaction is sponsored (gas fee = 0 for user)
   - ✅ Policy applies correctly
   - ✅ Rate limits are enforced

## Verification Checklist

After configuration, verify the following:

```bash
# 1. Environment variables are set
grep NEXT_PUBLIC_PAYMASTER_URL .env.local
grep NEXT_PUBLIC_CDP_API_KEY .env.local

# 2. Contract address matches deployment
grep NEXT_PUBLIC_CONTRACT_ADDRESS .env.local
```

Then test from the frontend:
- [ ] User can connect wallet via OnchainKit
- [ ] Clicking "USURP" button triggers gasless transaction
- [ ] Transaction confirmation shows $0.00 gas fee
- [ ] Transaction appears in CDP dashboard analytics
- [ ] Rate limits are enforced after 10 attempts

## Cost Management

### Estimated Costs (Base Sepolia - Testnet)

```
Gas per seizeThrone transaction: ~100,000 units
Base Sepolia gas price: ~0.001 Gwei (negligible)
Cost per transaction: < $0.0001 USD

Daily costs (1000 users, 10 attempts each):
  = 10,000 transactions × $0.0001
  = ~$1 USD per day
```

**Note**: Testnet costs are minimal. For Base Mainnet, expect:
- Gas price: ~0.1-1 Gwei
- Cost per transaction: ~$0.01-0.05 USD
- Daily budget recommendations: $50-500 depending on traffic

### Setting Spending Alerts

1. In CDP Dashboard → **"Paymaster"** → **"Alerts"**
2. Create alert rules:
   - Daily spending exceeds $10
   - Monthly spending exceeds $100
   - Unusual transaction spike (>1000/hour)
   - Rate limit violations detected

## Monitoring & Analytics

Track Paymaster usage in the CDP dashboard:

### Key Metrics to Monitor

```yaml
Daily Active Users: Track unique addresses using gasless txs
Transaction Success Rate: Should be >95%
Average Gas per Transaction: Should be ~100k units
Rate Limit Hits: Should be <5% of total requests
Total Daily Cost: Monitor for unexpected spikes
```

### Dashboard Views

1. **Transactions** - Real-time transaction feed
2. **Analytics** - Usage charts and trends
3. **Policies** - Policy performance and limits
4. **Alerts** - Recent alerts and notifications

## Troubleshooting

### Issue: "Paymaster policy not found"

**Symptoms**: Transactions fail with "Paymaster policy not found" error

**Solutions**:
1. Verify policy is set to "Active" in CDP dashboard
2. Check that contract address is correctly whitelisted
3. Ensure NEXT_PUBLIC_PAYMASTER_URL is correct in .env.local
4. Wait 5-10 minutes for policy changes to propagate

### Issue: "Rate limit exceeded"

**Symptoms**: User sees "Too many transactions" error

**Solutions**:
1. This is expected behavior after 10 daily attempts
2. Verify rate limits match game rules (10 per day)
3. Check if IP-based rate limiting is too strict
4. Consider implementing client-side attempt tracking

### Issue: "Insufficient sponsor balance"

**Symptoms**: Transactions fail with insufficient funds error

**Solutions**:
1. Top up your Paymaster balance in CDP dashboard
2. Set up auto-recharge for production
3. Increase spending limits if needed
4. Check if monthly budget cap was reached

### Issue: "Transaction not sponsored"

**Symptoms**: User is charged gas fees instead of gasless

**Solutions**:
1. Verify `isSponsored={true}` in Transaction component
2. Check that NEXT_PUBLIC_PAYMASTER_URL is set
3. Ensure OnchainKitProvider has paymaster config
4. Verify contract address matches whitelist

## Security Best Practices

### Contract Whitelisting

```typescript
// ✅ GOOD: Only whitelist specific contract and function
Policy: {
  contractAddress: "0x123...",
  allowedFunctions: ["seizeThrone(string)"]
}

// ❌ BAD: Don't whitelist all contracts
Policy: {
  contractAddress: "*",
  allowedFunctions: ["*"]
}
```

### Rate Limiting

```yaml
# ✅ GOOD: Multi-layer rate limiting
Per-User Daily Limit: 10 transactions
Per-User Hourly Limit: 3 transactions
Per-IP Minute Limit: 10 requests
Global Daily Budget: $100 USD

# ❌ BAD: No rate limits
Per-User Daily Limit: Unlimited
Global Daily Budget: Unlimited
```

### Origin Restrictions

```yaml
# ✅ GOOD: Restrict to your domains
Allowed Origins:
  - https://kingofthebase.app
  - https://*.vercel.app

# ❌ BAD: Allow all origins
Allowed Origins:
  - *
```

## Migration to Base Mainnet

When deploying to production (Base Mainnet):

### Step 1: Deploy Contract to Mainnet
```bash
# Update .env with mainnet RPC
BASE_MAINNET_RPC=https://mainnet.base.org

# Deploy to mainnet
cd contracts
forge script script/Deploy.s.sol --rpc-url $BASE_MAINNET_RPC --broadcast --verify
```

### Step 2: Create Mainnet Paymaster Policy

1. In CDP Dashboard, create new policy for **Base Mainnet (8453)**
2. Use same configuration as testnet
3. Update rate limits based on expected traffic
4. Set higher spending alerts

### Step 3: Update Environment Variables

```env
# Change network to mainnet
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/your_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_your_mainnet_address_here
```

### Step 4: Mainnet-Specific Settings

```yaml
# Increase rate limits for production traffic
Max Transactions per User per Day: 10  # Keep same for game balance
Max Daily Transactions: 100,000         # Increased for scalability
Max Monthly Spending: $1,000 USD        # Adjust based on budget

# Tighter security for mainnet
Require Verified Farcaster Account: true
Min Account Age: 30 days
Enable CAPTCHA on excessive retries: true
```

## Support & Resources

### Documentation
- 📚 CDP Paymaster Docs: https://docs.cdp.coinbase.com/paymaster
- 🔗 OnchainKit Integration: https://onchainkit.xyz/
- 🌐 Base Developer Docs: https://docs.base.org/

### CDP Dashboard
- 🎛️ Dashboard: https://portal.cdp.coinbase.com/
- 📊 Analytics: Check real-time transaction stats
- 💳 Billing: Monitor spending and top-up balance

### Getting Help
- 💬 Base Discord: https://discord.gg/buildonbase
- 🐦 Base Twitter: @base
- 📧 CDP Support: support@coinbase.com

## Next Steps

After completing Paymaster configuration:

1. ✅ Mark subtask-3-2 as completed in implementation_plan.json
2. ✅ Update DEPLOYMENT_STATUS.md with Paymaster details
3. ➡️ Proceed to **Phase 4**: Frontend Providers & Configuration
4. ➡️ Test gasless transactions in the frontend

---

**Configuration Checklist**:

- [ ] CDP account created
- [ ] Paymaster service enabled
- [ ] Policy created for Base Sepolia
- [ ] Contract address whitelisted
- [ ] Rate limits configured (10 per day per user)
- [ ] Spending caps set ($100 monthly)
- [ ] Origin restrictions added
- [ ] Paymaster URL added to .env.local
- [ ] CDP API Key added to .env.local
- [ ] Test transaction successful
- [ ] Monitoring alerts configured
- [ ] Documentation updated

**Last Updated**: 2026-01-22
**Phase**: 3 - Contract Deployment to Base Sepolia
**Subtask**: 3-2 - Configure Coinbase Paymaster policy in CDP dashboard
