// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Building is ERC1155 {
    mapping(uint256 => uint256) totalSupply;
    mapping(uint256 => uint256) initialPricePerToken;
    mapping(uint256 => uint256) payoutPerTokenAtSale;

    event AppartmentMinted(
        uint256 id,
        uint256 initialPricePerToken,
        uint256 initialYieldPerToken,
        uint256 totalSupply
    );

    constructor(string memory _uri) ERC1155(_uri) {}

    function getTotalSupply(uint256 id) public returns (uint256) {
        return totalSupply[id];
    }

    function getInitialPricePerToken(uint256 id) public returns (uint256) {
        return initialPricePerToken[id];
    }

    function getPayoutPerTokenAtSale(uint256 id) public returns (uint256) {
        return payoutPerTokenAtSale[id];
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data,
        uint256 _initialSupply,
        uint256 _initialPricePerToken,
        uint _yieldAtSale
    ) public {
        _mint(to, id, amount, data);
        totalSupply[id] = _initialSupply;
        initialPricePerToken[id] = _initialPricePerToken;

        payoutPerTokenAtSale[id] =
            (_initialPricePerToken * _yieldAtSale) /
            1e18;

        emit AppartmentMinted(
            id,
            _initialPricePerToken,
            _yieldAtSale,
            _initialSupply
        );
    }
}