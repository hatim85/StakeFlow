import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { STAKING_ABI, STAKING_ADDRESS } from '../utils/config.js'; // Contract ABI and Address
import Ethers from '../utils/Ethers'; // Manages provider, signer, and contract
import WithdrawalSection from './WithdrawalSection';

const Withdrawal = ({ walletAddress }) => {
  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [transferComplete,setTransferComplete]=useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [calculateInProgress, setCalculateInProgress] = useState(false); // Track calculate reward process
  const [claimInProgress, setClaimInProgress] = useState(false); // Track claim reward process
  const { provider, signer, contract } = Ethers();
  const [userAddress, setUserAddress] = useState(null);
  const [calculateButtonVisible, setCalculateButtonVisible] = useState(true); // Track the visibility of the Calculate Rewards button

  useEffect(() => {
    // Fetch user's address and staking data
    const fetchUserData = async () => {
      try {
        const address = await signer.getAddress();
        setUserAddress(address);

        // Fetch user's staking and reward data
        const stakeData = await contract.stakes(address);
        setStakedAmount(ethers.utils.formatUnits(stakeData.amount, 18)); // Assuming 18 decimals for stXFI
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (signer) {
      fetchUserData();
    }
  }, [signer, contract]);

  
  
  const handleClaimRewards = async () => {
    setClaimInProgress(true);
    setCalculateButtonVisible(false); // Hide "Calculate Rewards" after claiming
  
    try {
      const tx = await contract.claimReward();
      await tx.wait(); // Wait for the transaction to be mined
      alert("Rewards claimed successfully!");
  
      // Refresh user's staking and reward data
      const stakeData = await contract.stakes(userAddress);
      setRewardAmount(ethers.utils.formatUnits(stakeData.rewards, 18)); // Updated rewards
      
      // Show the Calculate Rewards button after claim is completed
      setCalculateButtonVisible(true);
      setTransferComplete(false);

    } catch (error) {
      console.error("Error claiming rewards:", error);
      alert("An error occurred while claiming rewards.");
    } finally {
      setClaimInProgress(false);
    }
  };  

  // Handle Calculate Rewards
  const calculateRewards = async (e) => {
    e.preventDefault();
    if (!contract || !walletAddress) {
      alert("Please connect your wallet to calculate rewards!");
      return;
    }

    setCalculateInProgress(true); // Start calculating

    try {
      const rewards = await contract.calculateReward(walletAddress);
      console.log("Raw Rewards:", rewards);

      const formattedRewards = ethers.utils.formatUnits(rewards, 18);
      console.log("Formatted Rewards:", formattedRewards);

      // Update the rewardAmount state
      setRewardAmount(formattedRewards);
      setTransferComplete(true);
    } catch (error) {
      console.error("Error calculating rewards:", error);
    } finally {
      setCalculateInProgress(false); // Done calculating
    }
  };

  // Handle Withdrawal
  const handleWithdraw = async () => {
    if (withdrawAmount <= 0 || withdrawAmount > stakedAmount) {
      alert('Invalid withdrawal amount');
      return;
    }

    try {
      const tx = await contract.unstake(ethers.utils.parseUnits(withdrawAmount.toString(), 18));
      await tx.wait(); // Wait for the transaction to be mined
      alert("Withdrawal successful!");

      // Refresh user's staking and reward data
      const stakeData = await contract.stakes(userAddress);
      setStakedAmount(ethers.utils.formatUnits(stakeData.amount, 18)); // Updated staked amount
      setRewardAmount(ethers.utils.formatUnits(stakeData.rewards, 18)); // Updated rewards
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("An error occurred during withdrawal.");
    }
  };

  return (
    <div>
      <form>
        {/* Outer */}
        <div className="n-900 rounded-full">
          {/* Inner */}
          <div className="flex flex-col gap-10">
            <div className="flex justify-center bg-custom-mid-dark-purple p-2 rounded-xl">
              <div className="flex">
                Stake on <img src="../../CrossfiLogo.png" alt="crossfi" className="w-[30px] h-[30px]" /> <div> CrossFi</div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <WithdrawalSection
                stakedAmount={stakedAmount}
                rewardAmount={rewardAmount}
                withdrawAmount={withdrawAmount}
                setWithdrawAmount={setWithdrawAmount}
              />
            </div>

            {!rewardAmount && !calculateInProgress && !claimInProgress && calculateButtonVisible && transferComplete==false && (
              <button
                type="button"
                onClick={calculateRewards}
                className="flex justify-center w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
              >
                Calculate Rewards
              </button>
            )}

            {rewardAmount && !claimInProgress && transferComplete==true && (
              <button
                type="button"
                onClick={handleClaimRewards}
                className="flex justify-center w-full bg-green-50 bg-gradient-to-r from-green-500 via-lime-500 to-teal-600 text-white px-6 py-2 rounded-lg shadow-md"
              >
                Claim Rewards
              </button>
            )}

            {claimInProgress && transferComplete==true && (
              <button
                type="button"
                className="flex justify-center w-full bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg shadow-md"
                disabled
              >
                Claiming in Progress...
              </button>
            )}

            <button
              type="button"
              onClick={handleWithdraw}
              className="flex justify-center w-full bg-red-50 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Request Withdrawal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Withdrawal;
