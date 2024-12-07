// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EventContract.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FactoryContract is Ownable {
    // Stores the addresses of deployed event contracts
    address[] public events;

    event EventDeployed(address indexed eventAddress, address indexed algorithmContract);

    /**
     * @notice Deploy a new EventContract and link it to an AlgorithmContract
     * @param name Name of the NFT
     * @param symbol Symbol of the NFT
     * @param ticketPrice Price of a single ticket
     * @param maxResalePrice Maximum allowed resale price
     * @param royaltyReceiver Receiver of royalty fees
     * @param royaltyFeeNumerator Royalty fee (in basis points)
     * @param baseTokenURI Base URI for ticket metadata
     * @param minFanScore Minimum fan score to purchase tickets
     * @param totalTickets Total tickets available for the event
     * @param stakeAmount Amount users need to stake to apply
     * @param algorithmContractAddress Address of the AlgorithmContract to use for fan scores
     */
    function createEvent(
        string memory name,
        string memory symbol,
        uint256 ticketPrice,
        uint256 maxResalePrice,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator,
        string memory baseTokenURI,
        uint256 minFanScore,
        uint256 totalTickets,
        uint256 stakeAmount,
        address algorithmContractAddress
    ) external onlyOwner returns (address) {
        EventContract newEvent = new EventContract(
            name,
            symbol,
            ticketPrice,
            maxResalePrice,
            royaltyReceiver,
            royaltyFeeNumerator,
            baseTokenURI,
            minFanScore,
            totalTickets,
            stakeAmount,
            algorithmContractAddress
        );

        newEvent.transferOwnership(msg.sender); // The factory sets the event's owner to the factory's owner (the organizer)
        events.push(address(newEvent));

        emit EventDeployed(address(newEvent), algorithmContractAddress);
        return address(newEvent);
    }

    /**
     * @notice Get the total number of events deployed
     */
    function getEventsCount() external view returns (uint256) {
        return events.length;
    }
}
