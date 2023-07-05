// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.19;

import "contracts/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IToken is IERC1155 {
    function stableCoinAddress() external view returns (IERC20);
}
