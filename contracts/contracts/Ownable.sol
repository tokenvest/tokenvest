// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

abstract contract Ownable {

    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(isOwner(msg.sender));
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address _owner) public onlyOwner {
        emit OwnershipTransferred(owner, _owner);
        owner = _owner;
    }

    function isOwner(address addr) public view returns (bool) {
        return owner == addr;
    }
}