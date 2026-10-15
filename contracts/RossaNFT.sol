// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Minimal ERC-721 contract for the X402 OpenSea NFT Studio.
 * Deploy to Base Mainnet (chain ID 8453). Public minting is enabled;
 * each successful mint creates one token owned by the recipient.
 */
contract RossaNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    constructor() ERC721("X402 Digital Collectibles", "X402NFT") Ownable(msg.sender) {}

    function mint(address to, string calldata tokenURI_) external returns (uint256 tokenId) {
        require(to != address(0), "Invalid recipient");
        require(bytes(tokenURI_).length > 0, "Token URI required");
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }
}
