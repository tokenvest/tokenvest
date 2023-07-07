// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSig {
    uint public min_approvals = 3;
    address[] public owners;

    struct Transaction {
        address target;
        bytes data;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Transaction[] public transactions;

    constructor(address[5] memory _owners) {
        owners = _owners;
    }

    function proposeTransaction(
        address _target,
        bytes memory _data
    ) public onlyOwners {
        transactions.push(
            Transaction({target: _target, data: _data, approvalCount: 0})
        );
    }

    function approveTransaction(uint _transactionIndex) public onlyOwners {
        Transaction storage transaction = transactions[_transactionIndex];

        require(!transaction.approvals[msg.sender], "Already approved");

        transaction.approvals[msg.sender] = true;
        transaction.approvalCount++;

        if (transaction.approvalCount >= min_approvals) {
            // If enough approvals have been collected, execute the transaction
            (bool success, ) = transaction.target.call(transaction.data);
            require(success, "Transaction execution failed.");
        }
    }

        

    modifier onlyOwners() {
        bool isOwner = false;
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                isOwner = true;
                break;
            }
        }
        require(isOwner, "Only an owner can call this function");
        _;
    }
}
