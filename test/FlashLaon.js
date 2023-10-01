const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("FlashLoan", () => {
  let accounts;
  let deployer;
  let token;
  let flashLoan;
  let flashLoanReceiver; // Changed the variable name to match the import

  beforeEach(async () => {
    // Set up Accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    // Deploy the Token contract
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Arnab Developer", "Arnab", tokens(1000000));
    await token.deployed();

    // Deploy the FlashLoan contract
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    flashLoan = await FlashLoan.deploy(token.address);
    await flashLoan.deployed();

    // Approve the FlashLoan contract to spend tokens
    let transaction = await token
      .connect(deployer)
      .approve(flashLoan.address, tokens(1000000));
    await transaction.wait();

    // Deposit tokens into the FlashLoan contract pool
    transaction = await flashLoan
      .connect(deployer)
      .depositeToken(tokens(1000000));
    await transaction.wait();

    // Deploy flashLoanReceiver
    const FlashLoanReceiver = await ethers.getContractFactory(
      "FlashLoanReceiver"
    ); // Import the contract
    flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address);
  });

  describe("Deployment", () => {
    it("Send the Loan to FlashLoan Pool Contract", async () => {
      expect(await token.balanceOf(flashLoan.address)).to.equal(
        tokens(1000000)
      );
    });
  });

  describe("Borrowing Funds", () => {
    it("Borrowing Funds from the Pool", async () => {
      let amounnt = ether(100);
      transaction = await flashLoanReceiver
        .connect(deployer)
        .excuteFlashLoan(amounnt);
      await transaction.wait();
    });
  });
});
