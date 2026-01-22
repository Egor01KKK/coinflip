// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/KingOfTheBase.sol";

contract KingOfTheBaseTest is Test {
    KingOfTheBase public game;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);

    event ThroneSeized(address indexed newKing, string message, uint256 timestamp);

    function setUp() public {
        game = new KingOfTheBase();

        // Label addresses for better trace output
        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(charlie, "Charlie");
    }

    // ============ Initial State Tests ============

    function test_InitialState() public {
        assertEq(game.currentKing(), address(0), "Initial king should be zero address");
        assertEq(game.reignStartTime(), 0, "Initial reign start time should be 0");
        assertEq(game.protectionEndTime(), 0, "Initial protection end time should be 0");
        assertEq(game.kingMessage(), "", "Initial message should be empty");
    }

    function test_InitialKingData() public {
        (address king, uint256 reignDuration, string memory message, bool isProtected) = game.getKingData();

        assertEq(king, address(0), "King should be zero address");
        assertEq(reignDuration, 0, "Reign duration should be 0");
        assertEq(message, "", "Message should be empty");
        assertFalse(isProtected, "Throne should not be protected");
    }

    // ============ Seize Throne Tests ============

    function test_SeizeThrone_FirstKing() public {
        string memory message = "I am the first king!";

        vm.expectEmit(true, false, false, true);
        emit ThroneSeized(alice, message, block.timestamp);

        vm.prank(alice);
        game.seizeThrone(message);

        assertEq(game.currentKing(), alice, "Alice should be king");
        assertEq(game.kingMessage(), message, "Message should be set");
        assertEq(game.reignStartTime(), block.timestamp, "Reign start time should be current timestamp");
        assertEq(game.protectionEndTime(), block.timestamp + 3, "Protection should end in 3 seconds");
    }

    function test_SeizeThrone_SuccessiveKings() public {
        // Alice becomes king
        vm.prank(alice);
        game.seizeThrone("Alice rules");

        uint256 aliceStartTime = block.timestamp;

        // Wait 5 seconds (past protection)
        vm.warp(block.timestamp + 5);

        // Bob becomes king
        vm.prank(bob);
        game.seizeThrone("Bob takes over");

        assertEq(game.currentKing(), bob, "Bob should be king");
        assertEq(game.totalReignTime(alice), 5, "Alice should have 5 seconds reign time");
        assertEq(game.kingMessage(), "Bob takes over", "Bob's message should be set");
    }

    function test_SeizeThrone_EmptyMessage() public {
        vm.prank(alice);
        game.seizeThrone("");

        assertEq(game.currentKing(), alice, "Alice should be king");
        assertEq(game.kingMessage(), "", "Message should be empty");
    }

    function test_SeizeThrone_MaxLengthMessage() public {
        string memory maxMessage = "123456789012345678901234567890"; // Exactly 30 characters

        vm.prank(alice);
        game.seizeThrone(maxMessage);

        assertEq(game.kingMessage(), maxMessage, "Max length message should be accepted");
    }

    // ============ Protection Period Tests ============

    function test_RevertWhen_SeizingDuringProtection() public {
        // Alice becomes king
        vm.prank(alice);
        game.seizeThrone("Protected");

        // Try to seize immediately (within protection period)
        vm.prank(bob);
        vm.expectRevert("Protection active");
        game.seizeThrone("Too soon");
    }

    function test_SeizeThrone_AfterProtectionExpires() public {
        // Alice becomes king
        vm.prank(alice);
        game.seizeThrone("Alice");

        // Wait exactly 4 seconds (protection is 3 seconds)
        vm.warp(block.timestamp + 4);

        // Bob should be able to seize
        vm.prank(bob);
        game.seizeThrone("Bob");

        assertEq(game.currentKing(), bob, "Bob should be king after protection expires");
    }

    function test_SeizeThrone_ExactlyAfterProtection() public {
        // Alice becomes king at timestamp 1000
        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Alice");

        // Protection ends at 1003, try at 1004
        vm.warp(1004);

        vm.prank(bob);
        game.seizeThrone("Bob");

        assertEq(game.currentKing(), bob, "Bob should be king at timestamp 1004");
    }

    function test_RevertWhen_SeizingAtProtectionEndTime() public {
        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Alice");

        // Try to seize exactly at protection end time (1003)
        vm.warp(1003);

        vm.prank(bob);
        vm.expectRevert("Protection active");
        game.seizeThrone("Bob");
    }

    // ============ Message Validation Tests ============

    function test_RevertWhen_MessageTooLong() public {
        string memory longMessage = "1234567890123456789012345678901"; // 31 characters

        vm.prank(alice);
        vm.expectRevert("Message too long");
        game.seizeThrone(longMessage);
    }

    function test_SeizeThrone_WithUnicodeMessage() public {
        string memory unicodeMessage = "👑 King rules! 🎮";

        // Note: This might be longer than 30 bytes due to UTF-8 encoding
        // Only test if it's within limit
        if (bytes(unicodeMessage).length <= 30) {
            vm.prank(alice);
            game.seizeThrone(unicodeMessage);
            assertEq(game.kingMessage(), unicodeMessage, "Unicode message should be accepted");
        }
    }

    // ============ Reign Time Tests ============

    function test_TotalReignTime_SingleKing() public {
        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Alice");

        // Wait 10 seconds
        vm.warp(1010);

        vm.prank(bob);
        game.seizeThrone("Bob");

        assertEq(game.totalReignTime(alice), 10, "Alice should have 10 seconds total reign time");
        assertEq(game.totalReignTime(bob), 0, "Bob just became king, should have 0 stored time");
    }

    function test_TotalReignTime_MultipleReigns() public {
        vm.warp(1000);

        // Alice reigns for 10 seconds
        vm.prank(alice);
        game.seizeThrone("Alice 1");
        vm.warp(1010);

        // Bob reigns for 5 seconds
        vm.prank(bob);
        game.seizeThrone("Bob 1");
        vm.warp(1015);

        // Alice reigns again for 8 seconds
        vm.prank(alice);
        game.seizeThrone("Alice 2");
        vm.warp(1023);

        // Charlie takes over
        vm.prank(charlie);
        game.seizeThrone("Charlie");

        assertEq(game.totalReignTime(alice), 18, "Alice should have 10 + 8 = 18 seconds");
        assertEq(game.totalReignTime(bob), 5, "Bob should have 5 seconds");
        assertEq(game.totalReignTime(charlie), 0, "Charlie just became king");
    }

    function test_TotalReignTime_NoReign() public {
        vm.prank(alice);
        game.seizeThrone("Alice");

        assertEq(game.totalReignTime(bob), 0, "Bob never reigned, should have 0 time");
    }

    // ============ GetKingData Tests ============

    function test_GetKingData_WithCurrentKing() public {
        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Alice rules");

        vm.warp(1015); // 15 seconds later

        (address king, uint256 reignDuration, string memory message, bool isProtected) = game.getKingData();

        assertEq(king, alice, "King should be Alice");
        assertEq(reignDuration, 15, "Reign duration should be 15 seconds");
        assertEq(message, "Alice rules", "Message should match");
        assertFalse(isProtected, "Should not be protected after 15 seconds");
    }

    function test_GetKingData_ProtectionActive() public {
        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Protected");

        vm.warp(1002); // 2 seconds later (protection is 3 seconds)

        (,, , bool isProtected) = game.getKingData();

        assertTrue(isProtected, "Should be protected within 3 seconds");
    }

    function test_GetKingData_ProtectionExpired() public {
        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Protected");

        vm.warp(1004); // 4 seconds later

        (,, , bool isProtected) = game.getKingData();

        assertFalse(isProtected, "Should not be protected after 3 seconds");
    }

    // ============ GetLeaderboard Tests ============

    function test_GetLeaderboard_EmptyArray() public {
        address[] memory players = new address[](0);
        uint256[] memory times = game.getLeaderboard(players);

        assertEq(times.length, 0, "Should return empty array");
    }

    function test_GetLeaderboard_SinglePlayer() public {
        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Alice");

        vm.warp(1010);
        vm.prank(bob);
        game.seizeThrone("Bob");

        address[] memory players = new address[](1);
        players[0] = alice;

        uint256[] memory times = game.getLeaderboard(players);

        assertEq(times.length, 1, "Should return array of length 1");
        assertEq(times[0], 10, "Alice should have 10 seconds");
    }

    function test_GetLeaderboard_MultiplePlayers() public {
        vm.warp(1000);

        // Alice reigns for 10 seconds
        vm.prank(alice);
        game.seizeThrone("Alice");
        vm.warp(1010);

        // Bob reigns for 5 seconds
        vm.prank(bob);
        game.seizeThrone("Bob");
        vm.warp(1015);

        // Charlie reigns for 8 seconds
        vm.prank(charlie);
        game.seizeThrone("Charlie");
        vm.warp(1023);

        address[] memory players = new address[](3);
        players[0] = alice;
        players[1] = bob;
        players[2] = charlie;

        uint256[] memory times = game.getLeaderboard(players);

        assertEq(times.length, 3, "Should return array of length 3");
        assertEq(times[0], 10, "Alice should have 10 seconds");
        assertEq(times[1], 5, "Bob should have 5 seconds");
        assertEq(times[2], 8, "Charlie should have 8 seconds (current reign)");
    }

    function test_GetLeaderboard_IncludesCurrentKingTime() public {
        vm.warp(1000);

        // Alice reigns for 10 seconds
        vm.prank(alice);
        game.seizeThrone("Alice 1");
        vm.warp(1010);

        // Bob takes over
        vm.prank(bob);
        game.seizeThrone("Bob");
        vm.warp(1015);

        // Alice takes over again
        vm.prank(alice);
        game.seizeThrone("Alice 2");
        vm.warp(1023); // 8 more seconds

        address[] memory players = new address[](2);
        players[0] = alice;
        players[1] = bob;

        uint256[] memory times = game.getLeaderboard(players);

        assertEq(times[0], 18, "Alice should have 10 + 8 = 18 seconds (including current reign)");
        assertEq(times[1], 5, "Bob should have 5 seconds");
    }

    function test_GetLeaderboard_WithNonKings() public {
        vm.prank(alice);
        game.seizeThrone("Alice");

        address[] memory players = new address[](3);
        players[0] = alice;
        players[1] = bob; // Never was king
        players[2] = charlie; // Never was king

        uint256[] memory times = game.getLeaderboard(players);

        assertGt(times[0], 0, "Alice should have time");
        assertEq(times[1], 0, "Bob should have 0 time");
        assertEq(times[2], 0, "Charlie should have 0 time");
    }

    // ============ Edge Case Tests ============

    function test_SamePlayerSeizesMultipleTimes() public {
        vm.warp(1000);

        // Alice becomes king
        vm.prank(alice);
        game.seizeThrone("First");
        vm.warp(1005);

        // Alice seizes again (after protection)
        vm.prank(alice);
        game.seizeThrone("Second");

        // Alice's first reign should be recorded
        assertEq(game.totalReignTime(alice), 5, "First reign time should be recorded");
        assertEq(game.currentKing(), alice, "Alice should still be king");
    }

    function test_ReignTime_AccumulatesCorrectly() public {
        vm.warp(1000);

        // Alice reigns
        vm.prank(alice);
        game.seizeThrone("Alice");
        uint256 aliceStart = block.timestamp;

        vm.warp(1007);

        // Bob reigns
        vm.prank(bob);
        game.seizeThrone("Bob");
        uint256 bobStart = block.timestamp;

        vm.warp(1012);

        // Alice reigns again
        vm.prank(alice);
        game.seizeThrone("Alice again");

        assertEq(game.totalReignTime(alice), 7, "Alice's first reign");
        assertEq(game.totalReignTime(bob), 5, "Bob's reign");
    }

    function test_MultiplePlayersRapidSuccession() public {
        vm.warp(1000);

        address[] memory players = new address[](5);
        for (uint256 i = 0; i < 5; i++) {
            players[i] = address(uint160(i + 1));
        }

        for (uint256 i = 0; i < 5; i++) {
            vm.prank(players[i]);
            game.seizeThrone("King");
            vm.warp(block.timestamp + 10); // Each reigns for 10 seconds
        }

        // Check all players have correct reign time
        for (uint256 i = 0; i < 4; i++) {
            assertEq(game.totalReignTime(players[i]), 10, "Each dethroned player should have 10 seconds");
        }

        // Last player is current king, so has 0 stored time
        assertEq(game.totalReignTime(players[4]), 0, "Current king has 0 stored time");
        assertEq(game.currentKing(), players[4], "Last player should be king");
    }

    // ============ Fuzz Tests ============

    function testFuzz_SeizeThrone_ValidMessage(string calldata message) public {
        vm.assume(bytes(message).length <= 30);

        vm.prank(alice);
        game.seizeThrone(message);

        assertEq(game.currentKing(), alice, "Alice should be king");
        assertEq(game.kingMessage(), message, "Message should match");
    }

    function testFuzz_RevertWhen_MessageTooLong(string calldata message) public {
        vm.assume(bytes(message).length > 30);

        vm.prank(alice);
        vm.expectRevert("Message too long");
        game.seizeThrone(message);
    }

    function testFuzz_TotalReignTime(uint256 reignDuration) public {
        vm.assume(reignDuration > 3 && reignDuration < 365 days);

        vm.warp(1000);
        vm.prank(alice);
        game.seizeThrone("Alice");

        vm.warp(1000 + reignDuration);
        vm.prank(bob);
        game.seizeThrone("Bob");

        assertEq(game.totalReignTime(alice), reignDuration, "Reign time should match");
    }

    function testFuzz_GetLeaderboard_MultipleAddresses(uint8 numPlayers) public {
        vm.assume(numPlayers > 0 && numPlayers <= 50);

        address[] memory players = new address[](numPlayers);
        for (uint256 i = 0; i < numPlayers; i++) {
            players[i] = address(uint160(i + 1));
        }

        uint256[] memory times = game.getLeaderboard(players);

        assertEq(times.length, numPlayers, "Should return correct array length");
    }
}
