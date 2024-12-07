// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
// Chainlink Functions imports (these may change depending on the version you're using)
import {Functions, FunctionsClient} from "@chainlink/functions-dev/0.0.2-dev/src/Functions.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract AlgorithmContract is Ownable, FunctionsClient {
    using Functions for Functions.Request;

    mapping(address => uint256) public fanScores;

    event FanScoreSet(address indexed user, uint256 score);
    event RequestSent(bytes32 indexed requestId);
    event RequestFulfilled(bytes32 indexed requestId, uint256 score);

    // Store pending requests to associate with a user
    mapping(bytes32 => address) public requestIdToUser;

    // Chainlink Functions parameters
    bytes32 public latestRequestId;
    string public spotifyApiEndpoint; // e.g. "https://api.spotify.com/v1/me/top/tracks"
    uint64 public subscriptionId;      // Set your Chainlink Functions subscription ID
    bytes public secrets;              // Encrypted secrets for Spotify token, etc.
    bytes public args;                 // Arguments for the functions request if needed
    uint32 public gasLimit = 300000;   // Fulfillment gas limit

    constructor(address _functionsRouter, uint64 _subscriptionId)
        FunctionsClient(_functionsRouter)
    {
        subscriptionId = _subscriptionId;
    }

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
     * @notice Update score after an off-chain Spotify verification using Chainlink Functions
     * @param user The user to update score for
     *
     * This function will:
     * 1. Create a Chainlink Functions request with embedded JS code to call Spotify API.
     * 2. Send the request to the DON.
     * 3. The DON executes the code and returns a new score.
     * 4. handleOracleFulfillment updates the user's score.
     */
    function calculateFanScoreViaChainlink(address user) external onlyOwner {
        Functions.Request memory req;
        
        // Example JS code:
        // The DON will run this code off-chain.
        // Replace the code with actual logic to:
        //  1. Use your Spotify token (from secrets) to call Spotify API.
        //  2. Parse the response and compute a score.
        //  3. Return that score as a single integer.
        string memory source = string.concat(
            "const axios = require('axios');",
            "const token = secrets.SPOTIFY_TOKEN;", // must be set in encrypted secrets
            "const url = '", spotifyApiEndpoint, "';",
            "axios.get(url, { headers: { Authorization: `Bearer ${token}` }})",
            ".then(response => {",
            "  // Example: Calculate score based on number of top tracks",
            "  const items = response.data.items || [];",
            "  const score = items.length; // simplistic scoring",
            "  return Functions.encodeUint256(score);",
            "})",
            ".catch(error => { return Functions.encodeUint256(0); });"
        );

        req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
        
        // Set args if needed
        // req.addArgs(args); // if you need user-specific parameters

        // Add encrypted secrets if needed
        // Example secrets structure: { "SPOTIFY_TOKEN": "YourTokenHere" }
        req.addSecrets(secrets);

        bytes32 requestId = sendRequest(req, subscriptionId, gasLimit);
        requestIdToUser[requestId] = user;

        emit RequestSent(requestId);
    }

    /**
     * @notice Fulfillment function called by the Chainlink Functions oracle
     * @param requestId The ID of the request
     * @param response The response data (raw bytes)
     * @param err The error message if any
     */
    function handleOracleFulfillment(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        address user = requestIdToUser[requestId];
        delete requestIdToUser[requestId]; // Clean up mapping

        if (err.length > 0) {
            // In case of an error, set some default or handle accordingly
            // For now, we will not update the score if there's an error
            return;
        }

        // Decode the response, which should be a uint256 encoded via Functions.encodeUint256
        uint256 score = abi.decode(response, (uint256));

        // Update fan score on success
        fanScores[user] = score;
        emit FanScoreSet(user, score);
        emit RequestFulfilled(requestId, score);
    }

    /**
     * @notice Update the Spotify endpoint (if needed)
     */
    function setSpotifyApiEndpoint(string memory endpoint) external onlyOwner {
        spotifyApiEndpoint = endpoint;
    }

    /**
     * @notice Update the Chainlink Functions subscription ID
     */
    function setSubscriptionId(uint64 _subscriptionId) external onlyOwner {
        subscriptionId = _subscriptionId;
    }

    /**
     * @notice Update the Chainlink Functions gas limit
     */
    function setGasLimit(uint32 _gasLimit) external onlyOwner {
        gasLimit = _gasLimit;
    }

    /**
     * @notice Update the encrypted secrets blob
     * The secrets must be encrypted with the DON's public key offline.
     */
    function setSecrets(bytes memory _secrets) external onlyOwner {
        secrets = _secrets;
    }

    /**
     * @notice Update arguments to the function if needed
     */
    function setArgs(bytes memory _args) external onlyOwner {
        args = _args;
    }
}
