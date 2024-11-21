// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./RewardXFI.sol";
import "./StakeXFI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    RewardXFI public rwXFIToken;
    StakeXFI public stXFIToken;
    uint256 public rewardPercentage = 10 * 1e18;
    uint256 public constant PCT_MULTIPLIER = 1e18;

    constructor(
        address _rwXFIToken,
        address _stXFIToken,
        address initialOwner
    ) Ownable(initialOwner) {
        rwXFIToken = RewardXFI(_rwXFIToken);
        stXFIToken = StakeXFI(_stXFIToken);
    }

    struct Stake {
        uint256 amount; // Amount of stXFI tokens staked
        uint256 startTime;
        uint256 rewards;
        bool isXFI; // Flag indicating if the stake was made with Xfi
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 indexed amount, bool isXFI);
    event RewardsCalculated(address indexed user, uint256 indexed reward);
    event RewardsClaimed(address indexed user, uint256 indexed reward);
    event Unstaked(address indexed user, uint256 indexed amount, bool isXFI);
    event RewardPercentageUpdated(uint256 newPercentage);

    modifier updateReward(address account) {
        if (stakes[account].amount > 0) {
            uint256 newReward = calculateReward(account);
            stakes[account].rewards = newReward;
            stakes[account].startTime = block.timestamp;
            emit RewardsCalculated(account, newReward);
        }
        _;
    }

    // Stake Xfi, receive stXFI tokens (100 stXFI per 1 Xfi)
    function stake(uint256 amount) external payable updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(msg.value == amount, "Incorrect Xfi value sent");

        // Mint stXFI tokens to the user (100 stXFI per 1 Xfi)
        uint256 stXFIAmount = amount * 100; // Update the exchange rate
        stXFIToken.mint(msg.sender, stXFIAmount);

        // Store staking information
        stakes[msg.sender].amount += stXFIAmount;
        stakes[msg.sender].isXFI = true;

        emit Staked(msg.sender, amount, true);
    }

    // Calculate reward based on stake and time
    function calculateReward(address account) public view returns (uint256) {
        Stake memory stakeData = stakes[account];
        if (stakeData.amount == 0) return stakeData.rewards;

        uint256 duration = block.timestamp - stakeData.startTime;
        uint256 rawReward = (duration * stakeData.amount * rewardPercentage) /
            (100 * PCT_MULTIPLIER);

        uint256 roundedReward = (rawReward + 5e17) / 1e18;

        return roundedReward + stakeData.rewards;
    }

    // Claim rewards
    function claimReward() external updateReward(msg.sender) {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards to claim");

        stakes[msg.sender].rewards = 0;
        rwXFIToken.transfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    function unstake(uint256 stXFIAmount) external updateReward(msg.sender) {
        require(stXFIAmount > 0, "Amount must be greater than zero");
        require(
            stakes[msg.sender].amount >= stXFIAmount,
            "Insufficient staked amount"
        );

        // Deduct staked amount from user's balance
        stakes[msg.sender].amount -= stXFIAmount;

        // Calculate the Xfi amount to return (1 stXFI = 1/100 Xfi)
        uint256 xfiAmount = stXFIAmount / 100;
        require(
            address(this).balance >= xfiAmount,
            "Contract has insufficient Xfi"
        );

        // Burn the staked tokens
        stXFIToken.burn(msg.sender, stXFIAmount);

        // Send Xfi back to the user
        (bool success, ) = payable(msg.sender).call{value: xfiAmount}("");
        require(success, "Xfi transfer failed");

        // Recalculate rewards
        uint256 newReward = calculateReward(msg.sender);
        stakes[msg.sender].rewards = newReward;

        emit Unstaked(msg.sender, stXFIAmount, true);
    }

    // Allow the owner to update the reward percentage
    function updateRewardPercentage(uint256 newPercentage) external onlyOwner {
        rewardPercentage = newPercentage;
        emit RewardPercentageUpdated(newPercentage);
    }

    // Get contract balances for stXFI, rwXFI, and Xfi
    function getContractBalances()
        external
        view
        returns (
            uint256 stXFIBalance,
            uint256 rwXFIBalance,
            uint256 xfiBalance
        )
    {
        stXFIBalance = stXFIToken.balanceOf(address(this));
        rwXFIBalance = rwXFIToken.balanceOf(address(this));
        xfiBalance = address(this).balance;
    }

    // Allow the contract to accept Xfi if needed (for staking xfi)
    receive() external payable {}
}
