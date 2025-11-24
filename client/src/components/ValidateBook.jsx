import React, { useState } from "react";

function ValidateBook({ contract, account }) {
  const [bookId, setBookId] = useState("");
  const [message, setMessage] = useState("");

  const validateBook = async () => {
    try {
      const tx = await contract.validateBook(bookId, { from: account });
      await tx.wait();
      setMessage("Book validated successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Validate Book</h3>
      <input
        type="text"
        placeholder="Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <button onClick={validateBook}>Validate</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ValidateBook;
