import { BrowserProvider, Contract, formatUnits } from "ethers";

const provider = new BrowserProvider(window.ethereum);

export const fetchTokenData = async (tokenAddress: string, userAddress: string) => {
  const tokenContract = new Contract(
    tokenAddress,
    [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ],
    provider
  );

  const [name, symbol, totalSupply, userBalance, decimals] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.totalSupply(),
    tokenContract.balanceOf(userAddress),
    tokenContract.decimals(),
  ]);

  return {
    name,
    symbol,
    totalSupply: formatUnits(totalSupply, decimals),
    userBalance: formatUnits(userBalance, decimals),
    decimals
  };
};
