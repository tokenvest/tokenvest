// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Building is ERC1155 {
    constructor(string memory _uri) ERC1155(_uri) {}
}
