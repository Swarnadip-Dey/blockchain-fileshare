import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import FileUpload from "../FileUpload";
import Modal from "../Modal";
import { setUser } from "../../redux/Slices/authSlice";
import { WalletLogin } from "../../services/operations/authApi";
import { initializeWallet } from "../../services/Functions/initializeWallet";

function TeacherDashboard() {
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const accounts = user && user.length > 0 ? user : [];

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAccountSelect = async (acc) => {
    try {
      setErrorMessage("");
      const { contract, address } = await initializeWallet(acc.privateKey);
      setSelectedAccount(acc);
      setAccount(address);
      setContract(contract);
    } catch (error) {
      console.error("Account selection error:", error);
      setErrorMessage(error.message);
    }
  };

  const connectWithMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }

    try {
      setErrorMessage("");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const timestamp = Date.now();
      const message = `Sign this message to verify login: ${timestamp}`;
      const signature = await signer.signMessage(message);

      const result = await WalletLogin({ address, signature, timestamp });

      if (result?.token && result?.user) {
        dispatch(setUser(result.user));
        setAccount(address);
        setProvider(provider);
        setContract(null);
        setSelectedAccount({ account_name: "MetaMask Account" });
      } else {
        throw new Error("Wallet authentication failed.");
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setErrorMessage(error.message);
    }
  };

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

  const renderAccountSelection = () => {
    if (!selectedAccount) {
      return (
        <div className="account-selection">
          <h2>Select an Account</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {accounts.map((acc, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px 15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <span style={{ fontWeight: "500" }}>{acc.account_name}</span>
                <button
                  onClick={() => handleAccountSelect(acc)}
                  style={{
                    marginLeft: "10px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Select
                </button>
              </div>
            ))}

            <button
              onClick={connectWithMetaMask}
              style={{
                backgroundColor: "#f6851b",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Connect with MetaMask
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderDashboardContent = () => {
    if (selectedAccount && (account || contract)) {
      return (
        <div>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "600",
              padding: "10px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Share
          </button>

          {modalOpen && (
            <Modal setModalOpen={setModalOpen} contract={contract} />
          )}

          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          />
          <hr className="black-line" />
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

export default TeacherDashboard;
