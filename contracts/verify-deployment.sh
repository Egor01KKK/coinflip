#!/bin/bash
# Verification script to check if KingOfTheBase has been deployed

set -e

echo "🔍 Verifying KingOfTheBase Deployment Status..."
echo ""

# Check if .env.local exists in parent directory
if [ ! -f ../.env.local ]; then
    echo "❌ Error: .env.local not found in project root"
    echo "   Expected location: ../.env.local"
    exit 1
fi

echo "✅ Found .env.local file"

# Extract contract address from .env.local
CONTRACT_ADDRESS=$(grep "^NEXT_PUBLIC_CONTRACT_ADDRESS=" ../.env.local | cut -d '=' -f 2 | tr -d ' "')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ NEXT_PUBLIC_CONTRACT_ADDRESS is not set in .env.local"
    echo ""
    echo "📋 Deployment required:"
    echo "   1. Follow instructions in DEPLOYMENT_GUIDE.md"
    echo "   2. Run: ./deploy.sh"
    echo "   3. Copy the deployed address to ../.env.local"
    exit 1
fi

echo "✅ Contract address found: $CONTRACT_ADDRESS"
echo ""

# Validate address format (should start with 0x and be 42 characters)
if [[ ! $CONTRACT_ADDRESS =~ ^0x[a-fA-F0-9]{40}$ ]]; then
    echo "❌ Invalid contract address format"
    echo "   Expected: 0x followed by 40 hex characters"
    echo "   Got: $CONTRACT_ADDRESS"
    exit 1
fi

echo "✅ Address format is valid"
echo ""

# Try to query the contract on Base Sepolia
echo "🌐 Checking contract on Base Sepolia..."
echo ""

# Use cast to check if contract exists at the address
if command -v cast &> /dev/null; then
    CODE=$(cast code $CONTRACT_ADDRESS --rpc-url https://sepolia.base.org 2>/dev/null || echo "")

    if [ "$CODE" = "0x" ] || [ -z "$CODE" ]; then
        echo "⚠️  Warning: No code found at address $CONTRACT_ADDRESS"
        echo "   Either the contract hasn't been deployed yet, or the address is incorrect"
        echo ""
        echo "   Basescan URL: https://sepolia.basescan.org/address/$CONTRACT_ADDRESS"
        exit 1
    fi

    echo "✅ Contract code found on Base Sepolia"
    echo ""

    # Try to call getKingData to verify it's the correct contract
    echo "📡 Verifying contract interface..."
    KING_DATA=$(cast call $CONTRACT_ADDRESS "getKingData()(address,uint256,string,bool)" --rpc-url https://sepolia.base.org 2>/dev/null || echo "")

    if [ -z "$KING_DATA" ]; then
        echo "⚠️  Warning: Could not call getKingData() function"
        echo "   The contract might not be KingOfTheBase or the RPC is unavailable"
    else
        echo "✅ Contract interface verified (getKingData callable)"
    fi
else
    echo "⚠️  Foundry 'cast' tool not found, skipping on-chain verification"
    echo "   Install Foundry to enable full verification: curl -L https://foundry.paradigm.xyz | bash"
fi

echo ""
echo "📋 Deployment Status Summary:"
echo "────────────────────────────────────────────────────────"
echo "Contract Address:  $CONTRACT_ADDRESS"
echo "Network:           Base Sepolia (Chain ID: 84532)"
echo "Basescan:          https://sepolia.basescan.org/address/$CONTRACT_ADDRESS"
echo ""
echo "✅ Deployment verification complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Visit Basescan URL to verify the contract is verified"
echo "   2. Configure Paymaster in CDP dashboard"
echo "   3. Continue with Phase 4 (Frontend Providers & Configuration)"
echo ""
