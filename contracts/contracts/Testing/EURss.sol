// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.19;

import "contracts/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EURss is ERC20 {
    constructor() ERC20("EURss", "EUR") {
        _mint(msg.sender, 1e12 * 1e18);
    }
}
