// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./Token.sol";

error PayoutSettlementContract__NFTdoesNotExist();
error PayoutSettlementContract__InsufficientTokensAvailableForTransfer();
error PayoutSettlementContract__UserDoesNotHaveABalance();
error PayoutSettlementContract__PayoutsNotClaimableYet();

contract PayoutSettlementContract is IERC1155Receiver {
    //mapping nft id to boolean flag. payout should be organised per property
    mapping(uint256 => bool) payoutAllowedToBeClaimed;
    mapping(uint256 => uint256) payoutPerToken;

    Token token;

    event AppartmentSold(
        uint256 id,
        uint256 amountAvailable,
        address funderAddress
    );

    constructor(address _buildingNFTaddress) {
        token = Token(_buildingNFTaddress);
    }

    function setNFTasSold(uint256 id) external {
        if (token.getTotalSupply(id) == 0)
            revert PayoutSettlementContract__NFTdoesNotExist();
        uint requiredFundsToDistribute = token.getPayoutPerTokenAtSale(id) *
            token.getTotalSupply(id);
        bool success = token.stableCoinAddress().transferFrom(
            msg.sender,
            address(this),
            requiredFundsToDistribute
        );
        if (!success)
            revert PayoutSettlementContract__InsufficientTokensAvailableForTransfer();
        payoutAllowedToBeClaimed[id] = true;
        emit AppartmentSold(id, requiredFundsToDistribute, msg.sender);
    }

    function withdrawFunds(uint256 id) public {
        uint256 balance = token.balanceOf(msg.sender, id);
        if (!payoutAllowedToBeClaimed[id])
            revert PayoutSettlementContract__PayoutsNotClaimableYet();
        if (balance == 0)
            revert PayoutSettlementContract__UserDoesNotHaveABalance();
        bytes memory emptyData;
        token.safeTransferFrom(
            msg.sender,
            address(this),
            id,
            balance,
            emptyData
        );

        uint256 amount = (balance * token.getPayoutPerTokenAtSale(id));
        token.stableCoinAddress().transfer(msg.sender, amount);
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) public pure returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address,address,uint256,uint256,bytes)"
                )
            );
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) public pure returns (bytes4) {
        return bytes4(0x00); // Reject!
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }
}
