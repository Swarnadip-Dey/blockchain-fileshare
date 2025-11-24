import React, { useState } from "react";

function UpdateClearance({ contract, account }) {
  const [userAddress, setUserAddress] = useState("");
  const [newLevel, setNewLevel] = useState(1);
  const [message, setMessage] = useState("");

  const updateClearance = async () => {
    try {
      const tx = await contract.updateClearanceLevel(userAddress, newLevel, {
        from: account,
      });
      await tx.wait();
      setMessage("Clearance level updated successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Update Clearance Level</h3>
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
        value={newLevel}
        onChange={(e) => setNewLevel(e.target.value)}
      />
      <button onClick={updateClearance}>Update</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateClearance;
