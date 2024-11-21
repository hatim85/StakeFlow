import React from 'react';

const WithdrawalSection = ({ stakedAmount, rewardAmount, withdrawAmount, setWithdrawAmount }) => {
    return (
        <div>
            <div>
                <h3>Staked Amount: {stakedAmount} stXFI</h3>
                <h3>Current Rewards: {rewardAmount} XFI</h3>
            </div>

            <div className="mt-4">
                <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700">
                    Withdraw Amount (stXFI)
                </label>
                <input
                    type="number"
                    id="withdrawAmount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0"
                    max={stakedAmount}
                    className="mt-1 mb-4 px-4 py-2 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
        </div>
    );
};

export default WithdrawalSection;
