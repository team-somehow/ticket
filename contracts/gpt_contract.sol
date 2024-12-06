// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contracts
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.2/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.2/contracts/token/common/ERC2981.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.2/contracts/access/Ownable.sol";

// Abstract contract
contract TicketProtocol is ERC721URIStorage, ERC2981, Ownable {
    // State variables
    uint256 public tokenCounter; // Tracks ticket IDs
    uint256 public ticketPrice; // Price of a single ticket
    uint256 public maxResalePrice; // Maximum allowed resale price
    uint256 public minFanScore; // Minimum fan score to purchase tickets
    string public baseTokenURI; // Base URI for ticket metadata
    uint256 public totalTickets; // Total tickets available for the event
    uint256 public stakeAmount; // Amount users need to stake to apply
    address[] public applicantsList;


    // Mappings
    mapping(address => uint256) public fanScores; // Maps fan scores to user addresses
    mapping(uint256 => bool) public usedTickets; // Tracks used tickets by ID
    mapping(address => bool) public hasStaked; // Tracks if a user has staked
    mapping(address => bool) public hasApplied; // Tracks if a user has applied
    mapping(address => bool) public isQualified; // Tracks if a user is qualified for an NFT

    // Events
    event FanScoreSet(address indexed user, uint256 score);
    event StakeReceived(address indexed user, uint256 amount);
    event UserQualified(address indexed user);
    event TicketMinted(address indexed owner, uint256 indexed tokenId);
    event TicketUsed(uint256 indexed tokenId, address indexed user);
    event RefundProcessed(address indexed user, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _ticketPrice,
        uint256 _maxResalePrice,
        address _royaltyReceiver,
        uint96 _royaltyFeeNumerator,
        string memory _baseTokenURI,
        uint256 _minFanScore,
        uint256 _totalTickets,
        uint256 _stakeAmount
    ) ERC721(name, symbol) ERC2981() {
        tokenCounter = 0;
        ticketPrice = _ticketPrice;
        maxResalePrice = _maxResalePrice;
        baseTokenURI = _baseTokenURI;
        minFanScore = _minFanScore;
        totalTickets = _totalTickets;
        stakeAmount = _stakeAmount;

        // Set royalty information
        _setDefaultRoyalty(_royaltyReceiver, _royaltyFeeNumerator);
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
     * @notice Stake an amount and confirm the user's application
     */
    function stakeAndApply() external payable {
        require(msg.value >= stakeAmount, "Insufficient staking amount");
        require(!hasStaked[msg.sender], "Already staked");
        require(!hasApplied[msg.sender], "Already applied");

        hasStaked[msg.sender] = true;
        hasApplied[msg.sender] = true;

        // Add the applicant to the list
        applicantsList.push(msg.sender);

        emit StakeReceived(msg.sender, msg.value);
    }


    function distributeTickets() external onlyOwner {
        require(totalTickets > 0, "No tickets available");

        uint256 actualApplicantsCount = applicantsList.length;
        require(actualApplicantsCount > 0, "No applicants");

        // Create an array to hold valid applicants
        address[] memory validApplicants = new address[](actualApplicantsCount);
        uint256 validCount = 0;

        // Collect valid applicants who have staked and meet the minimum fan score
        for (uint256 i = 0; i < actualApplicantsCount; i++) {
            address applicant = applicantsList[i];
            if (hasStaked[applicant] && fanScores[applicant] >= minFanScore) {
                validApplicants[validCount] = applicant;
                validCount++;
            }
        }

        require(validCount > 0, "No valid applicants");

        // Sort valid applicants by fan score (descending order)
        for (uint256 i = 0; i < validCount - 1; i++) {
            for (uint256 j = i + 1; j < validCount; j++) {
                if (fanScores[validApplicants[j]] > fanScores[validApplicants[i]]) {
                    address temp = validApplicants[i];
                    validApplicants[i] = validApplicants[j];
                    validApplicants[j] = temp;
                }
            }
        }

        // Distribute tickets to the top fans
        uint256 numNFTsToMint = totalTickets < validCount ? totalTickets : validCount;
        for (uint256 i = 0; i < numNFTsToMint; i++) {
            address topFan = validApplicants[i];
            isQualified[topFan] = true;

            uint256 tokenId = tokenCounter;
            _safeMint(topFan, tokenId);
            _setTokenURI(tokenId, baseTokenURI);
            tokenCounter++;

            emit TicketMinted(topFan, tokenId);
            emit UserQualified(topFan);
        }

        // Refund remaining valid applicants who didn't receive tickets
        for (uint256 i = numNFTsToMint; i < validCount; i++) {
            address nonQualifiedFan = validApplicants[i];
            if (hasStaked[nonQualifiedFan]) {
                payable(nonQualifiedFan).transfer(stakeAmount);
                hasStaked[nonQualifiedFan] = false;

                emit RefundProcessed(nonQualifiedFan, stakeAmount);
            }
        }

        // Refund invalid applicants (those who didn't meet the minimum fan score)
        for (uint256 i = 0; i < actualApplicantsCount; i++) {
            address applicant = applicantsList[i];
            if (!hasStaked[applicant]) continue;
            bool isValid = false;
            for (uint256 j = 0; j < validCount; j++) {
                if (validApplicants[j] == applicant) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                payable(applicant).transfer(stakeAmount);
                hasStaked[applicant] = false;

                emit RefundProcessed(applicant, stakeAmount);
            }
        }

        // Clear the applicants list for future events
        delete applicantsList;

        // Mark the event as closed
        totalTickets = 0;
    }

    /**
     * @notice Resell a ticket with price enforcement and royalty payment
     * @param from The current owner of the NFT
     * @param to The new owner of the NFT
     * @param tokenId The ticket's unique ID
     * @param salePrice The price at which the ticket is sold
     */
    function safeTransferWhileEnforcingPrice(
        address from,
        address to,
        uint256 tokenId,
        uint256 salePrice
    ) public payable {
        require(salePrice <= maxResalePrice, "Sale price exceeds maximum allowed");
        require(msg.value >= salePrice, "Insufficient payment");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");

        // Transfer the NFT
        _safeTransfer(from, to, tokenId, "");

        // Handle royalty payment
        (address receiver, uint256 royaltyAmount) = royaltyInfo(tokenId, salePrice);
        if (royaltyAmount > 0) {
            payable(receiver).transfer(royaltyAmount);
        }

        // Transfer sale amount minus royalty to the seller
        payable(from).transfer(salePrice - royaltyAmount);

        // Refund any excess payment
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }
    }

    /**
     * @notice Mark a ticket as used for event entry
     * @param tokenId The ticket's unique ID
     */
    function useTicket(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You do not own this ticket");
        require(!usedTickets[tokenId], "Ticket already used");

        usedTickets[tokenId] = true;

        emit TicketUsed(tokenId, msg.sender);
    }

    /**
     * @notice Withdraw contract balance to the owner's address
     */
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @notice Override to include ERC-2981 support
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Override to include ERC-2981 support
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
}

