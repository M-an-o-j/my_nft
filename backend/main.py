from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from web3 import Web3
import json
import os
from dotenv import load_dotenv

# ----------------------------
# Load ENV
# ----------------------------
load_dotenv()

# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI(title="NFT Minting API")

# ----------------------------
# Blockchain Connection
# ----------------------------
INFURA_URL = f"https://eth-sepolia.g.alchemy.com/v2/{os.getenv('ALCHEMY_KEY')}"
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

if not w3.is_connected():
    raise Exception("❌ Web3 not connected")

# ----------------------------
# Contract Setup
# ----------------------------
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
OWNER_ADDRESS = os.getenv("OWNER_ADDRESS")
PRIVATE_KEY = os.getenv("OWNER_PRIVATE_KEY")

with open("MyNFT_abi.json", "r") as f:  # Save ABI JSON exported from Remix
    contract_abi = json.load(f)

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)


# ----------------------------
# Pydantic Models
# ----------------------------
class MintRequest(BaseModel):
    to_address: str
    ipfs_uri: str


# ----------------------------
# Blockchain Helpers
# ----------------------------
def mint_nft(to_address: str, ipfs_uri: str):
    try:
        nonce = w3.eth.get_transaction_count(OWNER_ADDRESS)

        tx = contract.functions.mintNFT(to_address, ipfs_uri).build_transaction({
            "from": OWNER_ADDRESS,
            "nonce": nonce,
            "gas": 300000,
            "gasPrice": w3.to_wei("20", "gwei"),
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        return receipt
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_owner(token_id: int):
    try:
        return contract.functions.ownerOf(token_id).call()
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


def get_token_uri(token_id: int):
    try:
        return contract.functions.tokenURI(token_id).call()
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# ----------------------------
# API Routes
# ----------------------------
@app.post("/mint")
def mint(request: MintRequest):
    receipt = mint_nft(request.to_address, request.ipfs_uri)
    return {
        "status": "success",
        "transactionHash": receipt.transactionHash.hex(),
    }


@app.get("/owner/{token_id}")
def owner(token_id: int):
    owner = get_owner(token_id)
    return {"tokenId": token_id, "owner": owner}


@app.get("/token-uri/{token_id}")
def token_uri(token_id: int):
    uri = get_token_uri(token_id)
    return {"tokenId": token_id, "tokenURI": uri}
