// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IAlgorithmContract {
    function getFanScore(address user) external view returns (uint256);
}

contract EventContract is ERC721URIStorage, ERC2981, Ownable {
    uint256 public tokenCounter;
    uint256 public ticketPrice;
    uint256 public maxResalePrice;
    uint256 public minFanScore;
    string public baseTokenURI;
    uint256 public totalTickets;
    uint256 public stakeAmount;

    // The algorithm contract that provides fan scores
    IAlgorithmContract public algorithmContract;

    address[] public applicantsList;

    mapping(uint256 => bool) public usedTickets; 
    mapping(address => bool) public hasStaked; 
    mapping(address => bool) public hasApplied; 
    mapping(address => bool) public isQualified; 

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
        uint256 _stakeAmount,
        address _algorithmContractAddress
    ) ERC721(name, symbol) {
        ticketPrice = _ticketPrice;
        maxResalePrice = _maxResalePrice;
        baseTokenURI = _baseTokenURI;
        minFanScore = _minFanScore;
        totalTickets = _totalTickets;
        stakeAmount = _stakeAmount;
        algorithmContract = IAlgorithmContract(_algorithmContractAddress);

        _setDefaultRoyalty(_royaltyReceiver, _royaltyFeeNumerator);
    }

    function stakeAndApply() external payable {
        require(msg.value >= stakeAmount, "Insufficient staking amount");
        require(!hasStaked[msg.sender], "Already staked");
        require(!hasApplied[msg.sender], "Already applied");

        hasStaked[msg.sender] = true;
        hasApplied[msg.sender] = true;

        applicantsList.push(msg.sender);

        emit StakeReceived(msg.sender, msg.value);
    }

    function distributeTickets() external onlyOwner {
        require(totalTickets > 0, "No tickets available");
        uint256 actualApplicantsCount = applicantsList.length;
        require(actualApplicantsCount > 0, "No applicants");

        address[] memory validApplicants = new address[](actualApplicantsCount);
        uint256 validCount = 0;

        // Collect valid applicants
        for (uint256 i = 0; i < actualApplicantsCount; i++) {
            address applicant = applicantsList[i];
            if (hasStaked[applicant]) {
                uint256 score = algorithmContract.getFanScore(applicant);
                if (score >= minFanScore) {
                    validApplicants[validCount] = applicant;
                    validCount++;
                }
            }
        }

        require(validCount > 0, "No valid applicants");

        // Sort valid applicants by fan score (descending)
        for (uint256 i = 0; i < validCount - 1; i++) {
            for (uint256 j = i + 1; j < validCount; j++) {
                uint256 scoreI = algorithmContract.getFanScore(validApplicants[i]);
                uint256 scoreJ = algorithmContract.getFanScore(validApplicants[j]);
                if (scoreJ > scoreI) {
                    address temp = validApplicants[i];
                    validApplicants[i] = validApplicants[j];
                    validApplicants[j] = temp;
                }
            }
        }

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

        // Refund those who did not get tickets but were valid
        for (uint256 i = numNFTsToMint; i < validCount; i++) {
            address nonQualifiedFan = validApplicants[i];
            if (hasStaked[nonQualifiedFan]) {
                payable(nonQualifiedFan).transfer(stakeAmount);
                hasStaked[nonQualifiedFan] = false;
                emit RefundProcessed(nonQualifiedFan, stakeAmount);
            }
        }

        // Refund invalid applicants
        for (uint256 i = 0; i < actualApplicantsCount; i++) {
            address applicant = applicantsList[i];
            if (hasStaked[applicant]) {
                // Check if in validApplicants
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
        }

        delete applicantsList;
        totalTickets = 0;
    }

    function useTicket(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You do not own this ticket");
        require(!usedTickets[tokenId], "Ticket already used");

        usedTickets[tokenId] = true;
        emit TicketUsed(tokenId, msg.sender);
    }

    function safeTransferWhileEnforcingPrice(
        address from,
        address to,
        uint256 tokenId,
        uint256 salePrice
    ) public payable {
        require(salePrice <= maxResalePrice, "Sale price exceeds maximum allowed");
        require(msg.value >= salePrice, "Insufficient payment");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");

        _safeTransfer(from, to, tokenId, "");

        (address receiver, uint256 royaltyAmount) = royaltyInfo(tokenId, salePrice);
        if (royaltyAmount > 0) {
            payable(receiver).transfer(royaltyAmount);
        }

        payable(from).transfer(salePrice - royaltyAmount);

        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        address nftOwner = ownerOf(tokenId);
        return (spender == nftOwner || getApproved(tokenId) == spender || isApprovedForAll(nftOwner, spender));
    }
}
