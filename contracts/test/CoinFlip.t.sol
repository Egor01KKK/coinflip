// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CoinFlip.sol";

contract CoinFlipTest is Test {
    CoinFlip public coinFlip;
    address public player1 = address(0x1);
    address public player2 = address(0x2);

    // Declare event for testing
    event FlipResult(
        address indexed player,
        bool guessedHeads,
        bool wasHeads,
        bool won,
        uint256 currentStreak,
        uint256 maxStreak
    );

    function setUp() public {
        coinFlip = new CoinFlip();
    }

    function test_InitialStats() public view {
        (uint256 wins, uint256 losses, uint256 currentStreak, uint256 maxStreak, uint256 totalFlips) =
            coinFlip.getPlayerStats(player1);

        assertEq(wins, 0);
        assertEq(losses, 0);
        assertEq(currentStreak, 0);
        assertEq(maxStreak, 0);
        assertEq(totalFlips, 0);
    }

    function test_FlipIncrementsTotalFlips() public {
        vm.prank(player1);
        coinFlip.flip(true);

        (, , , , uint256 totalFlips) = coinFlip.getPlayerStats(player1);
        assertEq(totalFlips, 1);
    }

    function test_FlipUpdatesWinsOrLosses() public {
        vm.prank(player1);
        (bool won, ) = coinFlip.flip(true);

        (uint256 wins, uint256 losses, , , ) = coinFlip.getPlayerStats(player1);

        if (won) {
            assertEq(wins, 1);
            assertEq(losses, 0);
        } else {
            assertEq(wins, 0);
            assertEq(losses, 1);
        }
    }

    function test_CannotFlipSameBlock() public {
        vm.prank(player1);
        coinFlip.flip(true);

        vm.prank(player1);
        vm.expectRevert("Wait for next block");
        coinFlip.flip(true);
    }

    function test_CanFlipNextBlock() public {
        vm.prank(player1);
        coinFlip.flip(true);

        vm.roll(block.number + 1);

        vm.prank(player1);
        coinFlip.flip(false);

        (, , , , uint256 totalFlips) = coinFlip.getPlayerStats(player1);
        assertEq(totalFlips, 2);
    }

    function test_StreakResetOnLoss() public {
        // Simulate multiple flips with block advancement
        for (uint256 i = 0; i < 10; i++) {
            vm.roll(block.number + 1);
            vm.prank(player1);
            (bool won, ) = coinFlip.flip(true);

            (, , uint256 currentStreak, , ) = coinFlip.getPlayerStats(player1);

            if (!won) {
                assertEq(currentStreak, 0);
                break;
            }
        }
    }

    function test_MaxStreakTracked() public {
        // Flip many times
        uint256 highestStreak = 0;

        for (uint256 i = 0; i < 20; i++) {
            vm.roll(block.number + 1);
            vm.prank(player1);
            coinFlip.flip(true);

            (, , uint256 currentStreak, uint256 maxStreak, ) = coinFlip.getPlayerStats(player1);

            if (currentStreak > highestStreak) {
                highestStreak = currentStreak;
            }

            assertEq(maxStreak, highestStreak);
        }
    }

    function test_LeaderboardInitiallyEmpty() public view {
        assertEq(coinFlip.getLeaderboardSize(), 0);
    }

    function test_LeaderboardAddsPlayer() public {
        // Need to win to get on leaderboard
        for (uint256 i = 0; i < 50; i++) {
            vm.roll(block.number + 1);
            vm.prank(player1);
            (bool won, ) = coinFlip.flip(true);

            if (won) {
                (, , , uint256 maxStreak, ) = coinFlip.getPlayerStats(player1);
                if (maxStreak > 0) {
                    assertTrue(coinFlip.getLeaderboardSize() > 0);
                    break;
                }
            }
        }
    }

    function test_LeaderboardReturnsCorrectData() public {
        // Player 1 flips
        for (uint256 i = 0; i < 10; i++) {
            vm.roll(block.number + 1);
            vm.prank(player1);
            coinFlip.flip(true);
        }

        CoinFlip.LeaderboardEntry[] memory entries = coinFlip.getLeaderboard();

        if (entries.length > 0) {
            bool foundPlayer1 = false;
            for (uint256 i = 0; i < entries.length; i++) {
                if (entries[i].player == player1) {
                    foundPlayer1 = true;
                    break;
                }
            }
            assertTrue(foundPlayer1);
        }
    }

    function test_EmitFlipResultEvent() public {
        vm.prank(player1);
        vm.expectEmit(true, false, false, false);
        emit FlipResult(player1, true, true, true, 0, 0);
        coinFlip.flip(true);
    }
}
