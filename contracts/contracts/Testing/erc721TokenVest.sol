// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenVest is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant TOKEN_PRICE = 100 * 10 ** 18;
    IERC20 public constant paymentToken =
        IERC20(0x47f917EE1b0BE0D5fB51d45c0519882875fB3457);

    constructor() ERC721("TokenVest", "TKV") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmfR5DzK9UMWBWBrPYxpZheSSiPd2jksoy5iZLv26m5tSD";
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _baseURI();
    }

    function safeMint(address to, uint256 numTokens) public {
        require(
            _tokenIdCounter.current() + numTokens <= MAX_SUPPLY,
            "Token minting would exceed max supply"
        );
        uint256 totalPrice = TOKEN_PRICE * numTokens;
        require(
            paymentToken.balanceOf(msg.sender) >= totalPrice,
            "Not enough tokens for purchase"
        );
        require(
            paymentToken.allowance(msg.sender, address(this)) >= totalPrice,
            "Contract not allowed to transfer enough tokens"
        );

        for (uint256 i = 0; i < numTokens; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(to, tokenId);
        }

        paymentToken.transferFrom(msg.sender, address(this), totalPrice);
    }
}
