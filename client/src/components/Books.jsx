import React, { useState, useEffect } from "react";

const Books = ({ contract, account }) => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contract) {
      fetchBooks();
    }
  }, [contract]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Fetch all books from the contract
      const filter = contract.filters.BookAdded();
      const events = await contract.queryFilter(filter);

      const books = events.map((event) => ({
        id: event.args.bookId,
        title: event.args.title,
        clearance: event.args.requiredClearance,
        isAvailable: event.args.isAvailable,
      }));

      // Separate available and borrowed books
      const available = books.filter((book) => book.isAvailable);
      const borrowed = books.filter((book) => !book.isAvailable);

      setAvailableBooks(available);
      setBorrowedBooks(borrowed);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId) => {
    try {
      const transaction = await contract.borrowBook(bookId);
      await transaction.wait();
      alert("Book borrowed successfully!");
      fetchBooks(); // Refresh the book list
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
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Library Book Management
      </h1>

      {/* Available Books Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b border-blue-300 pb-2">
          Available Books
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading books...</p>
        ) : availableBooks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {availableBooks.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center py-3"
              >
                <p className="text-gray-900 font-medium">{book.title}</p>
                <button
                  onClick={() => borrowBook(book.id)}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-md font-semibold transition"
                >
                  Borrow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No available books.</p>
        )}
      </section>

      {/* Borrowed Books Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-700 border-b border-green-300 pb-2">
          Borrowed Books
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading books...</p>
        ) : borrowedBooks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {borrowedBooks.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center py-3"
              >
                <p className="text-gray-900 font-medium">{book.title}</p>
                <button
                  onClick={() => returnBook(book.id)}
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-5 py-2 rounded-md font-semibold transition"
                >
                  Return
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No borrowed books.</p>
        )}
      </section>
    </div>
  );
};

export default Books;
