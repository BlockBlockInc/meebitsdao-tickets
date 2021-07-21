const { expect } = require("chai");
const { expectRevert } = require("@openzeppelin/test-helpers");

const DUMMY_URI = "ipfs://urlhere";

describe("TicketToken", function () {
  before(async function () {
    this.TicketToken = await ethers.getContractFactory("MeebitsDAOTickets");
  });

  beforeEach(async function () {
    [this.minter, this.addrs1, this.addr2, ...this.addrs] =
      await ethers.getSigners();
    this.achievementToken = await this.TicketToken.deploy();
    await this.achievementToken.deployed();
  });

  it("Should mint a new token with ID that auto increment, incrementing from 1", async function () {
    for (let i = 1; i <= 5; i++) {
      await this.achievementToken["safeMint(address,string)"](
        this.minter.address,
        DUMMY_URI
      );
      expect(
        await this.achievementToken.balanceOf(this.minter.address)
      ).to.equal(i);
    }
    expect(await this.achievementToken.ownerOf(1)).to.equal(
      this.minter.address
    );
    expect(await this.achievementToken.ownerOf(5)).to.equal(
      this.minter.address
    );
    await expectRevert(
      this.achievementToken.ownerOf(6),
      "ERC721: owner query for nonexistent token"
    );
  });

  it("Should return the correct total supply", async function () {
    expect(await this.achievementToken.totalSupply()).to.equal(0);
    for (let i = 1; i <= 5; i++) {
      await this.achievementToken["safeMint(address,string)"](
        this.minter.address,
        DUMMY_URI
      );
      expect(await this.achievementToken.totalSupply()).to.equal(i);
    }
  });

  it("Token owner should be able to burn token", async function () {
    await this.achievementToken["safeMint(address,string)"](
      this.addrs1.address,
      DUMMY_URI
    );
    expect(await this.achievementToken.balanceOf(this.addrs1.address)).to.equal(
      1
    );
    await this.achievementToken.connect(this.addrs1).burn(1);
    expect(await this.achievementToken.balanceOf(this.addrs1.address)).to.equal(
      0
    );
  });

  it("Only token owner should be able to burn token", async function () {
    await this.achievementToken["safeMint(address,string)"](
      this.addrs1.address,
      DUMMY_URI
    );
    await expectRevert(
      this.achievementToken.burn(1),
      "ERC721Burnable: caller is not owner nor approved"
    );
  });

  it("Should mint a new token with a specifed ID after being burned, not effecting total supply", async function () {
    await this.achievementToken["safeMint(address,string)"](
      this.minter.address,
      DUMMY_URI
    );
    expect(await this.achievementToken.totalSupply()).to.equal(1);
    await this.achievementToken.burn(1);
    await this.achievementToken["safeMint(address,uint256,string)"](
      this.minter.address,
      1,
      DUMMY_URI
    );
    expect(await this.achievementToken.ownerOf(1)).to.equal(
      this.minter.address
    );
    expect(await this.achievementToken.totalSupply()).to.equal(1);
  });

  it("Should not be able to mint a token with an ID that hasn't been minted", async function () {
    await expectRevert(
      this.achievementToken["safeMint(address,uint256,string)"](
        this.minter.address,
        5,
        DUMMY_URI
      ),
      "MeebitsDAOTickets: cannot mint a single token that hasn't been minted already"
    );
  });

  it("Should be able to mint tokens, burn and then remint a specific token, then continue minting more tokens", async function () {
    for (let i = 1; i <= 5; i++) {
      await this.achievementToken["safeMint(address,string)"](
        this.minter.address,
        DUMMY_URI
      );
    }
    expect(await this.achievementToken.balanceOf(this.minter.address)).to.equal(
      5
    );
    await this.achievementToken.burn(3);
    expect(await this.achievementToken.balanceOf(this.minter.address)).to.equal(
      4
    );
    await expectRevert(
      this.achievementToken.ownerOf(3),
      "ERC721: owner query for nonexistent token"
    );
    await this.achievementToken["safeMint(address,uint256,string)"](
      this.minter.address,
      3,
      DUMMY_URI
    );
    expect(await this.achievementToken.ownerOf(3)).to.equal(
      this.minter.address
    );
    for (let i = 6; i <= 10; i++) {
      await this.achievementToken["safeMint(address,string)"](
        this.minter.address,
        DUMMY_URI
      );
    }
    expect(await this.achievementToken.balanceOf(this.minter.address)).to.equal(
      10
    );
  });
});
