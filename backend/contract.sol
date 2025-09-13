// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Constructor sets the ERC721 name/symbol and the contract owner
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
        Ownable(msg.sender) // Set deployer as owner
    {}

    /// @notice Mint a new NFT to a specific address with a tokenURI
    /// @param to The recipient address
    /// @param tokenURI The metadata URI (usually IPFS)
    /// @return tokenId The ID of the newly minted token
    function mintNFT(address to, string memory tokenURI)
        external
        onlyOwner
        returns (uint256)
    {
        // Increment token counter
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint the NFT
        _mint(to, newTokenId);

        // Set the metadata URI
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    /// @notice Optional helper to get the current total minted NFTs
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }
}
