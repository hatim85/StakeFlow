import { useState } from "react";
import "./App.css";
import Ethers from "./utils/Ethers";
import StakeHeading from "./component/stakeHeading";
import Stake from "./component/Stake";
import Withdrawal from "./component/Withdrawal";
import RewardSection from "./component/Rewardsection";

function App() {
  const [toggle, setToggle] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [networkError, setNetworkError] = useState('');
  const { provider, signer, contract } = Ethers(); 
  const STAKING_NETWORK_ID = '0x103D'; // Replace with your CrossFi testnet network ID
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
        console.log("Current Network:", network); 
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

  const shortenAddress = (address) => (
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`
  );

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

      // await window.ethereum.request({
      //   method: "wallet_addEthereumChain",
      //   params: [
      //     {
      //       chainId: "0xaa36a7", // Hardhat local network chain ID (31337 in decimal)
      //       chainName: "Sepolia",
      //       rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/demo"], // Hardhat's default local RPC URL
      //       nativeCurrency: {
      //         name: "Ether",
      //         symbol: "ETH", // Native currency symbol
      //         decimals: 18,
      //       },
      //       blockExplorerUrls: ["https://sepolia.etherscan.io"], // No block explorer for local Hardhat network
      //     },
      //   ],
      // });
      
    } catch (addError) {
      console.error("Error adding network:", addError);
    }
  };
  return (
    <div className="">
      <button onClick={connectWallet} className="wallet-btn bg-custom-mid-dark-purple absolute right-0 m-5 p-3 text-center rounded-md">
        {!walletAddress ? "Connect Wallet" : shortenAddress(walletAddress)}
      </button>

      {networkError && (
        <div className="w-auto m-5 p-5 absolute bg-red-500 text-white">
          {networkError}
          <button onClick={switchNetwork} className="ml-4 p-5 outline-none rounded-md bg-blue-500">
            Switch Network
          </button>
        </div>
      )}
      <div className="w-full">
        {/* <div className="h-screen bg-gradient-to-r from-[rgb(73,37,89)] via-custom-mid-dark-purple to-[rgb(73,37,89)] w-full h-64   "> */}
        <div className="bg-gradient-to-r  from-[#0d0221] via-[#1a0531] to-[#3d2172] w-full ">
          <div className=" border border-custom-dark-purple ">
            <div className="flex m-auto justify-center mt-20 gap-40">
              <StakeHeading />
              {/* form */}
              <div className="p-2   ">
                <nav className="shadow-lg  flex flex-col  bg-custom-dark-purple gap-8 rounded">
                  <div className="flex  justify-around  rounded  bg-custom-dark-purple p-6">
                    <div
                      className={
                        toggle
                          ? "bg-custom-light-purple hover:bg-[#6F2F9F] transition-all duration-300 ease-in-out transform hover:scale-105  rounded   px-8 cursor-pointer "
                          : "bg-custom-mid-dark-purple  hover:bg-custom-mid-dark-purple  transition-all duration-300 ease-in-out transform hover:scale-105 rounded   px-8 cursor-pointer "
                      }
                      onClick={() => setToggle(true)}
                    >
                      Stake
                    </div>
                    <div
                      className={
                        toggle
                          ? "bg-custom-mid-dark-purple   hover:bg-custom-mid-dark-purple  transition-all duration-300 ease-in-out transform hover:scale-105 rounded   px-5 cursor-pointer "
                          : "  bg-custom-light-purple  hover:bg-[#6F2F9F] transition-all duration-300 ease-in-out transform hover:scale-105  rounded   px-8 cursor-pointer  "
                      }
                      onClick={() => setToggle(false)}
                    >
                      Withdrawal
                    </div>
                  </div>
                  <div className="p-2 w-[30vw] bg-custom-dark-purple">
                    {toggle ? <Stake /> : <Withdrawal walletAddress={walletAddress} />}
                    {/* <Stake /> */}
                  </div>
                </nav>
                <div className="mt-10 rounded-xl    bg-custom-dark-purple">
                  <RewardSection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
