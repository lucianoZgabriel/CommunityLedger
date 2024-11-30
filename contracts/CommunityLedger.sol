// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract CommunityLedger {
    address public manager;
    mapping(uint16 => bool) public residences;
    mapping(address => uint16) public residents;
    mapping(address => bool) public counselors;

    enum VoteStatus {
        PENDING,
        VOTING,
        APPROVED,
        REJECTED
    }

    struct Proposal {
        string title;
        string description;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 endDate;
        VoteStatus status;
    }

    mapping(bytes32 => Proposal) public proposals;

    constructor() {
        manager = msg.sender;

        for (uint16 i = 1; i <= 24; i++) {
            for (uint8 j = 1; j <= 4; j++) {
                residences[i * 100 + j] = true;
            }
        }
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    modifier onlyCouncil() {
        require(
            msg.sender == manager || isCounselor(msg.sender),
            "Only manager or counselor can call this function"
        );
        _;
    }

    modifier onlyResident() {
        require(
            msg.sender == manager || isResident(msg.sender),
            "Only manager or resident can call this function"
        );
        _;
    }

    function isResident(address user) public view returns (bool) {
        return residents[user] > 0;
    }

    function isCounselor(address user) public view returns (bool) {
        return counselors[user];
    }

    function isResidence(uint16 residence) public view returns (bool) {
        return residences[residence];
    }

    function addResident(
        address resident,
        uint16 residence
    ) external onlyCouncil {
        require(isResidence(residence), "Residence does not exist");
        residents[resident] = residence;
    }

    function removeResident(address resident) external onlyManager {
        require(!isCounselor(resident), "Resident is a counselor");
        delete residents[resident];

        if (counselors[resident]) {
            delete counselors[resident];
        }
    }

    function setCounselor(
        address resident,
        bool isEntering
    ) external onlyManager {
        if (isEntering) {
            require(isResident(resident), "The counselor must be a resident");
            counselors[resident] = true;
        } else {
            delete counselors[resident];
        }
    }

    function setManager(address newManager) external onlyManager {
        require(newManager != address(0), "Manager cannot be the zero address");
        manager = newManager;
    }

    function getProposal(
        string memory title
    ) public view returns (Proposal memory) {
        bytes32 proposalId = keccak256(bytes(title));
        return proposals[proposalId];
    }

    function isProposal(string memory title) public view returns (bool) {
        return getProposal(title).createdAt > 0;
    }

    function createProposal(
        string memory title,
        string memory description
    ) external onlyResident {
        require(!isProposal(title), "Proposal already exists");

        Proposal memory newProposal = Proposal({
            title: title,
            description: description,
            createdAt: block.timestamp,
            updatedAt: 0,
            endDate: 0,
            status: VoteStatus.PENDING
        });

        bytes32 proposalId = keccak256(bytes(title));
        proposals[proposalId] = newProposal;
    }

    function removeProposal(string memory title) external onlyManager {
        Proposal memory proposal = getProposal(title);
        require(proposal.createdAt > 0, "Proposal does not exist");
        require(
            proposal.status == VoteStatus.PENDING,
            "Only pending proposals can be removed"
        );

        delete proposals[keccak256(bytes(title))];
    }
}
