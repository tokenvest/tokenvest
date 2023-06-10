// SPDX-License-Identifier: TODO
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Building.sol";

error PayoutSettlementContract__NFTdoesNotExist();
error PayoutSettlementContract__InsufficientTokensAvailableForTransfer();
error PayoutSettlementContract__UserDoesNotHaveABalance();
error PayoutSettlementContract__PayoutsNotClaimableYet();

contract PayoutSettlementContract {
    IERC20 stableCoinAddress;

    //mapping nft id to boolean flag. payout should be organised per property
    mapping(uint256 => bool) payoutAllowedToBeClaimed;

    Building building;

    event AppartmentSold(
        uint256 id,
        uint256 amountAvailable,
        address funderAddress
    );

    constructor(address _stableCoinAddress, address _buildingNFTaddress) {
        building = Building(_buildingNFTaddress);
        stableCoinAddress = IERC20(_buildingNFTaddress);
    }

    function setNFTasSold(uint256 id) external {
        if (building.getTotalSupply(id) == 0)
            revert PayoutSettlementContract__NFTdoesNotExist();
        uint requiredFundsToDistribute = building.getPayoutPerTokenAtSale(id);
        bool success = stableCoinAddress.transferFrom(
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
        uint256 balance = building.balanceOf(msg.sender, id);
        if (!payoutAllowedToBeClaimed[id])
            revert PayoutSettlementContract__PayoutsNotClaimableYet();
        if (balance == 0)
            revert PayoutSettlementContract__UserDoesNotHaveABalance();
        bytes memory emptyData;
        building.safeTransferFrom(
            msg.sender,
            address(this),
            id,
            balance,
            emptyData
        );

        uint256 amount = (balance * building.getPayoutPerTokenAtSale(id)) /
            10e18;
        stableCoinAddress.transfer(msg.sender, amount);
    }
}
