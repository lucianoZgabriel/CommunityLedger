## Table of Contents

- [Community Ledger](#community-ledger)
  - [Project Structure](#project-structure)
  - [Main Features](#main-features)
    - [Resident Management](#resident-management)
    - [Proposal System](#proposal-system)
    - [Voting](#voting)
  - [Prerequisites](#prerequisites)
  - [How to Run](#how-to-run)
  - [Access Control](#access-control)
  - [Usage Example](#usage-example)
    - [Creating and Managing Proposals](#creating-and-managing-proposals)
    - [Voting Process](#voting-process)
    - [Resident Management](#resident-management-1)
  - [Contributing](#contributing)
  - [License](#license)

# Community Ledger

Community Ledger is a smart contract developed in Solidity to manage voting and proposals in a residential community, such as a condominium. The system allows registered residents to create proposals and participate in voting in a transparent and decentralized way.

## Project Structure

The project consists of a smart contract that manages:

- Registration of residents and counselors
- Creation and management of proposals
- Voting system
- Role-based access control (manager, counselors and residents)

## Main Features

### Resident Management

- Registration of new residents
- Assignment of residential units
- Counselor management
- Resident removal

### Proposal System

- Creation of proposals by residents
- Approval/rejection of proposals
- Proposal status tracking
- Removal of pending proposals

### Voting

- Opening and closing of votes
- Vote registration (Yes/No/Abstain)
- Automatic result counting
- Protection against duplicate votes

## Prerequisites

- Node.js (v14+)
- Hardhat or Truffle
- MetaMask or compatible Web3 wallet

## How to Run

1. Clone the repository

```
git clone https://github.com/lucianoZgabriel/CommunityLedger.git
cd CommunityLedger
```

2. Install dependencies

```
npm install
```

3. Compile the contract

```
npx hardhat compile
```

4. Run the tests

```
npx hardhat test
```

5. Deploy the contract

```
npx hardhat run scripts/deploy.ts
```

## Access Control

The system has three access levels:

- **Manager**: Main administrator with full access
- **Counselors**: Can add new residents
- **Residents**: Can create proposals and vote

## Usage Example

Here are some basic examples of how to interact with the contract:

### Creating and Managing Proposals

```javascript
// Create a new proposal
const proposal = await communityLedger.createProposal(
  "Building Painting",
  "Proposal for painting the building facade"
);

// Open voting for the proposal
await communityLedger.openVote("Building Painting");
```

### Voting Process

```javascript
// Cast a vote
// Options: 1 = YES, 2 = NO, 3 = ABSTAIN
await communityLedger.vote("Building Painting", 1);

// Get total votes for a proposal
const totalVotes = await communityLedger.getVotes("Building Painting");

// Close voting and determine result
await communityLedger.closeVote("Building Painting");
```

### Resident Management

```javascript
// Add a new resident (only callable by counselors or manager)
await communityLedger.addResident(residentAddress, residenceNumber);

// Set counselor status (only callable by manager)
await communityLedger.setCounselor(residentAddress, true);
```

## Contributing

Contributions are always welcome! Please read the contribution guide before submitting a pull request.

## License

This project is under MIT license. See the [LICENSE](LICENSE) file for more details.
