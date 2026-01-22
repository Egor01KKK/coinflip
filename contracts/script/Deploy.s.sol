// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/KingOfTheBase.sol";

/**
 * @title Deploy Script for KingOfTheBase
 * @notice Foundry script to deploy KingOfTheBase contract to Base Sepolia
 * @dev Usage: forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
 */
contract Deploy is Script {
    function run() external returns (KingOfTheBase) {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        KingOfTheBase kingOfTheBase = new KingOfTheBase();

        // Log the deployed contract address
        console.log("KingOfTheBase deployed to:", address(kingOfTheBase));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Chain ID:", block.chainid);

        // Stop broadcasting
        vm.stopBroadcast();

        return kingOfTheBase;
    }
}
