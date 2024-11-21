import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { STAKING_ABI, STAKING_ADDRESS } from '../utils/config.js'; // Assuming you have these variables
import Ethers from '../utils/Ethers'; // Assuming this file manages your provider, signer, and contract
import WithdrawalSection from './WithdrawalSection';
import ReceiverSection from './ReceiverSection';

const Withdrawal = () => {
  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const { provider, signer, contract } = Ethers();
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    // Get the user's address and the staked amount
    const fetchUserData = async () => {
      const address = await signer.getAddress();
      setUserAddress(address);

      // Fetch user's current staked amount and rewards
      const stakeData = await contract.stakes(address);
      setStakedAmount(ethers.utils.formatUnits(stakeData.amount, 18)); // Assuming 18 decimals for stXFI
      setRewardAmount(ethers.utils.formatUnits(stakeData.rewards, 18)); // Same for reward
    };

    if (signer) {
      fetchUserData();
    }
  }, [signer, contract]);

  const handleWithdraw = async () => {
    if (withdrawAmount <= 0 || withdrawAmount > stakedAmount) {
      alert('Invalid withdraw amount');
      return;
    }

    try {
      const tx = await contract.unstake(ethers.utils.parseUnits(withdrawAmount.toString(), 18));
      await tx.wait(); // Wait for the transaction to be mined

      alert('Withdrawal successful');
      // Optionally, refresh the user's stake and reward information after the transaction
      const stakeData = await contract.stakes(userAddress);
      setStakedAmount(ethers.utils.formatUnits(stakeData.amount, 18));
      setRewardAmount(ethers.utils.formatUnits(stakeData.rewards, 18));
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('An error occurred during withdrawal');
    }
  };

  return (
    <div>
      <form action="">
        {/* outer */}
        <div className=" n-900 rounded-full">
          {/* inner */}
          <div className="flex flex-col gap-10">
            <div className="flex justify-center bg-custom-mid-dark-purple p-2 rounded-xl ">
              <div>Stake on </div>
              <div>CrossFi</div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Withdrawal Section */}
              <WithdrawalSection
                stakedAmount={stakedAmount}
                rewardAmount={rewardAmount}
                withdrawAmount={withdrawAmount}
                setWithdrawAmount={setWithdrawAmount}
              />

              {/* Receiver Section */}
              {/* <ReceiverSection currency="XFI" /> */}
            </div>

            <button
              type="button"
              onClick={handleWithdraw}
              className="flex justify-center w-full rounded bg-red-50 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Request withdrawal
            </button>

            <button
              type="button"
              className="flex justify-center w-full rounded bg-red-50 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Calculate reward
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Withdrawal;
