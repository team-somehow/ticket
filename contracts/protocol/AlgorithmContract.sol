// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AlgorithmContract is Ownable {
    // Stores the fan scores
    mapping(address => uint256) public fanScores;

    event FanScoreSet(address indexed user, uint256 score);

    /**
     * @notice Set fan scores for users (only callable by the owner)
     * @param users List of user addresses
     * @param scores Corresponding list of fan scores
     */
    function setFanScores(address[] memory users, uint256[] memory scores) external onlyOwner {
        require(users.length == scores.length, "Mismatched input lengths");

        for (uint256 i = 0; i < users.length; i++) {
            fanScores[users[i]] = scores[i];
            emit FanScoreSet(users[i], scores[i]);
        }
    }

    /**
     * @notice Retrieve a user's fan score
     * @param user Address of the user
     * @return The fan score of the user
     */
    function getFanScore(address user) external view returns (uint256) {
        return fanScores[user];
    }

    /**
     * @notice Placeholder for integration with Spotify OAuth
     * In a real scenario, you'd verify an off-chain flow and then update fanScores accordingly.
     */
    function updateScoreFromSpotifyOAuth(address user, uint256 score) external onlyOwner {
        // Perform logic to validate Spotify OAuth result (off-chain) and then update score
        fanScores[user] = score;
        emit FanScoreSet(user, score);
    }
}
