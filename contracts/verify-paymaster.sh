#!/bin/bash

# Paymaster Configuration Verification Script
# This script verifies that Coinbase Paymaster is properly configured

set -e

echo "=========================================="
echo "Paymaster Configuration Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f "../.env.local" ]; then
    echo -e "${RED}❌ Error: .env.local file not found${NC}"
    echo "   Please create .env.local with Paymaster configuration"
    exit 1
fi

echo "Checking environment variables..."
echo ""

# Check for CDP API Key
if grep -q "NEXT_PUBLIC_CDP_API_KEY=" ../.env.local; then
    CDP_API_KEY=$(grep "NEXT_PUBLIC_CDP_API_KEY=" ../.env.local | cut -d '=' -f2)
    if [ -z "$CDP_API_KEY" ] || [ "$CDP_API_KEY" = "your_cdp_api_key_here" ]; then
        echo -e "${RED}❌ CDP API Key not configured${NC}"
        echo "   Set NEXT_PUBLIC_CDP_API_KEY in .env.local"
        exit 1
    else
        echo -e "${GREEN}✅ CDP API Key found${NC}"
    fi
else
    echo -e "${RED}❌ NEXT_PUBLIC_CDP_API_KEY not found in .env.local${NC}"
    exit 1
fi

# Check for Paymaster URL
if grep -q "NEXT_PUBLIC_PAYMASTER_URL=" ../.env.local; then
    PAYMASTER_URL=$(grep "NEXT_PUBLIC_PAYMASTER_URL=" ../.env.local | cut -d '=' -f2)
    if [ -z "$PAYMASTER_URL" ] || [ "$PAYMASTER_URL" = "https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_KEY" ]; then
        echo -e "${RED}❌ Paymaster URL not configured${NC}"
        echo "   Set NEXT_PUBLIC_PAYMASTER_URL in .env.local"
        exit 1
    else
        echo -e "${GREEN}✅ Paymaster URL found${NC}"

        # Validate URL format
        if [[ $PAYMASTER_URL == https://api.developer.coinbase.com/rpc/v1/* ]]; then
            echo -e "${GREEN}✅ Paymaster URL format is valid${NC}"
        else
            echo -e "${YELLOW}⚠️  Warning: Paymaster URL format looks incorrect${NC}"
            echo "   Expected: https://api.developer.coinbase.com/rpc/v1/..."
            echo "   Got: $PAYMASTER_URL"
        fi
    fi
else
    echo -e "${RED}❌ NEXT_PUBLIC_PAYMASTER_URL not found in .env.local${NC}"
    exit 1
fi

# Check for Contract Address
if grep -q "NEXT_PUBLIC_CONTRACT_ADDRESS=" ../.env.local; then
    CONTRACT_ADDRESS=$(grep "NEXT_PUBLIC_CONTRACT_ADDRESS=" ../.env.local | cut -d '=' -f2)
    if [ -z "$CONTRACT_ADDRESS" ] || [ "$CONTRACT_ADDRESS" = "0x..." ]; then
        echo -e "${YELLOW}⚠️  Warning: Contract address not configured${NC}"
        echo "   Set NEXT_PUBLIC_CONTRACT_ADDRESS after deployment (subtask-3-1)"
    else
        echo -e "${GREEN}✅ Contract address found: $CONTRACT_ADDRESS${NC}"

        # Validate address format
        if [[ $CONTRACT_ADDRESS =~ ^0x[a-fA-F0-9]{40}$ ]]; then
            echo -e "${GREEN}✅ Contract address format is valid${NC}"
        else
            echo -e "${RED}❌ Contract address format is invalid${NC}"
            echo "   Expected: 0x followed by 40 hexadecimal characters"
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Warning: NEXT_PUBLIC_CONTRACT_ADDRESS not found${NC}"
fi

echo ""
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo ""
echo -e "${GREEN}✅ Paymaster environment variables are configured${NC}"
echo ""
echo "Next steps:"
echo "1. Verify policy is active in CDP dashboard:"
echo "   https://portal.cdp.coinbase.com/"
echo ""
echo "2. Test gasless transaction from frontend:"
echo "   npm run dev"
echo ""
echo "3. Check that transactions appear in CDP analytics"
echo ""
echo "4. Verify rate limits are working (max 10 per day per user)"
echo ""
echo -e "${YELLOW}Note: This script only verifies local configuration.${NC}"
echo -e "${YELLOW}You must manually verify policy in CDP dashboard.${NC}"
echo ""

exit 0
