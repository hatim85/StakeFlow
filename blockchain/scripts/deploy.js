const hre = require("hardhat");

async function main() {

  // // Deploy RewardXFI
  console.log("Deploying RewardXFI...");
  const RewardXFI = await hre.ethers.getContractFactory("RewardXFI");
  const rewardXFI = await RewardXFI.deploy(1000000); // Initial supply as 1,000,000
  await rewardXFI.waitForDeployment();
  console.log("RewardXFI deployed to:", rewardXFI.target);

  // Deploy StakeXFI
  console.log("Deploying StakeXFI...");
  const StakeXFI = await hre.ethers.getContractFactory("StakeXFI");
  const stakeXFI = await StakeXFI.deploy(); // Initial supply as 500,000
  await stakeXFI.waitForDeployment();
  console.log("StakeXFI deployed to:", stakeXFI.target);

  // Deploy Staking Contract
  console.log("Deploying Staking Contract...");
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(rewardXFI.target, stakeXFI.target, (await hre.ethers.getSigners())[0].address);
  await staking.waitForDeployment();
  console.log("Staking Contract deployed to:", staking.target);

  // Approve the Staking contract to spend RewardXFI tokens (assuming staking contract requires this for unstaking)
  console.log("Approving Staking contract to spend RewardXFI...");
  const signer = (await hre.ethers.getSigners())[0]; // Get the first signer (deployer)

  const rewardXFIAllowanceTx = await rewardXFI.connect(signer).approve(staking.target, 1000000); // Approve full supply
  await rewardXFIAllowanceTx.wait(); // Wait for transaction to be mined
  console.log(`Approved Staking contract to spend RewardXFI tokens`);

  // Approve the Staking contract to spend StakeXFI tokens
  console.log("Approving Staking contract to spend StakeXFI...");
  const stakeXFIAllowanceTx = await stakeXFI.connect(signer).approve(staking.target, 500000); // Approve full supply
  await stakeXFIAllowanceTx.wait(); // Wait for transaction to be mined
  console.log(`Approved Staking contract to spend StakeXFI tokens`);

  console.log("\nDeployment Summary:");
  console.log("RewardXFI target:", rewardXFI.target);
  console.log("StakeXFI target:", stakeXFI.target);
  console.log("Staking target:", staking.target);
}

// Catch errors and run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
