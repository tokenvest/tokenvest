// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.19;

import "contracts/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract Listings {
    struct Listing {
        address seller;
        IToken token;
        uint256 id;
        uint256 unitsAvailable;
        // wei/unit
        uint256 unitPrice;
    }

    Listing[] public listings;

    event ListingChanged(address indexed seller, uint256 indexed index);

    function cost(uint256 index, uint256 units) public view returns (uint256) {
        Listing storage listing = listings[index];
        return units * listing.unitPrice;
    }

    function list(
        IToken token,
        uint256 id,
        uint256 units,
        uint256 unitPrice
    ) public {
        require(
            token.isApprovedForAll(msg.sender, address(this)),
            "not approved"
        );

        uint index = listings.length;
        Listing memory listing = Listing({
            seller: msg.sender,
            token: token,
            id: id,
            unitsAvailable: units,
            unitPrice: unitPrice
        });

        listings.push(listing);
        emit ListingChanged(msg.sender, index);
    }

    function cancel(uint256 index) public {
        require(listings[index].seller == msg.sender);
        delete (listings[index]);
        emit ListingChanged(msg.sender, index);
    }

    function buy(uint256 index, uint256 units) public {
        require(0 < units && index < listings.length, "invalid request");
        Listing storage listing = listings[index];

        require(listing.unitsAvailable >= units);
        listing.unitsAvailable -= units;
        listing.token.safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.id,
            units,
            ""
        );

        uint256 totalCost = (units * listing.unitPrice);

        require(listing.token.stableCoinAddress().transferFrom(msg.sender, listing.seller, totalCost), "transfer failed.");

        emit ListingChanged(listing.seller, index);
    }
}
