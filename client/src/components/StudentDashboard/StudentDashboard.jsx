import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import BookUpload from "../BookUpload";
import Books from "../Books";
import { setUser } from "../../redux/Slices/authSlice";
import { WalletLogin } from "../../services/operations/authApi";
import { initializeWallet } from "../../services/Functions/initializeWallet";

function StudentDashboard() {
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const accounts = user && user.length > 0 ? user : [];

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleAccountSelect = async (acc) => {
    try {
      setErrorMessage("");
      console.log("Selecting account:", acc.account_name);

      const { contract, address } = await initializeWallet(acc.privateKey);

      setSelectedAccount(acc);

      setAccount(address);
      setContract(contract);

      console.log("Account selected successfully");
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

  const borrowBook = async (bookId) => {
    try {
      const transaction = await contract.borrowBook(bookId);
      await transaction.wait();
      alert("Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book.");
    }
  };

  const returnBook = async (bookId) => {
    try {
      const transaction = await contract.returnBook(bookId);
      await transaction.wait();
      alert("Book returned successfully!");
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book.");
    }
  };

  const renderDashboardContent = () => {
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
            borrowBook={borrowBook}
            returnBook={returnBook}
          />
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

      <div className="bg rounded-lg shadow-md p-4 max-w-full max-w-lg mx-0 mb-6">
        {account && (
          <p className="text-gray-800 font-semibold text-base text-left">
            <span className="text-gray-500 font-normal mr-2">Account:</span>
            {account}
          </p>
        )}
        <hr className="mt-3 border-t border-gray-300" />
      </div>

      {renderAccountSelection()}
      {renderDashboardContent()}
    </div>
  );
}

export default StudentDashboard;
