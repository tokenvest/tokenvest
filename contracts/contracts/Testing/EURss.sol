// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EURss is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1 * 1e6 * 1e18);
        _mint("0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", 1 * 1e6 * 1e18);
        _mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 1 * 1e6 * 1e18);
    }
}
