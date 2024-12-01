import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CommunityLedger", function () {
  async function deployContract() {
    const [manager, resident] = await ethers.getSigners();
    const CommunityLedger = await ethers.getContractFactory("CommunityLedger");
    const communityLedger = await CommunityLedger.deploy();
    return { communityLedger, manager, resident };
  }

  it("should set the residences correctly", async function () {
    const { communityLedger } = await loadFixture(deployContract);
    expect(await communityLedger.isResidence(1201)).to.equal(true);
  });

  it("should set the residents correctly", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.addResident(resident.address, 1201);
    expect(await communityLedger.isResident(resident.address)).to.equal(true);
  });

  it("should NOT set the residents correctly if not manager", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    const instance = communityLedger.connect(resident);
    await expect(
      instance.addResident(resident.address, 1201)
    ).to.be.revertedWith("Only manager or counselor can call this function");
  });

  it("should NOT set the residents correctly if not residence", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await expect(
      communityLedger.addResident(resident.address, 1205)
    ).to.be.revertedWith("Residence does not exist");
  });

  it("should remove the residents correctly", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.addResident(resident.address, 1201);
    await communityLedger.removeResident(resident.address);
    expect(await communityLedger.isResident(resident.address)).to.equal(false);
  });

  it("should NOT remove the residents correctly if not manager", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.addResident(resident.address, 1201);
    const instance = communityLedger.connect(resident);
    await expect(instance.removeResident(resident.address)).to.be.revertedWith(
      "Only manager can call this function"
    );
  });

  it("should NOT remove residents that are counselors", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.addResident(resident.address, 1201);
    await communityLedger.setCounselor(resident.address, true);
    await expect(
      communityLedger.removeResident(resident.address)
    ).to.be.revertedWith("Resident is a counselor");
  });

  it("should set the counselors correctly", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.addResident(resident.address, 1201);
    await communityLedger.setCounselor(resident.address, true);
    expect(await communityLedger.isCounselor(resident.address)).to.equal(true);
  });

  it("should NOT set the counselors correctly if not manager", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.addResident(resident.address, 1201);
    const instance = communityLedger.connect(resident);
    await expect(
      instance.setCounselor(resident.address, true)
    ).to.be.revertedWith("Only manager can call this function");
  });

  it("should NOT set the counselors correctly if not resident", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await expect(
      communityLedger.setCounselor(resident.address, true)
    ).to.be.revertedWith("The counselor must be a resident");
  });

  it("should change the manager correctly", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.setManager(resident.address);
    expect(await communityLedger.manager()).to.equal(resident.address);
  });

  it("should NOT change the manager correctly if not manager", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    const instance = communityLedger.connect(resident);
    await expect(instance.setManager(resident.address)).to.be.revertedWith(
      "Only manager can call this function"
    );
  });

  it("should NOT change the manager to the zero address", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await expect(
      communityLedger.setManager(ethers.ZeroAddress)
    ).to.be.revertedWith("Manager cannot be the zero address");
  });

  it("should create a proposal correctly if manager", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.createProposal(
      "Test Proposal",
      "This is a test proposal"
    );
    expect(await communityLedger.isProposal("Test Proposal")).to.equal(true);
  });

  it("should create a proposal correctly if resident", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.addResident(resident.address, 1201);
    const instance = communityLedger.connect(resident);
    await instance.createProposal("Test Proposal", "This is a test proposal");
    expect(await communityLedger.isProposal("Test Proposal")).to.equal(true);
  });

  it("should NOT create a proposal if not resident", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    const instance = communityLedger.connect(resident);
    await expect(
      instance.createProposal("Test Proposal", "This is a test proposal")
    ).to.be.revertedWith("Only manager or resident can call this function");
  });

  it("should NOT create a proposal if already exists", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.createProposal(
      "Test Proposal",
      "This is a test proposal"
    );
    await expect(
      communityLedger.createProposal("Test Proposal", "This is a test proposal")
    ).to.be.revertedWith("Proposal already exists");
  });

  it("should remove a proposal correctly", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.createProposal(
      "Test Proposal",
      "This is a test proposal"
    );
    await communityLedger.removeProposal("Test Proposal");
    expect(await communityLedger.isProposal("Test Proposal")).to.equal(false);
  });

  it("should NOT remove a proposal if not manager", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await communityLedger.createProposal(
      "Test Proposal",
      "This is a test proposal"
    );
    const instance = communityLedger.connect(resident);
    await expect(instance.removeProposal("Test Proposal")).to.be.revertedWith(
      "Only manager can call this function"
    );
  });

  it("should NOT remove a proposal if not exists", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    await expect(
      communityLedger.removeProposal("Test Proposal")
    ).to.be.revertedWith("Proposal does not exist");
  });
});
