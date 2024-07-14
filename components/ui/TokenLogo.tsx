import React, { useEffect, useState } from 'react';

interface TokenLogoProps {
  tokenAddress: string;
  tokenSymbol: string;
}

const TokenLogo: React.FC<TokenLogoProps> = ({ tokenAddress, tokenSymbol }) => {
  const [logoSrc, setLogoSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const dexScreenerUrl = `https://dd.dexscreener.com/ds-data/tokens/ethereum/${tokenAddress}.png`;
        const response = await fetch(dexScreenerUrl);
        if (response.ok && response.headers.get('Content-Type')?.includes('image/')) {
          setLogoSrc(dexScreenerUrl);
        } else {
          // If DexScreener doesn't have the logo, try DexTools
          const dexToolsUrl = `https://www.dextools.io/resources/tokens/logos/ether/${tokenAddress}.png`;
          const dexToolsResponse = await fetch(dexToolsUrl);
          if (dexToolsResponse.ok && dexToolsResponse.headers.get('Content-Type')?.includes('image/')) {
            setLogoSrc(dexToolsUrl);
          } else {
            setLogoSrc('');
          }
        }
      } catch (error) {
        console.error('Error fetching token logo:', error);
        setLogoSrc('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [tokenAddress]);

  if (isLoading) {
    return <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse" />;
  }

  if (!logoSrc) {
    return (
      <div className="w-6 h-6 bg-gray-200 text-black rounded-full flex items-center justify-center">
        <span>{tokenSymbol?.charAt(0)}</span>
      </div>
    );
  }

  return <img src={logoSrc} alt={tokenSymbol} className="w-6 h-6 rounded-full" />;
};

export default TokenLogo;