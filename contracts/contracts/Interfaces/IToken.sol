// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IToken is IERC1155 {
    function stableCoinAddress() external view returns (IERC20);

    function getTotalSupply(uint256 id) external view returns (uint256);
}
