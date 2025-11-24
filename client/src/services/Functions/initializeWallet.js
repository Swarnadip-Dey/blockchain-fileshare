import { ethers } from "ethers";
import Upload from "../../artifacts/contracts/ELibrary.sol/ELibrary.json";
import { CONTRACT_ADDRESS } from "../apis";

export const initializeWallet = async (privateKey) => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, Upload.abi, wallet);
  const address = await wallet.getAddress();
  return { contract, address };
};
