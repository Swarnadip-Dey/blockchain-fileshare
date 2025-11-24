import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import DisplayBooks from "../DisplayBooks";
import ELibrary from "../../artifacts/contracts/ELibrary.sol/ELibrary.json";
import { CONTRACT_ADDRESS } from "../../services/apis";
function GuestDashboard() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          process.env.REACT_APP_RPC_URL
        );
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ELibrary.abi,
          provider
        );

        setProvider(provider);
        setContract(contract);
      } catch (error) {
        console.error("GuestDashboard loadContract error:", error);
      }
    };

    loadContract();
  }, []);

  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <Navbar name="Guest Dashboard" />

      <div className="w-full flex flex-col gap-6 mx-auto">
        {contract && (
          <DisplayBooks
            contract={contract}
            account={account}
            provider={provider}
            selectedAccount={{ account_name: "Guest" }}
          />
        )}
      </div>
    </div>
  );
}

export default GuestDashboard;
