import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend URL
});

// Mint NFT
export const mintNFT = (to_address, ipfs_uri) =>
  API.post("/mint", { to_address, ipfs_uri });

// Get Owner
export const getOwner = (tokenId) => API.get(`/owner/${tokenId}`);

// Get TokenURI
export const getTokenURI = (tokenId) => API.get(`/token-uri/${tokenId}`);
