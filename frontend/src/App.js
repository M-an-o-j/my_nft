import React, { useState } from "react";
import { Wallet, Coins, Eye, Link, Sparkles, ArrowRight, Copy, ExternalLink } from "lucide-react";

// Import your actual API functions
import { mintNFT, getOwner, getTokenURI } from "./api";

function App() {
  // State for mint form
  const [toAddress, setToAddress] = useState("");
  const [ipfsUri, setIpfsUri] = useState("");
  const [mintResult, setMintResult] = useState("");
  
  // State for query forms
  const [tokenId, setTokenId] = useState("");
  const [owner, setOwner] = useState("");
  const [uri, setUri] = useState("");
  
  // Loading states
  const [isLoading, setIsLoading] = useState({ 
    mint: false, 
    owner: false, 
    uri: false 
  });

  // Utility function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Handle Mint NFT
  const handleMint = async () => {
    if (!toAddress || !ipfsUri) {
      setMintResult("❌ Please fill in all fields");
      return;
    }

    setIsLoading(prev => ({ ...prev, mint: true }));
    setMintResult(""); // Clear previous results
    
    try {
      console.log("Starting mint process...", { toAddress, ipfsUri });
      const res = await mintNFT(toAddress, ipfsUri);
      console.log("Mint response:", res);
      
      // Handle different response structures
      const txHash = res.data?.transactionHash || res.transactionHash || res.hash || "Unknown";
      setMintResult(`✅ Minted! TxHash: ${txHash}`);
    } catch (err) {
      console.error("Mint error:", err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          "Unknown error occurred";
      setMintResult("❌ Error: " + errorMessage);
    } finally {
      // Always reset loading state
      setIsLoading(prev => ({ ...prev, mint: false }));
    }
  };

  // Handle Get Owner
  const handleGetOwner = async () => {
    if (!tokenId) {
      setOwner("❌ Please enter a token ID");
      return;
    }

    setIsLoading(prev => ({ ...prev, owner: true }));
    setOwner(""); // Clear previous results
    
    try {
      console.log("Getting owner for token:", tokenId);
      const res = await getOwner(tokenId);
      console.log("Owner response:", res);
      
      // Handle different response structures
      const ownerAddress = res.data?.owner || res.owner || "Unknown";
      setOwner(ownerAddress);
    } catch (err) {
      console.error("Get owner error:", err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          "Unknown error occurred";
      setOwner("❌ Error: " + errorMessage);
    } finally {
      // Always reset loading state
      setIsLoading(prev => ({ ...prev, owner: false }));
    }
  };

  // Handle Get TokenURI
  const handleGetURI = async () => {
    if (!tokenId) {
      setUri("❌ Please enter a token ID");
      return;
    }

    setIsLoading(prev => ({ ...prev, uri: true }));
    setUri(""); // Clear previous results
    
    try {
      console.log("Getting URI for token:", tokenId);
      const res = await getTokenURI(tokenId);
      console.log("URI response:", res);
      
      // Handle different response structures
      const tokenUri = res.data?.tokenURI || res.tokenURI || res.uri || "Unknown";
      setUri(tokenUri);
    } catch (err) {
      console.error("Get URI error:", err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          "Unknown error occurred";
      setUri("❌ Error: " + errorMessage);
    } finally {
      // Always reset loading state
      setIsLoading(prev => ({ ...prev, uri: false }));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              NFT Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create, manage, and explore your NFT collection with our powerful Web3 dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mint NFT Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Mint NFT</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Receiver Address</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="0x742d35Cc6634C0532925a3b8D6Ac6f1B5c7482"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleMint)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">IPFS URI</label>
                <div className="relative">
                  <Link className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ipfs://QmYourTokenMetadata..."
                    value={ipfsUri}
                    onChange={(e) => setIpfsUri(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleMint)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <button
                onClick={handleMint}
                disabled={isLoading.mint}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading.mint ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <span>Mint NFT</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            
            {mintResult && (
              <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
                <p className="text-sm text-white flex items-center justify-between">
                  <span className="break-all">{mintResult}</span>
                  {mintResult.includes('TxHash') && (
                    <div className="flex space-x-2 ml-2">
                      <button 
                        onClick={() => copyToClipboard(mintResult.split('TxHash: ')[1])}
                        className="hover:text-blue-400 transition-colors"
                        title="Copy transaction hash"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        className="hover:text-blue-400 transition-colors"
                        title="View on explorer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Query Sections */}
          <div className="space-y-8">
            {/* Get Owner Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Get Owner</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Token ID</label>
                  <input
                    type="number"
                    placeholder="1234"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleGetOwner)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                  />
                </div>
                
                <button
                  onClick={handleGetOwner}
                  disabled={isLoading.owner}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading.owner ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'Get Owner'
                  )}
                </button>
              </div>
              
              {owner && (
                <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
                  <p className="text-sm text-white flex items-center justify-between">
                    <span className="break-all">
                      {owner.includes('Error') 
                        ? owner 
                        : `Owner: ${owner.slice(0, 10)}...${owner.slice(-8)}`
                      }
                    </span>
                    {!owner.includes('Error') && (
                      <button 
                        onClick={() => copyToClipboard(owner)}
                        className="hover:text-green-400 transition-colors ml-2"
                        title="Copy owner address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Get Token URI Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                  <Link className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Get Token URI</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Token ID</label>
                  <input
                    type="number"
                    placeholder="1234"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleGetURI)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  />
                </div>
                
                <button
                  onClick={handleGetURI}
                  disabled={isLoading.uri}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading.uri ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'Get Token URI'
                  )}
                </button>
              </div>
              
              {uri && (
                <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
                  <p className="text-sm text-white flex items-center justify-between">
                    <span className="break-all">
                      {uri.includes('Error') 
                        ? uri 
                        : `URI: ${uri.slice(0, 20)}...${uri.slice(-10)}`
                      }
                    </span>
                    {!uri.includes('Error') && (
                      <div className="flex space-x-2 ml-2">
                        <button 
                          onClick={() => copyToClipboard(uri)}
                          className="hover:text-purple-400 transition-colors"
                          title="Copy URI"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          className="hover:text-purple-400 transition-colors"
                          title="Open URI"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Easy Minting</h3>
            <p className="text-gray-400 text-sm">Mint NFTs directly to any wallet address with IPFS metadata support</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Owner Lookup</h3>
            <p className="text-gray-400 text-sm">Quickly find the current owner of any NFT by token ID</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Link className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Metadata Access</h3>
            <p className="text-gray-400 text-sm">Retrieve token URIs and access NFT metadata instantly</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <p className="text-gray-400">Powered by Web3 • Built with React</p>
          <p className="text-gray-500 text-sm mt-2">Connect your wallet and start managing your NFT collection</p>
        </div>
      </div>
    </div>
  );
}

export default App;