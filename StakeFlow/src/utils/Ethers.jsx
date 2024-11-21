import { ethers } from "ethers";
import { STAKING_ABI, STAKING_ADDRESS,REWARDXFI,REWARDXFI_ABI } from "./config.js";

function Ethers() {
    if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, signer);

    const rwXFIToken = new ethers.Contract(REWARDXFI, REWARDXFI_ABI, signer);

    return { provider, signer, contract, rwXFIToken };

}

export default Ethers