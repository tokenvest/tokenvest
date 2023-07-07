// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error Multisig__OnlyOneOwnerRemaining();
error Multisig__NumberOfOwnersNeedsToBeLargerOrEqualThanMinApprovals();
error Multisig__ThisOwnerAlreadyApproved();
error Multisig__AlreadyAnOwner();
error Multisig__OnlyOwnersCanCall();
error Multisig__NotAnOwner();

contract MultiSig {
    uint256 public min_approvals;
    uint256 public number_of_owners;
    mapping(address => bool) owners;

    struct Transaction {
        address target; //the contract address
        bytes data; //the calldata: includes the function signature and the function arguments
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Transaction[] public transactions;

    constructor(address[5] memory _owners, uint256 _min_approvals) {
        for (uint i = 0; i < _owners.length; i++) {
            //only count distinct owners (catches the case where an address is present multiple times in _owners)
            //could cause issues with min_approvals if not caught
            if (!owners[_owners[i]]) {
                owners[_owners[i]] = true;
                number_of_owners++;
            }
        }
        min_approvals = _min_approvals;
    }

    function proposeTransaction(
        address _target,
        bytes memory _data
    ) public onlyOwners {
        transactions.push();
        Transaction storage transaction = transactions[transactions.length - 1];
        transaction.target = _target;
        transaction.data = _data;
        transaction.approvalCount = 0;
    }

    function approveTransaction(uint _transactionIndex) public onlyOwners {
        Transaction storage transaction = transactions[_transactionIndex];

        if (transaction.approvals[msg.sender])
            revert Multisig__ThisOwnerAlreadyApproved();

        transaction.approvals[msg.sender] = true;
        transaction.approvalCount++;

        if (transaction.approvalCount >= min_approvals) {
            // If enough approvals have been collected, execute the transaction
            (bool success, ) = transaction.target.call(transaction.data);
            require(success, "Transaction execution failed.");
        }
    }

    modifier onlyOwners() {
        if (!owners[msg.sender]) revert Multisig__OnlyOwnersCanCall();
        _;
    }

    //function should also be proposed by proposeTransaction
    function _changeMinimumRequiredNumberOfApprovals(
        uint new_min_approvals
    ) internal {
        if (new_min_approvals > number_of_owners)
            revert Multisig__NumberOfOwnersNeedsToBeLargerOrEqualThanMinApprovals();
        min_approvals = new_min_approvals;
    }

    function _revokeOwner(address _toRevoke) internal {
        if (number_of_owners == 1) revert Multisig__OnlyOneOwnerRemaining(); //if no owner would remain, contract would not be usable anymore
        if (!owners[_toRevoke]) revert Multisig__NotAnOwner();
        owners[_toRevoke] = false;
        number_of_owners--;
        if (number_of_owners < min_approvals)
            revert Multisig__NumberOfOwnersNeedsToBeLargerOrEqualThanMinApprovals();
    }

    function _addOwner(address _toAdd) internal {
        if (owners[_toAdd]) revert Multisig__AlreadyAnOwner();
        owners[_toAdd] = true;
        number_of_owners++;
    }
}
