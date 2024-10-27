// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeNFT is ERC721URIStorage, Ownable(msg.sender) {
    uint256 public tokenCounter;

    event NFTCreated(address owner, uint256 tokenId, string tokenURI);

    constructor() ERC721("memeNFT", "meme") {
        tokenCounter = 0;
    }

    function createNFT(string memory tokenURI, address to) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter += 1;
        emit NFTCreated(to, newTokenId, tokenURI);
        return newTokenId;
    }
}
