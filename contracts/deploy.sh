#!/bin/bash
# Deployment script for KingOfTheBase contract to Base Sepolia

set -e  # Exit on any error

echo "🚀 Deploying KingOfTheBase to Base Sepolia..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with:"
    echo "  PRIVATE_KEY=0x..."
    echo "  BASESCAN_API_KEY=..."
    echo ""
    echo "See DEPLOYMENT_GUIDE.md for details"
    exit 1
fi

# Source environment variables
source .env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env file"
    exit 1
fi

echo "📋 Pre-deployment checks..."
echo ""

# Build contracts
echo "🔨 Building contracts..."
forge build
echo "✅ Build successful"
echo ""

# Run tests
echo "🧪 Running tests..."
forge test -vv
echo "✅ Tests passed"
echo ""

# Deploy
echo "🚀 Deploying to Base Sepolia..."
echo ""

forge script script/Deploy.s.sol \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Copy the contract address from the output above"
echo "  2. Update ../.env.local with NEXT_PUBLIC_CONTRACT_ADDRESS=0x..."
echo "  3. Verify contract on https://sepolia.basescan.org"
echo "  4. Configure Paymaster policy in CDP dashboard"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
