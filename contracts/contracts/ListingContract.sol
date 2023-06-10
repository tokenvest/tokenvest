// SPDX-License-Identifier: TODO

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract ListingContract {
    struct Listing {
        address seller;
        IERC1155 token;
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
        IERC1155 token,
        uint256 id,
        uint256 units,
        uint256 unitPrice
    ) public {
        require(token.isApprovedForAll(msg.sender, address(this)), "not approved");

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

    function buy(uint256 index, uint256 units) public payable {
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
        require(msg.value == totalCost);
        (bool success, ) = listing.seller.call{value: totalCost}("");
        require(success, "transfer failed.");

        emit ListingChanged(listing.seller, index);
    }
}
