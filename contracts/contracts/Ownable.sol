// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

abstract contract Ownable {
    address[] public owners;
    mapping(address => bool) public isOwner;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    constructor(address[] memory _owners) {
        require(0 < _owners.length, "owners required");
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
        }
        owners = _owners;
    }
}
