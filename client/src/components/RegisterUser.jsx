import React, { useState } from "react";
import { ethers } from "ethers";

function RegisterUser({ contract, account }) {
  const [userAddress, setUserAddress] = useState("");
  const [clearanceLevel, setClearanceLevel] = useState(1);
  const [message, setMessage] = useState("");

  const registerUser = async () => {
    try {
      const tx = await contract.registerUser(userAddress, clearanceLevel, {
        from: account,
      });
      await tx.wait();
      setMessage("User registered successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Register User</h3>
      <input
        type="text"
        placeholder="User Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <input
        type="number"
        min="1"
        max="5"
        value={clearanceLevel}
        onChange={(e) => setClearanceLevel(e.target.value)}
      />
      <button onClick={registerUser}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterUser;
