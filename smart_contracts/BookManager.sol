// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma abicoder v2;

import "./UserManager.sol";

contract BookManager {
    enum Status { Proposed, Approved, Rejected }
    enum FileType { PDF, EPUB, MOBI, TEXT, IMAGE, VIDEO }

    struct Book {
        bytes32 bookId;
        string title;
        string author;
        string ipfsHash;
        uint requiredClearance;
        FileType fileType;
        Status status;
        address proposer;
        uint yesVotes;
        uint noVotes;
    }

    Book[] public books;
    UserManager public userManager;
    mapping(uint => mapping(address => bool)) public voted;

    event BookProposed(uint indexed bookIndex, address indexed proposer, bytes32 bookId);
    event BookVoted(uint indexed bookIndex, address indexed voter, bool approved);
    event EtherReceived(address indexed sender, uint amount);
    event FallbackCalled(address indexed sender, uint amount, bytes data);

    constructor(address payable userManagerAddress) {
        userManager = UserManager(userManagerAddress);
    }

    function addBook(
        bytes32 _bookId,
        string memory _title,
        string memory _author,
        string memory _ipfsHash,
        uint _requiredClearance,
        uint _fileType
    ) external payable {
        require(msg.value >= 0.02 ether, "Adding a book requires 0.02 ETH");
        require(uint(userManager.getClearance(msg.sender)) >= 3, "Not enough clearance to add books");
        require(_fileType <= uint(FileType.VIDEO), "Invalid file type");

        books.push(Book(
            _bookId,
            _title,
            _author,
            _ipfsHash,
            _requiredClearance,
            FileType(_fileType),
            Status.Proposed,
            msg.sender,
            0,
            0
        ));

        emit BookProposed(books.length - 1, msg.sender, _bookId);

        payable(userManager.admin()).transfer(msg.value);
    }

    function voteOnBook(uint _bookId, bool _approve) external {
        require(_bookId < books.length, "Invalid book ID");
        Book storage book = books[_bookId];

        require(book.status == Status.Proposed, "Voting closed for this book");
        require(uint(userManager.getClearance(msg.sender)) > 0, "Not enough clearance to vote");
        require(!voted[_bookId][msg.sender], "Already voted on this book");

        voted[_bookId][msg.sender] = true;

        if (_approve) {
            book.yesVotes++;

            if (msg.sender == userManager.admin()) {
                // Admin vote alone is sufficient
                book.status = Status.Approved;
            } else {
                // Non-admins need at least 2 approvals to proceed
                if (
                    book.yesVotes >= 2 &&
                    book.yesVotes > book.noVotes
                ) {
                    book.status = Status.Approved;
                }
            }
        } else {
            book.noVotes++;

            // If rejections are equal or exceed approvals
            if (book.noVotes >= book.yesVotes) {
                book.status = Status.Rejected;
            }
        }

        emit BookVoted(_bookId, msg.sender, _approve);
    }



    function getBook(uint _index) external view returns (Book memory) {
        require(_index < books.length, "Invalid index");
        return books[_index];
    }

    function getAllBooks() external view returns (Book[] memory) {
        return books;
    }

    function getBooksCount() external view returns (uint) {
        return books.length;
    }

    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit FallbackCalled(msg.sender, msg.value, msg.data);
    }
}
