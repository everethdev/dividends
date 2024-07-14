import React, { useState, useEffect } from 'react';

const trendingTokens = [
  '0x5026f006b85729a8b14553fae6af249ad16c9aab',
  '0x68BbEd6A47194EFf1CF514B50Ea91895597fc91E',
  '0xb90b2a35c65dbc466b04240097ca756ad2005295',
  '0xd29da236dd4aac627346e1bba06a619e8c22d7c5',
  '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
  '0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a',
];

interface TokenData {
  symbol: string;
}

interface TrendingTokensProps {
  setTokenAddress: (tokenAddress: string) => void;
}

const TrendingTokens = ({ setTokenAddress }: TrendingTokensProps) => {
  const [tokenData, setTokenData] = useState<{ [tokenAddress: string]: TokenData }>({});

  const fetchTokenData = async (tokenAddress: string) => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${tokenAddress}`);
      const data = await response.json();
      const pair = data.pairs.find((p: any) => p.baseToken.address.toLowerCase() === tokenAddress.toLowerCase());

      if (pair) {
        const { symbol } = pair.baseToken;
        setTokenData((prevData) => ({
          ...prevData,
          [tokenAddress]: { symbol },
        }));
      }
    } catch (error) {
      console.error(`Error fetching data for token ${tokenAddress}:`, error);
    }
  };

  const handleTokenClick = (tokenAddress: string) => {
    setTokenAddress(tokenAddress);
  };

  useEffect(() => {
    trendingTokens.forEach((tokenAddress) => {
      fetchTokenData(tokenAddress);
    });
  }, []);

  return (
    <div className="flex flex-wrap gap-4 mt-5">
      {trendingTokens.map((tokenAddress) => (
        <div
          key={tokenAddress}
          className="bg-zinc-950 p-4 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:bg-zinc-800"
          onClick={() => handleTokenClick(tokenAddress)}
        >
          <img
            src={`https://dd.dexscreener.com/ds-data/tokens/ethereum/${tokenAddress}.png`}
            alt={tokenData[tokenAddress]?.symbol || 'Token'}
            className="w-8 h-8 rounded-full"
          />
          <span>{tokenData[tokenAddress]?.symbol || ''}</span>
        </div>
      ))}
    </div>
  );
};

export default TrendingTokens;