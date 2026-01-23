// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title KingOfTheBase
 * @notice Social throne game where players compete to become King
 * @dev Simple mechanics: last transaction sender becomes the King
 */
contract KingOfTheBase {
    // ============ State Variables ============

    /// @notice Current king's address
    address public currentKing;

    /// @notice Timestamp when current king's reign started
    uint256 public reignStartTime;

    /// @notice Timestamp when protection period ends (3 seconds after seizing)
    uint256 public protectionEndTime;

    /// @notice King's custom message (max 30 characters)
    string public kingMessage;

    /// @notice Total accumulated reign time per player
    mapping(address => uint256) public totalReignTime;

    // ============ Events ============

    /// @notice Emitted when throne is seized
    /// @param newKing Address of the new king
    /// @param message King's custom message
    /// @param timestamp Block timestamp when throne was seized
    event ThroneSeized(address indexed newKing, string message, uint256 timestamp);

    // ============ Functions ============

    /**
     * @notice Seize the throne and become the new King
     * @param message Custom message to display (max 30 characters)
     * @dev Protection period prevents immediate re-capture (3 seconds)
     */
    function seizeThrone(string calldata message) external {
        require(block.timestamp > protectionEndTime, "Protection active");
        require(bytes(message).length <= 30, "Message too long");

        // Update previous king's total reign time
        if (currentKing != address(0)) {
            totalReignTime[currentKing] += block.timestamp - reignStartTime;
        }

        // Set new king
        currentKing = msg.sender;
        reignStartTime = block.timestamp;
        protectionEndTime = block.timestamp + 3; // 3 seconds protection
        kingMessage = message;

        emit ThroneSeized(msg.sender, message, block.timestamp);
    }

    /**
     * @notice Get current king's data
     * @return king Current king's address
     * @return reignDuration Current reign duration in seconds
     * @return message King's custom message
     * @return isProtected Whether throne is currently protected
     */
    function getKingData() external view returns (
        address king,
        uint256 reignDuration,
        string memory message,
        bool isProtected
    ) {
        king = currentKing;
        reignDuration = currentKing != address(0) ? block.timestamp - reignStartTime : 0;
        message = kingMessage;
        isProtected = block.timestamp <= protectionEndTime;
    }

    /**
     * @notice Get leaderboard data for specified players
     * @param players Array of player addresses to query
     * @return times Array of total reign times (includes current reign if player is king)
     */
    function getLeaderboard(address[] calldata players) external view returns (uint256[] memory times) {
        times = new uint256[](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            times[i] = totalReignTime[players[i]];
            // Add current reign time if player is the current king
            if (players[i] == currentKing) {
                times[i] += block.timestamp - reignStartTime;
            }
        }
        return times;
    }
}
