// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./KYC.sol";

abstract contract Token is ERC1155, KYC {
    IERC20 public stableCoinAddress;

    mapping(uint256 => uint256) totalSupply;
    mapping(uint256 => uint256) initialPricePerToken;
    mapping(uint256 => uint256) payoutPerTokenAtSale;

    event AppartmentMinted(
        uint256 id,
        uint256 initialPricePerToken,
        uint256 initialYieldPerToken,
        uint256 totalSupply
    );

    constructor(
        string memory _uri,
        address _signerAddress,
        address[] memory _owners,
        address _stableCoinAddress
    )
        ERC1155(_uri)
        KYC(_signerAddress, _owners)
    {
        stableCoinAddress = IERC20(_stableCoinAddress);
    }

    function getTotalSupply(uint256 id) public view returns (uint256) {
        return totalSupply[id];
    }

    function getInitialPricePerToken(uint256 id) public view returns (uint256) {
        return initialPricePerToken[id];
    }

    function getPayoutPerTokenAtSale(uint256 id) public view returns (uint256) {
        return payoutPerTokenAtSale[id];
    }

    function _mintToken(
        address to,
        uint256 id,
        uint256 _initialSupply,
        uint256 _initialPricePerToken,
        uint256 _yieldAtSale
    ) internal {
        _mint(to, id, _initialSupply, "");
        totalSupply[id] = _initialSupply;
        initialPricePerToken[id] = _initialPricePerToken;

        payoutPerTokenAtSale[id] =
            (_initialPricePerToken * (1e18 + _yieldAtSale)) /
            1e18;

        emit AppartmentMinted(
            id,
            _initialPricePerToken,
            _yieldAtSale,
            _initialSupply
        );
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override onlyKYCed(from) onlyKYCed(to) {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override onlyKYCed(from) onlyKYCed(to) {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
