// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma abicoder v2;

import "./UserManager.sol";
import "./BookManager.sol";

contract BorrowManager {
    struct BorrowRecord {
        address user;
        uint bookId;
        uint borrowTime;
        uint returnTime;
        bool returned;
    }

    UserManager public userManager;
    BookManager public bookManager;

    BorrowRecord[] public borrowRecords;

    // ✅ Mapping to track if a user has borrowed a specific book
    mapping(address => mapping(uint => bool)) public hasBorrowed;

    event EtherReceived(address indexed sender, uint amount);
    event FallbackCalled(address indexed sender, uint amount, bytes data);

    constructor(address payable _userManager, address payable _bookManager) {
        userManager = UserManager(_userManager);
        bookManager = BookManager(_bookManager);
    }

    function borrowBook(uint _bookId) external payable {
        require(msg.value >= 0.01 ether, "Borrowing requires at least 0.01 ETH");

        BookManager.Book memory book = bookManager.getBook(_bookId);
        require(uint(userManager.getClearance(msg.sender)) >= book.requiredClearance, "Not enough clearance");
        require(book.status == BookManager.Status.Approved, "Book not approved");

        require(!hasBorrowed[msg.sender][_bookId], "You have already borrowed this book");

        // ✅ Record the borrow
        hasBorrowed[msg.sender][_bookId] = true;

        borrowRecords.push(BorrowRecord({
            user: msg.sender,
            bookId: _bookId,
            borrowTime: block.timestamp,
            returnTime: 0,
            returned: false
        }));

        payable(userManager.admin()).transfer(msg.value);
    }

    function returnBook(uint _bookId) external {
        for (uint i = 0; i < borrowRecords.length; i++) {
            if (
                borrowRecords[i].user == msg.sender &&
                borrowRecords[i].bookId == _bookId &&
                !borrowRecords[i].returned
            ) {
                borrowRecords[i].returned = true;
                borrowRecords[i].returnTime = block.timestamp;

                // ✅ Clear the borrow flag
                hasBorrowed[msg.sender][_bookId] = false;

                break;
            }
        }
    }

    function getAllBorrows() external view returns (BorrowRecord[] memory) {
        return borrowRecords;
    }

    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit FallbackCalled(msg.sender, msg.value, msg.data);
    }
}