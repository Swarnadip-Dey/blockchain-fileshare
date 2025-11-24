// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract UserManager {
    address public admin;

    enum Clearance { None, Level1, Level2, Level3, Level4 }
    mapping(address => Clearance) public userClearance;

    event EtherReceived(address indexed sender, uint amount);
    event FallbackCalled(address indexed sender, uint amount, bytes data);

    constructor() {
        admin = msg.sender;
        userClearance[admin] = Clearance.Level4; // Admin gets Level4 clearance
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function setClearance(address _user, Clearance _level) external onlyAdmin {
        userClearance[_user] = _level;
    }

    function upgradeClearance(Clearance _level) external payable {
        require(userClearance[msg.sender] < _level, "Already at this level or higher");
        require(_level != Clearance.Level4, "Cannot upgrade to Level4");

        if (_level == Clearance.Level1) {
            require(msg.value >= 0.01 ether, "Level1 costs 0.01 ETH");
        } else if (_level == Clearance.Level2) {
            require(msg.value >= 0.05 ether, "Level2 costs 0.05 ETH");
        } else if (_level == Clearance.Level3) {
            require(msg.value >= 0.1 ether, "Level3 costs 0.1 ETH");
        }

        userClearance[msg.sender] = _level;
        payable(admin).transfer(msg.value);
    }

    function getClearance(address _user) external view returns (Clearance) {
        return userClearance[_user];
    }

    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit FallbackCalled(msg.sender, msg.value, msg.data);
    }
}
