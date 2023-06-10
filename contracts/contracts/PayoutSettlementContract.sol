// SPDX-License-Identifier: TODO
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

error PayoutSettlementContract__NFTdoesNotExist();
error PayoutSettlementContract__InsufficientTokensAvailableForTransfer();
error PayoutSettlementContract__UserDoesNotHaveABalance();
error PayoutSettlementContract__PayoutsNotClaimableYet();

contract PayoutSettlementContract {
    //mapping nft id to boolean flag. payout should be organised per property
    mapping(uint256 => bool) payoutAllowedToBeClaimed;

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
        uint requiredFundsToDistribute = token.getPayoutPerTokenAtSale(id);
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

        uint256 amount = (balance * token.getPayoutPerTokenAtSale(id)) /
            10e18;
        token.stableCoinAddress().transfer(msg.sender, amount);
    }
}
