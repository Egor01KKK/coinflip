#!/bin/bash

# Load environment variables
source .env

echo "Deploying CoinFlip to Base Sepolia..."

# Deploy to Base Sepolia
forge script script/Deploy.s.sol:DeployCoinFlip \
    --rpc-url $BASE_SEPOLIA_RPC_URL \
    --broadcast \
    --verify \
    -vvvv

echo "Deployment complete!"
echo "Don't forget to update NEXT_PUBLIC_CONTRACT_ADDRESS in the frontend .env"
