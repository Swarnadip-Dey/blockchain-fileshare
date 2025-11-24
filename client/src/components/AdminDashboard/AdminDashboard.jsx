import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import BookUpload from "../BookUpload";
import Books from "../Books";
import RegisterUser from "../RegisterUser";
import UpdateClearance from "../UpdateClearance";
import ValidateBook from "../ValidateBook";
import { setUser } from "../../redux/Slices/authSlice";
import { WalletLogin } from "../../services/operations/authApi";

function AdminDashboard() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Parse accounts from user data
  const accounts = user && user.length > 0 ? user : [];

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Function to initialize wallet with private key
  const initializeWallet = async (privateKey) => {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
    const signer = wallet.connect(provider);
    return { contract: null, address: wallet.address };
  };

  // Handle account selection from Redux store
  const handleAccountSelect = async (acc) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      console.log("Selecting account:", acc.account_name);

      // testing
      // const { contract: contractInstance, address } = await initializeWallet(
      //   acc.privateKey
      // );

      setSelectedAccount(acc);

      // testing
      setAccount(acc.account_name);
      // setAccount(address);
      // setContract(contractInstance);

      console.log("Account selected successfully");
    } catch (error) {
      console.error("Account selection error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect with MetaMask
  const connectWithMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Generate a timestamp for the message
      const timestamp = Date.now();
      const message = `Sign this message to verify login: ${timestamp}`;

      const signature = await signer.signMessage(message);

      const result = await WalletLogin({ address, signature, timestamp });

      if (result?.token && result?.user) {
        dispatch(setUser(result.user));

        // Set the account details
        setAccount(address);
        setProvider(provider);
        setContract(null); // Since we don't have a contract instance yet
        setSelectedAccount({ account_name: "MetaMask Account" });
      } else {
        throw new Error("Wallet authentication failed.");
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-select account on component mount if only one account
  useEffect(() => {
    const autoSelectAccount = async () => {
      try {
        if (accounts.length === 1) {
          await handleAccountSelect(accounts[0]);
        }
      } catch (error) {
        console.error("Auto account selection error:", error);
      }
    };

    autoSelectAccount();
  }, [accounts]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Render error message
  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <div className="error-banner">
          {errorMessage}
          <button onClick={() => setErrorMessage("")}>✕</button>
        </div>
      );
    }
    return null;
  };

  // Render account selection
  const renderAccountSelection = () => {
    if (!selectedAccount) {
      return (
        <div className="account-selection">
          <h2>Select an Account</h2>
          <div className="account-list">
            {accounts.map((acc, index) => (
              <button
                key={index}
                onClick={() => handleAccountSelect(acc)}
                className="account-button"
              >
                {acc.account_name}
              </button>
            ))}
            <button onClick={connectWithMetaMask} className="account-button">
              Connect with MetaMask
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render main dashboard content
  const renderDashboardContent = () => {
    console.log(selectedAccount, account);
    if (selectedAccount && (account || contract)) {
      return (
        <div>
          <BookUpload
            account={account}
            provider={provider}
            contract={contract}
          />

          <hr className="black-line" />

          <Books
            contract={contract}
            account={account}
            provider={provider}
            selectedAccount={selectedAccount}
          />
          <hr className="black-line" />

          {selectedAccount && selectedAccount.isAdmin && (
            <div>
              <RegisterUser contract={contract} account={account} />
              <UpdateClearance contract={contract} account={account} />
            </div>
          )}

          {/* User functionalities */}
          <ValidateBook contract={contract} account={account} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <div className="w-full">
        <Navbar name="My Dashboard" />
      </div>

      {renderErrorMessage()}

      <div className="w-full flex lg:flex-nowrap flex-wrap gap-6 mx-auto h-fit">
        {/* Account display */}
        <div className="header">
          {account && <p style={{ color: "black" }}>Account: {account}</p>}
          <hr className="black-line" />
        </div>

        {renderAccountSelection()}
        {renderDashboardContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
