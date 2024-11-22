import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Ethers from "../utils/Ethers"; // Import Ethers helper for contract initialization



const Stake = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeXFIAmount, setStakeXFIAmount] = useState(''); // State for StakeXFI token equivalent
  const [contractBalance, setContractBalance] = useState('');
  const [stXFIBalance, setStXFIBalance] = useState('');
  const [rwXFIBalance, setRwXFIBalance] = useState('');
  const [xfiBalance, setXfiBalance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  

  const { provider, signer, contract } = Ethers(); // Leverage the helper function

  // useEffect(() => {
  //   fetchContractBalances();
  // }, [contract]);

  // // Fetch all contract balances
  // const fetchContractBalances = async () => {
  //   if (!contract) return;

  //   try {
  //     const balances = await contract.getContractBalances();

  //     setStXFIBalance(ethers.utils.formatEther(balances.stXFIBalance));
  //     setRwXFIBalance(ethers.utils.formatEther(balances.rwXFIBalance));
  //     setXfiBalance(ethers.utils.formatEther(balances.xfiBalance));
  //   } catch (error) {
  //     console.error("Error fetching contract balances:", error);
  //     setError("Failed to fetch balances.");
  //   }
  // };

  

  const calculateStakeXFI = async (amount) => {
    if (!contract) return;

    try {
      const conversionRate = 100; // Updated conversion logic: 1 XFI = 100 stXFI
      const equivalentAmount = ethers.utils.parseEther(amount.toString());
      setStakeXFIAmount(ethers.utils.formatEther(equivalentAmount.mul(conversionRate)));
    } catch (error) {
      console.error("Error calculating StakeXFI:", error);
      setStakeXFIAmount('');
    }
  };

  const handleStakeAmountChange = (e) => {
    const amount = e.target.value;
    setStakeAmount(amount);

    if (amount > 0) {
      calculateStakeXFI(amount);
    } else {
      setStakeXFIAmount('');
    }
  };

  const stakeTokens = async () => {
    if (!contract || !stakeAmount) {
      alert("Please connect your wallet and enter an amount to stake!");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const amountInWei = ethers.utils.parseEther(stakeAmount);
      console.log("Stake amount in wei:", amountInWei.toString());
      const tx = await contract.stake(amountInWei, { value: amountInWei, gasLimit: 300000 });
      await tx.wait();
      alert('Staked tokens successfully!')
    } catch (error) {
      setError("Failed to stake tokens: " + error.message);
      console.log("Transaction details:", {
        stakeAmount,
        amountInWei: ethers.utils.parseEther(stakeAmount).toString(),
      });
      console.error("Error staking tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  

  

  return (
    <div>
      

      <div className="rounded-full">
        <div className="flex flex-col gap-10">
          <div className="flex justify-center bg-custom-mid-dark-purple p-2 rounded-xl">
            <h2 className="text-lg flex flex-row font-bold text-white">Stake on  <img src="../../CrossfiLogo.png" alt="crossfi" className="w-[30px] h-[30px]"/> CrossFi</h2>
          </div>

          <div>
            <h1>1 XFI = 100 StakeXFI</h1>
            {/* <p className="text-center text-gray-700">
              Contract Balances: <br />
              stXFI: {stXFIBalance || "Loading..."} tokens <br />
              rwXFI: {rwXFIBalance || "Loading..."} tokens <br />
              XFI: {xfiBalance || "Loading..."} ETH
            </p> */}
          </div>

          <div>
            <input
              type="number"
              placeholder="Enter amount to stake"
              value={stakeAmount}
              onChange={handleStakeAmountChange}
              className="w-full mb-4 px-4 py-2 text-black rounded-lg border border-gray-300"
            />
            <p className="text-sm text-gray-500 mb-4">
              {stakeAmount == 0 ? "" : `You will receive approximately ${stakeXFIAmount || "0"} StakeXFI tokens.`}
            </p>
            <button
              onClick={stakeTokens}
              className="flex justify-center w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
              disabled={loading}
            >
              {loading ? "Staking..." : "Stake"}
            </button>
          </div>

          
          
        </div>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Stake;
