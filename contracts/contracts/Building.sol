// SPDX-License-Identifier: TODO

//TODO @Reginald: figure out a out-of-the-box multisig solution

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Building is ERC1155 {
    constructor() ERC1155("URI") {
    }
}
