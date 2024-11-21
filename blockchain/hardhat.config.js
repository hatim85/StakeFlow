require("@nomicfoundation/hardhat-toolbox");
const dotenv=require("dotenv")
dotenv.config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    crossfi:{
      url:`https://crossfi-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId:4157,
      accounts:[process.env.PRIVATE_KEY]
    },
    // hardhat: {
    //   chainId: 1337, // Ensure this is set to 1337 for Hardhat local network
    //   accounts:[process.env.PRIVATE_KEY]
    // },
    // localhost: {
    //   url: "http://127.0.0.1:8545", // Localhost for manual Hardhat or Ganache testing
    //   chainId: 31337,
    //   accounts:[process.env.PRIVATE_KEY]
    // },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, // or any other RPC provider
      chainId: 11155111, // Sepolia's chain ID
      accounts: [process.env.PRIVATE_KEY], // Private key from your .env file
    },
    // chainId: 1337
  }
};
