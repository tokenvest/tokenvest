// SPDX-License-Identifier: TODO
pragma solidity ^0.8.19;

contract PayoutSettlementContract {
    address stableCoinAddress;
    mapping(uint256 => bool) payoutAllowedToBeClaimed; //erc1155 id => boolean

    address erc1155;

    constructor(address _stableCoinAddress, address _buildingNFTaddress) {
        erc1155 = _buildingNFTaddress;
        stableCoinAddress = _buildingNFTaddress;
    }
}
