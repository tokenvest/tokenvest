// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EURss is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
}
