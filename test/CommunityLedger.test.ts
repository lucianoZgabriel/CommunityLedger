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

  it("should set the manager correctly", async function () {
    const { communityLedger, manager } = await loadFixture(deployContract);
    expect(await communityLedger.manager()).to.equal(manager.address);
  });

  it("should set the residences correctly", async function () {
    const { communityLedger } = await loadFixture(deployContract);
    expect(await communityLedger.isResidence(1201)).to.equal(true);
  });

  it("should set the residents correctly", async function () {
    const { communityLedger, resident } = await loadFixture(deployContract);
    expect(await communityLedger.isResident(resident.address)).to.equal(true);
  });
});
