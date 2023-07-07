// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./KYC.sol";

error Token__CanOnlyBeCalledByApprovedCaller();

abstract contract Token is ERC1155, KYC {
    IERC20 public stableCoinAddress;

    mapping(uint256 => uint256) totalSupply;

    event AppartmentMinted(uint256 id, uint256 totalSupply);

    address public approvedCaller; //the multisig contract address

    modifier onlyApprovedCaller() {
        if (msg.sender != approvedCaller)
            revert Token__CanOnlyBeCalledByApprovedCaller();
        _;
    }

    constructor(
        string memory _uri,
        address _signerAddress,
        address[] memory _owners,
        address _stableCoinAddress,
        address _approvedCaller
    ) ERC1155(_uri) KYC(_signerAddress, _owners) {
        approvedCaller = _approvedCaller;
        stableCoinAddress = IERC20(_stableCoinAddress);
    }

    function getTotalSupply(uint256 id) external view returns (uint256) {
        return totalSupply[id];
    }

    function mintToken(
        address to,
        uint256 id,
        uint256 _initialSupply
    ) external onlyApprovedCaller {
        _mint(to, id, _initialSupply, "");
        totalSupply[id] = _initialSupply;

        emit AppartmentMinted(id, _initialSupply);
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
