# Quick Paymaster Setup Guide

This is a quick reference guide for configuring Coinbase Paymaster for the KingOfTheBase contract.

## Quick Setup (5 minutes)

### 1. Get Contract Address

```bash
# From .env.local or DEPLOYMENT_STATUS.md
CONTRACT_ADDRESS=0x...  # Your deployed KingOfTheBase address
```

### 2. Access CDP Dashboard

🔗 **https://portal.cdp.coinbase.com/**

### 3. Create Paymaster Policy

```yaml
Policy Name: King of the Base - Gasless
Network: Base Sepolia (84532)
Contract: [YOUR_CONTRACT_ADDRESS]
Allowed Methods: seizeThrone(string)
```

### 4. Configure Rate Limits

```yaml
Per-User Limits:
  Daily: 10 transactions
  Hourly: 3 transactions

Global Limits:
  Daily Budget: $10 USD
  Monthly Budget: $100 USD
```

### 5. Get API Credentials

Copy these values from CDP dashboard:

```env
NEXT_PUBLIC_CDP_API_KEY=cdp_key_...
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/...
```

### 6. Update .env.local

```bash
# Add to .env.local
echo "NEXT_PUBLIC_CDP_API_KEY=your_key_here" >> .env.local
echo "NEXT_PUBLIC_PAYMASTER_URL=your_paymaster_url_here" >> .env.local
```

### 7. Test Paymaster

Use CDP dashboard's test tool or deploy frontend and test a transaction.

## Verification

```bash
# Check environment variables
cat .env.local | grep PAYMASTER
cat .env.local | grep CDP_API_KEY

# Expected output:
# NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/...
# NEXT_PUBLIC_CDP_API_KEY=cdp_key_...
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Policy not found | Wait 5-10 mins for propagation |
| Rate limit error | Expected after 10 attempts/day |
| Insufficient balance | Top up Paymaster balance in dashboard |
| Transaction not sponsored | Check `isSponsored={true}` in code |

## Resources

- 📖 Full Guide: [../PAYMASTER_SETUP_GUIDE.md](../PAYMASTER_SETUP_GUIDE.md)
- 🎛️ CDP Dashboard: https://portal.cdp.coinbase.com/
- 📚 CDP Docs: https://docs.cdp.coinbase.com/paymaster

---

**Need Help?** See the full [PAYMASTER_SETUP_GUIDE.md](../PAYMASTER_SETUP_GUIDE.md) for detailed instructions and troubleshooting.
