import React, { useState, useEffect } from "react";

const DisplayBooks = ({ contract, provider, selectedAccount }) => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBooks = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    setLoading(true);
    try {
      const filter = contract.filters.BookAdded();
      const events = await contract.queryFilter(filter);

      if (events && events.length > 0) {
        const bookItems = events.map((event, i) => (
          <div
            key={i}
            className="p-4 border rounded-md shadow-sm hover:shadow-md transition cursor-pointer select-none"
          >
            <p className="text-lg font-semibold text-gray-800">
              {event.args.title}
            </p>
          </div>
        ));
        setBooks(bookItems);
      } else {
        setBooks(
          <p className="text-center text-gray-500 italic mt-6">
            No books found in the library.
          </p>
        );
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks(
        <p className="text-center text-red-600 font-semibold mt-6">
          Error fetching book titles. Please try again.
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      getBooks();
    }
  }, [contract]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 border-b pb-4">
        <p className="text-gray-700 font-medium">
          Current Account:{" "}
          <span className="font-semibold text-gray-900">
            {selectedAccount?.account_name || "Not Selected"}
          </span>
        </p>
      </div>

      <div className="mb-6 text-center">
        <button
          onClick={getBooks}
          disabled={loading || !contract}
          className={`px-6 py-2 rounded-md font-semibold text-white transition 
            ${
              loading || !contract
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer"
            }
            `}
        >
          {loading ? "Loading Books..." : "Refresh Book List"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">{books}</div>
    </div>
  );
};

export default DisplayBooks;
