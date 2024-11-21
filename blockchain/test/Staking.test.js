const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contract", function () {
  let stakingToken;
  let rewardToken;
  let staking;
  let owner;
  let addr1;
  let addr2;
  let rewardAmount = ethers.parseEther("100"); // 100 RWT rewards

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy RewardToken (RWT)
    const RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy(1000); // Mint 1000 RWT
    await rewardToken.waitForDeployment();

    // Deploy StakeToken (sSTK) (Liquid Staking Token)
    const StakeToken = await ethers.getContractFactory("StakeToken");
    stakingToken = await StakeToken.deploy(1000); // Mint 1000 STK tokens
    await stakingToken.waitForDeployment();

    // Deploy Staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(stakingToken.target, rewardToken.target);
    await staking.waitForDeployment();

    // Transfer some RWT tokens to users for rewards
    await rewardToken.transfer(staking.target, rewardAmount);

     // **Distribute staking tokens to non-owner accounts**
     const transferAmount = ethers.parseEther("50"); // 50 tokens
     await stakingToken.transfer(addr1.address, transferAmount);
     await stakingToken.transfer(addr2.address, transferAmount);

     // Transfer rewards to the staking contract
    await rewardToken.transfer(staking.address, ethers.utils.parseEther("100"));
  });

  describe("Staking functionality", function () {
    it("Should allow a user to stake tokens", async function () {
      const stakeAmount = ethers.parseEther("10");

      // Approve and stake tokens
      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Check that the user's staked balance is updated
      expect(await staking.stakedBalance(addr1.target)).to.equal(stakeAmount);
    });

    it("Should update total staked tokens after staking", async function () {
      const stakeAmount = ethers.parseEther("10");

      // Approve and stake tokens
      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Check total staked tokens
      expect(await staking.totalStakedTokens()).to.equal(stakeAmount);
    });

    it("Should allow a user to withdraw staked tokens", async function () {
      const stakeAmount = ethers.parseEther("10");
      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Withdraw staked tokens
      await staking.connect(addr1).withdrawStakedTokens(stakeAmount);

      // Check that the user's staked balance is zero
      expect(await staking.stakedBalance(addr1.address)).to.equal(0);
    });

    it("Should fail to withdraw more than the staked amount", async function () {
      const stakeAmount = ethers.parseEther("10");
      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Try to withdraw more than the staked amount
      await expect(staking.connect(addr1).withdrawStakedTokens(stakeAmount.add(1)))
        .to.be.revertedWith("Staked amount not enough");
    });
  });

  describe("Reward functionality", function () {
    it("Should allow users to claim rewards", async function () {
      const stakeAmount = ethers.parseEther("10");
      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Move time forward by a reward period to trigger reward claim
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); // 7 days
      await ethers.provider.send("evm_mine", []);

      // Claim rewards
      await staking.connect(addr1).getReward();

      // Check if rewards were transferred
      expect(await rewardToken.balanceOf(addr1.address)).to.equal(rewardAmount);
    });

    it("Should fail to claim rewards if no rewards are available", async function () {
      await expect(staking.connect(addr1).getReward())
        .to.be.revertedWith("No rewards to claim");
    });
  });

  describe("Reward Per Token Calculation", function () {
    it("Should calculate rewards correctly over time", async function () {
      const stakeAmount = ethers.parseEther("10");
      await stakingToken.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Move time forward by a part of the reward period
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]); // 3 days
      await ethers.provider.send("evm_mine", []);

      const earnedBefore = await staking.earned(addr1.address);

      // Claim rewards
      await staking.connect(addr1).getReward();

      const earnedAfter = await staking.earned(addr1.address);

      // Assert that rewards are calculated
      expect(earnedBefore).to.be.below(earnedAfter);
    });
  });
});
