import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Ethers from "../utils/Ethers"; // Import Ethers helper for contract initialization

const STAKING_NETWORK_ID = '0x103d'; // Replace this with your CrossFi testnet network ID

const Stake = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeXFIAmount, setStakeXFIAmount] = useState(''); // State for StakeXFI token equivalent
  const [rewardAmount, setRewardAmount] = useState('');
  const [contractBalance, setContractBalance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState('');

  const { provider, signer, contract, rwXFIToken } = Ethers(); // Leverage the helper function

  useEffect(() => {
    fetchContractBalance();
  }, [contract]);

  // Fetch contract balance
  const fetchContractBalance = async () => {
    if (!rwXFIToken || !contract) return;

    try {
      const balance = await rwXFIToken.balanceOf(contract.address);
      setContractBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching contract balance:", error);
      setContractBalance("Error fetching balance");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const address = await signer.getAddress();
      setWalletAddress(address);

      localStorage.setItem("walletAddress", address);
      localStorage.setItem("timestamp", Date.now().toString());
      checkNetwork();
    } catch (error) {
      console.error("Failed to connect wallet:", error.message);
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const network = await window.ethereum.request({
          method: "eth_chainId"
        });

        if (network !== STAKING_NETWORK_ID) {
          setNetworkError("Please switch to the correct network.");
        } else {
          setNetworkError("");
        }
      } catch (error) {
        console.error("Error checking network:", error);
      }
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: STAKING_NETWORK_ID }],
      });
      setNetworkError("");
    } catch (switchError) {
      if (switchError.code === 4902) {
        addNetwork();
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };

  const addNetwork = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: STAKING_NETWORK_ID,
            chainName: "CrossFi Testnet",
            rpcUrls: ["https://rpc.testnet.ms"],
            nativeCurrency: {
              name: "CrossFi",
              symbol: "XFI",
              decimals: 18
            },
            blockExplorerUrls: ["https://testnet.crossfi.io"],
          },
        ],
      });
    } catch (addError) {
      console.error("Error adding network:", addError);
    }
  };

  const calculateStakeXFI = async (amount) => {
    if (!contract) return;

    try {
      // Assume 1:1 conversion rate for simplicity
      const conversionRate = 1; // Replace with the actual conversion logic if needed
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
      const tx = await contract.stake(ethers.utils.parseEther(stakeAmount));
      await tx.wait();
      fetchContractBalance();
    } catch (error) {
      setError("Failed to stake tokens: " + error.message);
      console.error("Error staking tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRewards = async () => {
    if (!contract || !walletAddress) {
      alert("Please connect your wallet to calculate rewards!");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const rewards = await contract.calculateReward(walletAddress);
      setRewardAmount(ethers.utils.formatEther(rewards));
    } catch (error) {
      setError("Failed to calculate rewards: " + error.message);
      console.error("Error calculating rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} className="wallet-btn bg-custom-mid-dark-purple w-full mb-10 h-10 rounded-md">
        {walletAddress || "Connect Wallet"}
      </button>

      {networkError && (
        <div className="text-yellow-500 mt-4">
          {networkError}
          <button onClick={switchNetwork} className="ml-4 text-blue-500 underline">
            Switch Network
          </button>
        </div>
      )}

      <div className="rounded-full">
        <div className="flex flex-col gap-10">
          <div className="flex justify-center bg-custom-mid-dark-purple p-2 rounded-xl">
            <h2 className="text-lg font-bold text-white">Stake on CrossFi</h2>
          </div>

          <div>
            <p className="text-center text-gray-700">
              Contract Balance: {contractBalance || "Loading..."} XFI
            </p>
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
              {stakeAmount==0 ? "" : `You will receive approximately ${stakeXFIAmount || "0"} StakeXFI tokens.`}
              
            </p>
            <button
              onClick={stakeTokens}
              className="flex justify-center w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
              disabled={loading}
            >
              {loading ? "Staking..." : "Stake"}
            </button>
          </div>

          <button
            onClick={calculateRewards}
            className="flex justify-center w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
            disabled={loading}
          >
            {loading ? "Calculating..." : "Calculate Rewards"}
          </button>
          {rewardAmount && <div>Your rewards: {rewardAmount} tokens</div>}
        </div>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Stake;
