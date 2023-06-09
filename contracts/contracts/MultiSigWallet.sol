// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

contract MultiSigWallet {

    mapping(address => bool) public isOwner;
    uint public nConfirmations;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    constructor(address[] memory owners, uint numConfirmationsRequired) {
        require(owners.length > 0, "owners required");
        require(
            numConfirmationsRequired > 0 &&
            numConfirmationsRequired <= owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < owners.length; i++) {
            address owner = owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
        }

        nConfirmations = numConfirmationsRequired;
    }

}