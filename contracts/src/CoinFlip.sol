// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CoinFlip - A simple coin flip game for Base
/// @notice Each flip is an onchain transaction, tracking streaks and leaderboard
/// @dev Uses block-based pseudo-randomness (acceptable for non-monetary game)
contract CoinFlip {

    struct PlayerStats {
        uint256 wins;
        uint256 losses;
        uint256 currentStreak;
        uint256 maxStreak;
        uint256 totalFlips;
        uint256 lastFlipBlock;
    }

    struct LeaderboardEntry {
        address player;
        uint256 maxStreak;
    }

    // Player statistics
    mapping(address => PlayerStats) public playerStats;

    // Leaderboard tracking
    address[] public leaderboardPlayers;
    mapping(address => bool) public isOnLeaderboard;
    uint256 public constant LEADERBOARD_SIZE = 10;

    // Events
    event FlipResult(
        address indexed player,
        bool guessedHeads,
        bool wasHeads,
        bool won,
        uint256 currentStreak,
        uint256 maxStreak
    );

    event NewHighScore(address indexed player, uint256 maxStreak);

    /// @notice Flip the coin and guess the result
    /// @param guessHeads True if guessing heads, false if guessing tails
    /// @return won Whether the guess was correct
    /// @return wasHeads The actual coin result (true = heads)
    function flip(bool guessHeads) external returns (bool won, bool wasHeads) {
        PlayerStats storage stats = playerStats[msg.sender];

        // Prevent multiple flips in same block (front-running protection)
        require(stats.lastFlipBlock < block.number, "Wait for next block");

        // Generate pseudo-random result based on block data
        // Note: This is predictable by miners but acceptable for a non-monetary game
        wasHeads = _generateRandomResult(msg.sender);
        won = (guessHeads == wasHeads);

        // Update statistics
        stats.totalFlips++;
        stats.lastFlipBlock = block.number;

        if (won) {
            stats.wins++;
            stats.currentStreak++;

            // Check for new personal best
            if (stats.currentStreak > stats.maxStreak) {
                stats.maxStreak = stats.currentStreak;
                _updateLeaderboard(msg.sender, stats.maxStreak);
                emit NewHighScore(msg.sender, stats.maxStreak);
            }
        } else {
            stats.losses++;
            stats.currentStreak = 0;
        }

        emit FlipResult(
            msg.sender,
            guessHeads,
            wasHeads,
            won,
            stats.currentStreak,
            stats.maxStreak
        );

        return (won, wasHeads);
    }

    /// @notice Get player statistics
    /// @param player The player address
    /// @return wins Number of wins
    /// @return losses Number of losses
    /// @return currentStreak Current winning streak
    /// @return maxStreak Best winning streak ever
    /// @return totalFlips Total number of flips
    function getPlayerStats(address player) external view returns (
        uint256 wins,
        uint256 losses,
        uint256 currentStreak,
        uint256 maxStreak,
        uint256 totalFlips
    ) {
        PlayerStats storage stats = playerStats[player];
        return (
            stats.wins,
            stats.losses,
            stats.currentStreak,
            stats.maxStreak,
            stats.totalFlips
        );
    }

    /// @notice Get the leaderboard (top players by max streak)
    /// @return entries Array of leaderboard entries
    function getLeaderboard() external view returns (LeaderboardEntry[] memory entries) {
        uint256 count = leaderboardPlayers.length;
        entries = new LeaderboardEntry[](count);

        for (uint256 i = 0; i < count; i++) {
            address player = leaderboardPlayers[i];
            entries[i] = LeaderboardEntry({
                player: player,
                maxStreak: playerStats[player].maxStreak
            });
        }

        // Sort by maxStreak descending (bubble sort - fine for small array)
        for (uint256 i = 0; i < count; i++) {
            for (uint256 j = i + 1; j < count; j++) {
                if (entries[j].maxStreak > entries[i].maxStreak) {
                    LeaderboardEntry memory temp = entries[i];
                    entries[i] = entries[j];
                    entries[j] = temp;
                }
            }
        }

        return entries;
    }

    /// @notice Get leaderboard size
    /// @return Number of players on leaderboard
    function getLeaderboardSize() external view returns (uint256) {
        return leaderboardPlayers.length;
    }

    /// @dev Generate pseudo-random boolean result
    /// @param player The player address (adds uniqueness)
    /// @return True for heads, false for tails
    function _generateRandomResult(address player) private view returns (bool) {
        // Combine multiple sources of entropy
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    block.prevrandao,
                    player,
                    playerStats[player].totalFlips
                )
            )
        );

        return randomNumber % 2 == 0;
    }

    /// @dev Update leaderboard with new high score
    /// @param player The player address
    /// @param newMaxStreak The new max streak
    function _updateLeaderboard(address player, uint256 newMaxStreak) private {
        // If player already on leaderboard, they're already tracked
        if (isOnLeaderboard[player]) {
            return;
        }

        // If leaderboard not full, just add
        if (leaderboardPlayers.length < LEADERBOARD_SIZE) {
            leaderboardPlayers.push(player);
            isOnLeaderboard[player] = true;
            return;
        }

        // Find the player with lowest max streak
        uint256 lowestIndex = 0;
        uint256 lowestStreak = playerStats[leaderboardPlayers[0]].maxStreak;

        for (uint256 i = 1; i < leaderboardPlayers.length; i++) {
            uint256 streak = playerStats[leaderboardPlayers[i]].maxStreak;
            if (streak < lowestStreak) {
                lowestStreak = streak;
                lowestIndex = i;
            }
        }

        // Replace if new score is higher
        if (newMaxStreak > lowestStreak) {
            address oldPlayer = leaderboardPlayers[lowestIndex];
            isOnLeaderboard[oldPlayer] = false;

            leaderboardPlayers[lowestIndex] = player;
            isOnLeaderboard[player] = true;
        }
    }
}
