"use client";

const isClient = typeof window !== 'undefined';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { parseUnits, formatUnits, parseEther } from 'ethers';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGlobe, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } from '@uniswap/sdk';
import { ethers } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { AddressZero } from '@ethersproject/constants';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { formatNumber } from '@/lib/utils';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import AlertNotification from '@/components/ui/AlertNotification';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PolarAreaAnimationOptions } from 'chart.js';
import CountUp from 'react-countup';
import holdersData from './holders.json';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import everbuddiesData from './everbuddies.json';
import InfoIcon from '@/components/ui/InfoIcon';
import DisclaimerNotification from '@/components/DisclaimerNotification';


Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);




const EverETHTokenAddress = '0xe46a1D19962Ea120765D3139c588fFd617bE04A8';
const EverETHDividendTrackerAddress = '0x5D87Df89c3bBeB2EBb399DB86aDb288542e9f0bd';
const pairAddress = '0x78C2fe507Aab949Bdf1777D92b2b7A6057c261ef';

const EverETHDividendTrackerABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"bool","name":"automatic","type":"bool"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"newValue","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"oldValue","type":"uint256"}],"name":"ClaimWaitUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"weiAmount","type":"uint256"}],"name":"DividendWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"weiAmount","type":"uint256"}],"name":"DividendsDistributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"}],"name":"ERC20Recovered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"ExcludeFromDividends","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"newValue","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"oldValue","type":"uint256"}],"name":"MinimumHoldPeriodUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"ADMIN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"accumulativeDividendOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"canProcessAccount","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimWait","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"depositRewardEETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"distributeEETHDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"dividendOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"excludedFromDividends","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"firstHoldTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"getAccount","outputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"int256","name":"index","type":"int256"},{"internalType":"uint256","name":"withdrawableDividends","type":"uint256"},{"internalType":"uint256","name":"totalDividends","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"},{"internalType":"uint256","name":"nextClaimTime","type":"uint256"},{"internalType":"uint256","name":"secondsUntilNextClaimAvailable","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getAccountAtIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"int256","name":"","type":"int256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentDividendYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getDividendAccountInfo","outputs":[{"internalType":"uint256","name":"withdrawableDividends","type":"uint256"},{"internalType":"uint256","name":"totalDividends","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"},{"internalType":"uint256","name":"nextClaimTime","type":"uint256"},{"internalType":"uint256","name":"secondsUntilNextClaimAvailable","type":"uint256"},{"internalType":"bool","name":"isEligibleForClaim","type":"bool"},{"internalType":"uint256","name":"timeUntilEligible","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getNextDividendPaymentEstimate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfTokenHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getTotalDividendsDistributedTo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isAccountEligibleForClaim","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimTimes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimumHoldPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimumTokenBalanceForDividends","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"account","type":"address"},{"internalType":"bool","name":"automatic","type":"bool"}],"name":"processAccount","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"recoverERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"recoverETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"account","type":"address"},{"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"setBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"newBalance","type":"uint256[]"}],"name":"setBalanceMultiple","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"timeUntilEligibleForClaim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDividendsDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newClaimWait","type":"uint256"}],"name":"updateClaimWait","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newMinimumHoldPeriod","type":"uint256"}],"name":"updateMinimumHoldPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newMinimumBalance","type":"uint256"}],"name":"updateMinimumTokenBalanceForDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawDividend","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"withdrawableDividendOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"withdrawnDividendOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const EverETHABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"dividendTokenBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dividendTracker","outputs":[{"internalType":"contract EverETHDividendTracker","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountDividendsInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"int256","name":"","type":"int256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getAccountDividendsInfoAtIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"int256","name":"","type":"int256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfDividendTokenHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalDividendsDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"recoverERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"recoverETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"claimWait","type":"uint256"}],"name":"updateClaimWait","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"updateDividendTracker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"withdrawableDividendOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]


const Page = () => {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const [tokenData, setTokenData] = useState<any>(null);
  const [userHoldings, setUserHoldings] = useState<any>(null);
  const [pendingRewards, setPendingRewards] = useState<any>(null);
  const [totalRewards, setTotalRewards] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [transactionMessage, setTransactionMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState('Auto');
  const [transactionDeadline, setTransactionDeadline] = useState(10);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quote, setQuote] = useState('');
  const { address: userAddress } = useAccount();
  const [accountIndex, setAccountIndex] = useState<string | null>(null);
const [iterationsUntilProcessed, setIterationsUntilProcessed] = useState<string | null>(null);
const [totalDividends, setTotalDividends] = useState<number | null>(null);
const [nextClaimTime, setNextClaimTime] = useState<string | null>(null);
const [secondsUntilAutoClaim, setSecondsUntilAutoClaim] = useState<string | null>(null);
const [totalDividendsDistributed, setTotalDividendsDistributed] = useState<number | null>(null);
const [ethPrice, setEthPrice] = useState<number | null>(null);
const [holderPosition, setHolderPosition] = useState<number | null>(null);
const [rewardsHistory, setRewardsHistory] = useState<any[]>([]);
const [isEverBuddy, setIsEverBuddy] = useState<boolean>(false);
const [latestTrades, setLatestTrades] = useState<any[]>([]);
const [latestDividendPayments, setLatestDividendPayments] = useState<any[]>([]);
const [isEligibleForClaim, setIsEligibleForClaim] = useState(false);
const [timeUntilEligible, setTimeUntilEligible] = useState(null);
const [accumulativeDividends, setAccumulativeDividends] = useState(0);
const [withdrawnDividends, setWithdrawnDividends] = useState(0);
const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null);
const [withdrawableDividends, setWithdrawableDividends] = useState(0);
const [timeUntilEligibleForClaim, setTimeUntilEligibleForClaim] = useState(0);
const [nextDividendPaymentEstimate, setNextDividendPaymentEstimate] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTokenData(EverETHTokenAddress, userAddress?.toString() ?? '');
      setTokenData(data);
      
      // Fetch dividend tracker data
      const fetchedAccumulativeDividends = await fetchAccumulativeDividends(EverETHDividendTrackerAddress, userAddress?.toString() ?? '');
      setAccumulativeDividends(fetchedAccumulativeDividends);

      const fetchedWithdrawnDividends = await fetchWithdrawnDividends(EverETHDividendTrackerAddress, userAddress?.toString() ?? '');
      setWithdrawnDividends(fetchedWithdrawnDividends);

      const fetchedLastClaimTime = await fetchLastClaimTime(EverETHDividendTrackerAddress, userAddress?.toString() ?? '');
      setLastClaimTime(fetchedLastClaimTime);

      const fetchedWithdrawableDividends = await fetchWithdrawableDividends(EverETHDividendTrackerAddress, userAddress?.toString() ?? '');
      setWithdrawableDividends(fetchedWithdrawableDividends);

      const fetchedTimeUntilEligibleForClaim = await fetchTimeUntilEligibleForClaim(EverETHDividendTrackerAddress, userAddress?.toString() ?? '');
      setTimeUntilEligibleForClaim(fetchedTimeUntilEligibleForClaim);

      const fetchedNextDividendPaymentEstimate = await fetchNextDividendPaymentEstimate(EverETHDividendTrackerAddress, userAddress?.toString() ?? '');
      setNextDividendPaymentEstimate(fetchedNextDividendPaymentEstimate);

      
      // Fetch user holdings and supply
      const userHoldings = await fetchUserHoldings(EverETHTokenAddress, userAddress?.toString() ?? '');
      setUserHoldings(userHoldings);
      
      // Fetch pending rewards and total rewards
      const pendingRewards = await fetchPendingRewards(EverETHTokenAddress, userAddress?.toString() ?? '');  
      setPendingRewards(pendingRewards);

    // Fetch total dividends
    const fetchedTotalDividends = await fetchTotalDividends(EverETHTokenAddress, userAddress?.toString() ?? '');
    setTotalDividends(fetchedTotalDividends);

     // Fetch total dividends distributed
     const fetchedTotalDividendsDistributed = await fetchTotalDividendsDistributed(EverETHTokenAddress);
     setTotalDividendsDistributed(fetchedTotalDividendsDistributed);

    // Fetch rewards history
    const rewardsData = await fetchRewardsHistory(userAddress?.toString() ?? '');
    setRewardsHistory(rewardsData);
    

        // Fetch everbuddy

        const checkEverBuddyStatus = (address: string) => {
          const normalizedAddress = address.toLowerCase();
          return everbuddiesData.everbuddies.some(
            (everbuddyAddress) => everbuddyAddress.toLowerCase() === normalizedAddress
          );
        };

        if (userAddress) {
          console.log("User address:", userAddress);
          console.log("EverBuddies list:", everbuddiesData.everbuddies);
          const isEverBuddyStatus = checkEverBuddyStatus(userAddress);
          console.log("Is EverBuddy:", isEverBuddyStatus);
          setIsEverBuddy(isEverBuddyStatus);
        }


    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
      const data = await response.json();
      setEthPrice(parseFloat(data.price));
    } catch (error) {
      console.error('Error fetching ETH price:', error);
    }
  };
    
    fetchData();
  }, [userAddress]);


  useEffect(() => {
    if (isConnected && userAddress) {
      const fetchTrades = async () => {
        const trades = await fetchLatestTrades(userAddress);
        setLatestTrades(trades);
      };
  
      fetchTrades();
      const interval = setInterval(fetchTrades, 60000); // Refresh every minute
  
      return () => clearInterval(interval);
    }
  }, [isConnected, userAddress]);

  useEffect(() => {
    const fetchDividendPayments = async () => {
      const payments = await fetchLatestDividendPayments();
      setLatestDividendPayments(payments);
    };
  
    fetchDividendPayments();
    const interval = setInterval(fetchDividendPayments, 60000); // Refresh every minute
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHolderPosition = () => {
      if (userAddress) {
        const holders = holdersData.map((row) => {
          const [address, balance, isExcluded] = row.replace(/"/g, '').split(',');
          return { address, balance, isExcluded };
        });
  
        const sortedHolders = holders.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
        const position = sortedHolders.findIndex((holder) => holder.address.toLowerCase() === userAddress.toLowerCase());
        setHolderPosition(position !== -1 ? position + 1 : null);
      }
    };
  
    fetchHolderPosition();
  }, [userAddress]);

  const handleClaim = async () => {
    if (!isConnected) {
      setTransactionMessage('Please connect your wallet');
      return;
    }

    if (!isEligibleForClaim) {
      setTransactionMessage('You are not yet eligible to claim rewards');
      return;
    }
  
    try {
      setIsLoading(true);
      setTransactionMessage('Claiming rewards...');
  
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const everEthContract = new Contract(EverETHTokenAddress, EverETHABI, signer);
  
      const tx = await everEthContract.claim();
      setTransactionMessage('Claim transaction submitted. Waiting for confirmation...');
  
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setTransactionMessage('Rewards claimed successfully!');
        // Refresh the pending rewards
        const newPendingRewards = await fetchPendingRewards(EverETHTokenAddress, userAddress?.toString() ?? '');
        setPendingRewards(newPendingRewards);
      } else {
        setTransactionMessage('Claim transaction failed. Please try again.');
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setTransactionMessage('Error claiming rewards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchAndUpdateTokenData = async () => {
    try {
      const data = await fetchTokenData(
        EverETHTokenAddress,
        userAddress?.toString() ?? ''
      );
      setTokenData(data);
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAndUpdateTokenData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [userAddress]);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  interface DexScreenerPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    labels: string[];
    baseToken: {
      address: string;
      name: string;
      symbol: string;
    };
    quoteToken: {
      address: string;
      name: string;
      symbol: string;
    };
    priceNative: string;
    priceUsd: string;
    txns: any; // Define the type for txns if needed
    volume: any; // Define the type for volume if needed
    priceChange: any; // Define the type for priceChange if needed
    liquidity: any; // Define the type for liquidity if needed
    fdv: number;
    pairCreatedAt: number;
  }

  const calculateQuote = async () => {
    if (!isClient || !tokenData || !isConnected || !userAddress) return;
  
    const provider = new Web3Provider(window.ethereum);
    const token = await Fetcher.fetchTokenData(ChainId.MAINNET, EverETHTokenAddress, provider);
    const weth = WETH[ChainId.MAINNET];
    const pair = await Fetcher.fetchPairData(token, weth, provider);
    const route = new Route([pair], action === 'buy' ? weth : token);
  
    if (action === 'buy') {
      if (!amount || parseFloat(amount) === 0) {
        setQuote('');
        return;
      }

      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const ethBalance = await signer.getBalance();
      const ethBalanceFormatted = parseFloat(ethers.formatEther(ethBalance.toString()));
  
      if (ethBalanceFormatted < parseFloat(amount)) {
        setQuote('Insufficient ETH balance');
        return;
      }
  
      const amountIn = ethers.parseEther(amount);
      const trade = new Trade(route, new TokenAmount(weth, amountIn), TradeType.EXACT_INPUT);
      const outputAmountRaw = trade.outputAmount.raw;
      const outputAmount = formatNumber(parseFloat(formatUnits(outputAmountRaw.toString(), token.decimals)));
  
      try {
        // Fetch WETH price from DexScreener API
        const wethPriceResponse = await fetch('https://api.dexscreener.com/latest/dex/search/?q=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
        const wethPriceData = await wethPriceResponse.json();
        const wethPair = wethPriceData.pairs.find((pair: DexScreenerPair) => pair.baseToken.symbol === 'WETH' && pair.chainId === 'ethereum');
        const wethPrice = wethPair ? parseFloat(wethPair.priceUsd) : null;
  
        if (wethPrice) {
          const usdAmount = parseFloat(amount) * wethPrice;
          const usdAmountFormatted = `$${usdAmount.toFixed(2)}`;
          setQuote(`≈ ${outputAmount} ${tokenData.symbol} (${usdAmountFormatted})`);
        } else {
          setQuote(`≈ ${outputAmount} ${tokenData.symbol}`);
        }
      } catch (error) {
        console.error('Error fetching WETH price:', error);
        setQuote(`≈ ${outputAmount} ${tokenData.symbol}`);
      }
    } else {
      const tokenContract = new Contract(
        token.address,
        ['function balanceOf(address owner) view returns (uint256)'],
        provider
      );
      const tokenAmountBN = await tokenContract.balanceOf(userAddress);
      const tokenAmount = parseFloat(formatUnits(tokenAmountBN.toString(), token.decimals));
      const amountOut = parseFloat(amount || '0');
  
      if (tokenAmount < amountOut) {
        setQuote('Insufficient balance');
        return;
      }
  
      const usdAmount = amountOut * tokenData.tokenPrice;
  
      // Fetch WETH price from DexScreener API
      const wethPriceResponse = await fetch('https://api.dexscreener.com/latest/dex/search/?q=0x4e68ccd3e89f51c3074ca5072bbac773960dfa36');
      const wethPriceData = await wethPriceResponse.json();
      const wethPair = wethPriceData.pairs.find((pair: DexScreenerPair) => pair.baseToken.symbol === 'WETH' && pair.chainId === 'ethereum');
      const wethPrice = wethPair ? parseFloat(wethPair.priceUsd) : null;
  
      const ethAmount = wethPrice ? usdAmount / wethPrice : null;
      const formattedEthAmount = ethAmount ? ethAmount.toFixed(4) : '0';
      const usdAmountFormatted = `$${usdAmount.toFixed(2)}`;
  
      setQuote(`≈ ${formattedEthAmount} ETH (${usdAmountFormatted})`);
    }
  };
  
  useEffect(() => {
    calculateQuote();
  }, [amount, action, isConnected, tokenData]);

  

  const handleApproval = async () => {
    try {
      if (isClient) {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new Contract(
          EverETHTokenAddress,
          ['function approve(address spender, uint256 amount) external returns (bool)'],
          signer
        );

        const uniswap = new Contract(
          '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
          [
            'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
          ],
          signer
        );

        const amountIn = parseUnits(amount, tokenData.decimals);
        const approvalResponse = await tokenContract.approve(uniswap.address, amountIn);
        await approvalResponse.wait();
        console.log('Token spend approved.');
      }
    } catch (error) {
      console.error('Approval Error:', error);
      setIsLoading(false);
      setTransactionMessage('Approval Failed. Please try again.');
    }
  };
  

  const handleTransaction = async () => {
    if (!isConnected) {
      setTransactionMessage('Please Connect Your Wallet');
      return;
    }
  
    try {
      setIsLoading(true);
      setTransactionMessage('');
      setQuoteText('');
  
      if (isClient) {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
  
        const uniswap = new Contract(
          '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
          [
            'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
          ],
          signer
        );
  
        const path = [WETH[ChainId.MAINNET].address, EverETHTokenAddress];
        const deadline = Math.floor(Date.now() / 1000) + transactionDeadline * 60;
        const amountOutMin = 0; // Set to 0 to accept any amount of tokens or ETH
  
        let transactionResponse;
  
        if (action === 'buy') {
          const value = parseEther(amount);
  
          console.log('Swapping ETH to tokens...');
          transactionResponse = await uniswap.swapExactETHForTokens(
            amountOutMin,
            path,
            userAddress,
            deadline,
            { value: value }
          );
        } else if (action === 'sell') {
          const tokenContract = new Contract(
            EverETHTokenAddress,
            ['function allowance(address owner, address spender) external view returns (uint256)'],
            provider
          );
  
          const allowance = await tokenContract.allowance(userAddress, uniswap.address);
          const amountIn = parseUnits(amount, tokenData.decimals);
  
          if (allowance.lt(amountIn)) {
            console.log('Approving token spend...');
            setTransactionMessage('Approving...');
            await handleApproval();
          }
  
          console.log('Swapping tokens to ETH...');
          setTransactionMessage('Fetching Trade...');
          transactionResponse = await uniswap.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            path.reverse(),
            userAddress,
            deadline
          );
        }
  
        setTransactionMessage('Transaction Pending...');
        const receipt = await transactionResponse.wait();
        setTransactionMessage('Transaction Confirmed.');
  
        console.log('Transaction Hash:', receipt.transactionHash);
        
      }
    } catch (error) {
      console.error('Transaction Error:', error);
      setTransactionMessage('Transaction Cancelled.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCopyTokenAddress = () => {
    navigator.clipboard.writeText(EverETHTokenAddress);
    setAlertMessage('Token address copied to clipboard');
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };

  const handlePercentageClick = async (percentage: number) => {
    if (!isConnected || !tokenData) return;
  
    if (action === 'buy') {
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const bnbBalance = await signer.getBalance();
      const bnbBalanceFormatted = parseFloat(ethers.formatEther(bnbBalance.toString()));
  
      let amountToBuy;
      if (percentage === 100) {
        // Keep enough BNB for gas fees (adjust the value as needed)
        const gasReserve = 0.01;
        amountToBuy = bnbBalanceFormatted - gasReserve;
      } else {
        amountToBuy = (bnbBalanceFormatted * percentage) / 100;
      }
  
      setAmount(amountToBuy.toString());
    } else if (action === 'sell') {
      const tokenBalanceFormatted = tokenData.userBalance;
      const amountToSell = (tokenBalanceFormatted * percentage) / 100;
      setAmount(amountToSell.toString());
    }
  };

  const checkClaimEligibility = async () => {
    if (isClient && userAddress) {
      try {
        const provider = new Web3Provider(window.ethereum);
        const dividendTrackerContract = new Contract(EverETHDividendTrackerAddress, EverETHDividendTrackerABI, provider);
        
        const eligible = await dividendTrackerContract.isAccountEligibleForClaim(userAddress);
        setIsEligibleForClaim(eligible);
        
        if (!eligible) {
          const timeUntil = await dividendTrackerContract.timeUntilEligibleForClaim(userAddress);
          setTimeUntilEligible(timeUntil.toNumber());
        }
      } catch (error) {
        console.error('Error checking claim eligibility:', error);
      }
    }
  };

  useEffect(() => {
    checkClaimEligibility();
  }, [userAddress]);

  async function fetchAccumulativeDividends(contractAddress: string, userAddress: string) {
    if (isClient && userAddress) {
      try {
        const provider = new Web3Provider(window.ethereum);
        const tokenContract = new Contract(contractAddress, EverETHDividendTrackerABI, provider);
        const totalDividends = await tokenContract.accumulativeDividendOf(userAddress);
        return parseFloat(formatUnits(totalDividends.toString(), 18));
      } catch (error) {
        console.error('Error fetching accumulative dividends:', error);
        return 0;
      }
    }
    return 0;
  }
  

  return (
    <RainbowKitProvider theme={darkTheme()}>
      <div className={`min-h-screen flex flex-col justify-between ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <AlertNotification message={alertMessage} onClose={handleCloseAlert} />
        <header className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src="/icon.png" alt="EverETH Icon" className="w-6 h-6" />
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              EETH Dividends
            </span>
          </div>
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          

            
{/* User Holdings */}
<div className="bg-neutral-950 border border-neutral-800 shadow-lg shadow-netural-200 rounded-lg p-4 hover:bg-neutral-900 transition-colors duration-700">
  <h3 className="text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">
    Your Holdings
  </h3>
  <div>
    <p className="mt-4 text-shadow-md text-2xl font-bold">

    <img src="/icon.png" alt="ETH" className="w-7 h-7 inline-block ml-1 mr-2" />
      {isConnected ? (
        <>
          {formatNumber(tokenData?.userBalance)} {tokenData?.symbol} ≈{' '}
          <span
            className={
              tokenData?.userBalance * tokenData?.tokenPrice > 0 ? 'text-emerald-300' : ''
            }
          >
            {tokenData?.tokenPrice !== null
              ? `$${(tokenData?.userBalance * tokenData?.tokenPrice).toLocaleString()}`
              : 'N/A'}
          </span>
        </>
      ) : (
        '(Connect Your Wallet)'
      )}

    {isConnected && (
      <p className="mt-4 text-shadow-md font-bold">
        <span className="text-zinc-400">🏆 Holder Position:</span>{' '}
        {holderPosition ? (
          <span className="text-indigo-300">#{holderPosition}</span>
        ) : (
          'N/A'
        )}
      </p>
    )}
     
    </p>
    <p className="mt-4 ml-10 text-shadow-md font-bold">
      <span className="text-zinc-400">You own:</span>{' '}
      {isConnected ? (
        <>
          {formatNumber(tokenData?.userBalance)} of{' '}
          <span className="text-zinc-400">
            1 Billion (Circulating Supply)
          </span>{' '}
          ≈{' '}
          <span
            className={
              (tokenData?.userBalance / 1000000000) * 100 > 0
                ? 'text-emerald-300'
                : ''
            }
          >
            {((tokenData?.userBalance / 1000000000) * 100).toFixed(3)}%
          </span>
        </>
      ) : (
        '(Connect Your Wallet)'
      )}
    </p>

    <p className="mt-4 text-shadow-md text-xl font-bold">
  <img src="/everbuddy-badge.png" alt="EverBuddy" className="w-8 h-8 inline-block ml-1 mr-2" />
  <span className="text-zinc-400">EverBuddy:</span>{' '}
  {isConnected ? (
    <>
      <span className={isEverBuddy ? 'text-emerald-300' : 'text-red-500'}>
        {isEverBuddy ? 'Yes' : 'No'}
      </span>
      {!isEverBuddy && (
        <InfoIcon tooltip="Learn more about the EverBuddies program and how you can become an EverBuddy on the main website." />
  
)}
    </>
  ) : (
    '(Connect Your Wallet)'
  )}
</p>


<p className="mt-4 text-shadow-md text-xl font-bold flex items-center">
  <span className="text-zinc-400">🎁 Claimable EETH:</span>{' '}
  {isConnected ? (
    <div className="flex items-center ml-2">
      <span className={`mr-4 ${pendingRewards > 0 ? 'text-emerald-300' : 'text-gray-500'}`}>
        {pendingRewards !== null && pendingRewards !== undefined
          ? pendingRewards.toFixed(2)
          : '0.00'} EETH
      </span>
      <button
        onClick={handleClaim}
        className={`
          font-bold py-1 px-6 rounded 
          transition-all duration-300 ease-in-out
          transform hover:scale-105 active:scale-95
          ${
            isEligibleForClaim && pendingRewards > 0.00001
              ? 'bg-white hover:bg-green-500 text-black'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }
        `}
        disabled={!isEligibleForClaim || !pendingRewards || pendingRewards <= 0.00001}
      >
        CLAIM
      </button>
      {!isEligibleForClaim && (
        <InfoIcon 
          tooltip={`You will be eligible to claim in ${timeUntilEligible ? Math.ceil(timeUntilEligible / 86400) : '...'} days`} 
        />
      )}
    </div>
  ) : (
    <span className="ml-2">(Connect Your Wallet)</span>
  )}
</p>


    <div className="mt-8 flex justify-center">
      <div className="w-80">
        <Pie
          data={{
            labels: ['Your Holdings', 'Top 100 Holders', 'Uniswap', 'Rest of the Holders + Locked'],
            datasets: [
              {
                data: [
                  parseFloat(((tokenData?.userBalance / 1000000000) * 100).toFixed(3)),
                  parseFloat(((139402030 / 1000000000) * 100).toFixed(3)),
                  parseFloat(((54401433 / 1000000000) * 100).toFixed(3)),
                  parseFloat((100 - ((tokenData?.userBalance / 1000000000) * 100) - ((139402030 / 1000000000) * 100) - ((54401433 / 1000000000) * 100)).toFixed(3)),
                ],
                backgroundColor: ['rgba(0,250,154, 1)', 'rgba(165, 55, 253, 1)', 'rgba(227, 61, 148, 1)', 'rgba(46, 46, 46, 1)'],
                borderColor: ['rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 0.8)'],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                labels: {
                  color: 'white',
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.parsed;
                    return `${value.toFixed(3)}%`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  </div>
</div>


          {/* Rewards */}


          <div className="bg-neutral-950 border border-neutral-800 shadow-lg shadow-netural-200 rounded-lg p-4 hover:bg-neutral-900 transition-colors duration-700">
  <h3 className="text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">
    Your Dividends Data
  </h3>

  <div className="mt-6 space-y-3">
    <div className="flex items-center">
      <span className="text-zinc-400 w-64 flex items-center">
        💸 Total Dividends Earned <InfoIcon tooltip="Total EETH you have earned since holding the token." />
      </span>
      <span className="text-emerald-300">{isConnected ? `${accumulativeDividends.toFixed(2)} EETH` : '(Connect Your Wallet)'}</span>
    </div>

    <div className="flex items-center">
      <span className="text-zinc-400 w-64 flex items-center">
        🏦 Withdrawable Dividends <InfoIcon tooltip="EETH dividends you can currently claim." />
      </span>
      <span className="text-emerald-300">{isConnected ? `${withdrawableDividends.toFixed(2)} EETH` : '(Connect Your Wallet)'}</span>
    </div>

    <div className="flex items-center">
  <span className="text-zinc-400 w-64 flex items-center">
    📅 Last Claim Time <InfoIcon tooltip="The last time you claimed your dividends." />
  </span>
  <span className="text-zinc-300">
    {isConnected 
      ? (lastClaimTime 
          ? lastClaimTime.toLocaleString() 
          : 'No claims yet')
      : '(Connect Your Wallet)'}
  </span>
</div>

    <div className="flex items-center">
      <span className="text-zinc-400 w-64 flex items-center">
        🕒 Next Claim Time Eligibility <InfoIcon tooltip="Time until you are eligible for the next claim." />
      </span>
      <span className="text-zinc-300">
        {isConnected ? (
          timeUntilEligibleForClaim === 0 ? 
          'Eligible now' : 
          `${Math.ceil(timeUntilEligibleForClaim / 86400)} days`
        ) : '(Connect Your Wallet)'}
      </span>
    </div>

    <div className="flex items-center">
      <span className="text-zinc-400 w-64 flex items-center">
        💰 Withdrawn Dividends <InfoIcon tooltip="Total amount of dividends you have withdrawn so far." />
      </span>
      <span className="text-zinc-300">{isConnected ? `${withdrawnDividends.toFixed(2)} EETH` : '(Connect Your Wallet)'}</span>
    </div>

    <div className="flex items-center">
      <span className="text-zinc-400 w-64 flex items-center">
        📊 Current Dividend Yield <InfoIcon tooltip="Current dividend yield percentage." />
      </span>
      <span className="text-emerald-300">5%</span>
    </div>
  </div>

  <h3 className="mt-8 text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">
    Your EETH History
  </h3>
  <div className="mt-2 space-y-2 overflow-y-auto">
    {rewardsHistory.map((reward, index) => (
      <div key={index} className="text-sm flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
        You received <span className="text-emerald-300 font-semibold ml-1 mr-1">
          {parseFloat(formatUnits(reward.value, 18)).toFixed(2)}
        </span> 
        EETH <img src="/icon.png" alt="EETH" className="w-4 h-4 inline-block ml-1 mr-2" />
        on {new Date(reward.timeStamp * 1000).toLocaleString()}.{' '}
        <a 
          href={`https://etherscan.io/tx/${reward.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline ml-1"
        >
          View on explorer
        </a>
      </div>
    ))}
  </div>
</div>

{/* Total Ethereum Paid */}
<div className="bg-neutral-950 border border-neutral-800 shadow-lg shadow-netural-200 rounded-lg p-4 hover:bg-neutral-900 transition-colors duration-700">
  <h3 className="text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">
    Total EETH Paid
  </h3>
  <div className="mt-8 flex flex-col items-center justify-center space-y-4">
    <div className="flex items-center">
      <img src="/icon.png" alt="EETH" className="w-8 h-8 mr-2" />
      <span className="text-5xl font-bold mr-2">
      <CountUp
        start={0}
        end={(totalDividendsDistributed || 0) + 1039130}
        duration={5}
        decimals={2}
        decimal="."
        suffix=" EETH"
      />
    </span>
    </div>
    
  </div>
  <div className="mt-8">
    <Line
      data={{
        labels: ['2023', '2024'],
        datasets: [
          {
            label: 'Total EETH Paid',
            data: [0, (totalDividendsDistributed || 0) + 1039130],
            fill: false,
            borderColor: 'rgba(0,250,154, 1)',
            tension: 0.1,
            pointStyle: 'circle',
            pointRadius: 8,
            pointHoverRadius: 12
          },
        ],
      }}
      options={{
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value} EETH`,
            },
          },
        },
      }}
    />
  </div>
</div>


           {/* Dividend Payment History Section */}
<div className="bg-neutral-950 border border-neutral-800 shadow-lg shadow-netural-200 rounded-lg p-4 hover:bg-neutral-900 transition-colors duration-700">
  <h3 className="text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">Year 2024 Payouts</h3>
  <div className="mt-8 w-full aspect-ratio-box" style={{ paddingBottom: '75%', position: 'relative' }}>
    <div className="absolute inset-0">
      <Bar
        data={{
          labels: ['Jan','Feb','Mar', 'Apr', 'May', 'Jun'], // Replace with actual month labels
          datasets: [
            {
              label: 'Total EETH Dividends',
              data: [0, 0, 502445, 536685, 590959, 570517], // Replace with actual dividend payment data
              backgroundColor: 'rgba(0,250,154, 1)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white',
                font: {
                  size: 12,
                },
              },
            },
            x: {
              ticks: {
                color: 'white',
                font: {
                  size: 12,
                },
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'white',
                font: {
                  size: 14,
                },
              },
            },
            title: {
              display: false,
              text: 'Rewards Payments by Month',
              color: 'white',
              font: {
                size: 16,
              },
            },
          },
        }}
      />
    </div>
  </div>
</div>



 {/* Token Statistics */}
 <div className="bg-neutral-950 border border-neutral-800 shadow-lg shadow-netural-200 rounded-lg p-4 hover:bg-neutral-900 transition-colors duration-700">
              <h3 className="text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">Token Statistics</h3>
              <p>
      <span className="text-lg font-medium text-zinc-400">🧿 Name:</span> EverETH (EETH)
      <button
        className="ml-2 text-zinc-400 hover:text-white focus:outline-none"
        onClick={() => {
          navigator.clipboard.writeText(EverETHTokenAddress);
          setAlertMessage('Token address copied to clipboard');
          setShowAlert(true);
        }}
      >
        <FontAwesomeIcon icon={faClipboard} />
      </button>
    </p>
    <p>
                <span className="text-zinc-400">📈 Price:</span>{' '}
                {tokenData?.tokenPrice !== null ? (
                  <>
                    $
                    {tokenData?.tokenPrice < 1e-6 ? (
                      <>
                        {Number(tokenData?.tokenPrice).toFixed(18).replace(/0+$/, '')}
                        <span className="text-xs text-gray-500">
                          {tokenData?.tokenPrice.toExponential().split('-')[1].length - 1}
                        </span>
                      </>
                    ) : (
                      Number(tokenData?.tokenPrice).toPrecision(18)
                    )}
                  </>
                ) : (
                  'N/A'
                )}
                {tokenData?.priceChange24h !== null ? (
                  <span
                    className={`ml-2 ${
                      tokenData?.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    ({tokenData?.priceChange24h >= 0 ? '+' : ''}
                    {tokenData?.priceChange24h.toFixed(2)}%)
                    <FontAwesomeIcon icon={faClock} className="ml-1" />
                  </span>
                ) : null}
              </p>
    <p>
      <span className="text-zinc-400">📊 Market Cap:</span> {tokenData?.marketCap !== null ? `$${formatNumber(tokenData?.marketCap)}` : 'N/A'}
    </p>
    <p>
      <span className="text-zinc-400">⚖️ Liquidity:</span> {tokenData?.liquidity !== null ? `$${formatNumber(tokenData?.liquidity)}` : 'N/A'}
    </p>
    <p>
      <span className="text-zinc-400">🌊 24h Volume:</span> {tokenData?.volume24h !== null ? `$${formatNumber(tokenData?.volume24h)}` : 'N/A'}
    </p>
    <p>
      <span className="text-zinc-400">📄 Ownership:</span>{' '}
      {tokenData?.ownership === 'Renounced' ? (
        <span className="text-green-500">{tokenData?.ownership}</span>
      ) : tokenData?.ownership === 'Unknown' ? (
        <span className="text-zinc-500">{tokenData?.ownership}</span>
      ) : (
        <a
          href={`https://etherscan.io/address/${tokenData?.ownership}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          {`${tokenData?.ownership.slice(0, 6)}...${tokenData?.ownership.slice(-4)}`}
        </a>
      )}
    </p>

    <div className="relative w-full h:full rounded-lg">
      <div className="tradingview-chart">
        <iframe
          className="pt-4 rounded-[35px] saturate-120"
          src={`https://dexscreener.com/ethereum/0x78C2fe507Aab949Bdf1777D92b2b7A6057c261ef?embed=1&theme=dark&trades=1&info=0`}
          width="100%"
          height="1000"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
      <div className="absolute bottom-0 w-full h-10 bg-black "></div>
    </div>
</div>




      

                      {/* Buy/Sell Section */}
                      <div className="bg-neutral-950 border border-neutral-800 shadow-lg shadow-netural-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">Trade EverETH</h3>
              <div className="mt-8 flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 mb-4 w-full">
    <button
      onClick={() => setAction('buy')}
      className={`py-2 px-4 w-full ${action === 'buy' ? 'bg-green-500' : 'bg-zinc-900 text-white hover:bg-zinc-800 '} rounded-l-lg`}
    >
      BUY
    </button>
    <button
      onClick={() => setAction('sell')}
      className={`py-2 px-4 w-full ${action === 'sell' ? 'bg-red-500 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'} rounded-r-lg`}
    >
      SELL
    </button>
    <div className="relative ml-2">
      <button
        onClick={toggleSettings}
        className="text-gray-400 hover:text-gray-200 focus:outline-none"
      >
        <FontAwesomeIcon icon={faCog} />
      </button>
      {slippageTolerance !== 'Auto' && (
        <div className="absolute top-0 left-0 mt-1 ml-8 text-xs text-gray-400 whitespace-nowrap">
          {slippageTolerance}% slippage
        </div>
      )}
    </div>
  </div>

  {isSettingsOpen && (
    <div className="bg-zinc-950 text-white rounded shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Transaction Settings</h3>
        <button
          onClick={toggleSettings}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="slippage" className="block mb-2 text-sm font-medium text-gray-700">
          Max. slippage
        </label>
        <div className="flex items-center">
          <div
            className={`px-4 py-2 rounded-l ${
              slippageTolerance === 'Auto' ? 'bg-zinc-950' : 'bg-zinc-950 '
            }`}
          >
            <input
              type="radio"
              id="auto"
              name="slippage"
              value="Auto"
              checked={slippageTolerance === 'Auto'}
              onChange={(e) => setSlippageTolerance(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="auto" className="text-sm">
              Auto
            </label>
          </div>
          <div
            className={`px-4 py-2 rounded-r ${
              slippageTolerance !== 'Auto' ? 'bg-zinc-950' : 'bg-zinc-950 '
            }`}
          >
            <input
              type="radio"
              id="custom"
              name="slippage"
              value="Custom"
              checked={slippageTolerance !== 'Auto'}
              onChange={(e) => setSlippageTolerance('0.5')}
              className="mr-2"
            />
            <label htmlFor="custom" className="text-sm">
              Custom
            </label>
          </div>
          {slippageTolerance !== 'Auto' && (
            <div className="ml-2">
              <input
                type="number"
                step="0.1"
                value={slippageTolerance}
                onChange={(e) => setSlippageTolerance(e.target.value)}
                className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded"
              />
              <span className="ml-1">%</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="deadline" className="block mb-2 text-sm font-medium text-gray-700">
          Transaction deadline
        </label>
        <div className="flex items-center">
          <input
            id="deadline"
            type="number"
            step="1"
            min="1"
            value={transactionDeadline}
            onChange={(e) => setTransactionDeadline(parseInt(e.target.value))}
            className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded"
          />
          <span className="ml-1">minutes</span>
        </div>
      </div>
    </div>
  )}

<div className="flex items-center border rounded-lg p-2 w-full mb-4 border-zinc-800 focus-within:border-zinc-600 hover:border-zinc-600">
  <span className="flex items-center justify-center bg-transparent p-2 rounded-l">
    {action === 'buy' ? (
      <img src="/eth-logo.png" alt="ETH" className="w-6 h-6" />
    ) : (
      <img src="/icon.png" alt="ETH" className="w-6 h-6" />
    )}
  </span>
  <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    placeholder={`Type ${action === 'buy' ? 'ETH' : tokenData.symbol} amount`}
    className={`bg-transparent flex-1 mx-2 outline-none ${darkMode ? 'text-white' : 'text-black'}`}
  />
</div>
<div className="text-zinc-400 mb-4">{quote}</div>

<div className="flex justify-center space-x-4 mb-4">
  <button onClick={() => handlePercentageClick(25)} className="bg-zinc-900 text-zinc-400 py-2 px-12 rounded-lg hover:bg-zinc-800 w-full">25%</button>
  <button onClick={() => handlePercentageClick(50)} className="bg-zinc-900 text-zinc-400 py-2 px-12 rounded-lg hover:bg-zinc-800 w-full">50%</button>
  <button onClick={() => handlePercentageClick(100)} className="bg-zinc-900 text-zinc-400 py-2 px-12 rounded-lg hover:bg-zinc-800 w-full">MAX</button>
</div>

  {transactionMessage === 'You don\'t have enough BNB.' && (
    <p className="text-red-500 text-center mb-4">{transactionMessage}</p>
  )}

  {transactionMessage === 'Please Connect Your Wallet' && (
    <p className="text-red-500 text-center mb-4">{transactionMessage}</p>
  )}
   <button
    onClick={handleTransaction}
    disabled={isLoading || !isConnected || quote.includes('Insufficient')}
    className={`border border-zinc-800 py-2 px-4 rounded-full mt-4 w-full hover:bg-zinc-800 ${
      isLoading || !isConnected || quote.includes('Insufficient') ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {isLoading ? (
      'Loading...'
    ) : !isConnected ? (
      'Connect Your Wallet'
    ) : quote.includes('Insufficient') ? (
      quote
    ) : (
      'Confirm'
    )}
  </button>
  {transactionMessage && transactionMessage !== 'You don\'t have enough ETH.' && transactionMessage !== 'Please Connect Your Wallet' && (
    <div className="text-center">
      <p className={transactionMessage.includes('Failed') ? 'text-red-500' : ''}>{transactionMessage}</p>
      {transactionMessage === 'Transaction Confirmed.' && (
        <a href="#" className="text-blue-500">View on block explorer</a>
      )}
    </div>
)}

<h3 className="mt-8 text-lg font-medium mb-2 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">Your Latest Trades</h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-400">
      <thead className="text-xs uppercase bg-gray-700 text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">Type</th>
          <th scope="col" className="px-6 py-3">Amount (EverETH)</th>
          <th scope="col" className="px-6 py-3">Time</th>
        </tr>
      </thead>
      <tbody>
        {latestTrades.map((trade, index) => (
          <tr key={index} className="border-b bg-black border-zinc-800">
            <td className="px-6 py-4">
              {trade.from.toLowerCase() === pairAddress.toLowerCase() ? 'Buy' : 'Sell'}
            </td>
            <td className="px-6 py-4">
            <img src="/icon.png" alt="EverETH Icon" className="w-6 h-6" /> {parseFloat(formatUnits(trade.value, 9)).toFixed(2)}
            </td>
            <td className="px-6 py-4">
              {new Date(parseInt(trade.timeStamp) * 1000).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      </div>

{/* Latest Dividend Payments Section */}
<div className="bg-neutral-950 border border-neutral-800 shadow-lg shadow-netural-200 rounded-lg p-4 hover:bg-neutral-900 transition-colors duration-700">
  <h3 className="text-lg font-medium mb-4 inline-block bg-zinc-900 text-white px-2 rounded rounded-xl">
    Latest 25 Dividend Payments
  </h3>
  {latestDividendPayments.length === 0 ? (
    <p className="text-gray-400">Loading latest dividend payments...</p>
  ) : (
    <div className="mt-2 space-y-2 overflow-y-auto">
      {latestDividendPayments.map((payment, index) => {
        const paymentDate = new Date(parseInt(payment.timeStamp) * 1000);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateDisplay;
        if (paymentDate.toDateString() === today.toDateString()) {
          dateDisplay = "today";
        } else if (paymentDate.toDateString() === yesterday.toDateString()) {
          dateDisplay = "yesterday";
        } else {
          dateDisplay = paymentDate.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        }
        
        return (
          <div key={index} className="text-sm flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
            <div className="flex items-center">
              <span className="text-zinc-400 w-28">{payment.to.slice(0, 6)}...{payment.to.slice(-4)}</span>
              <span className="text-zinc-500 font-semibold ml-2">has been paid {dateDisplay}</span>
            </div>
            <div className="flex items-center">
              <img src="/icon.png" alt="EETH" className="w-4 h-4 inline-block mr-2" />
              <span className="text-emerald-300 font-semibold w-24 text-right">
                {parseFloat(formatUnits(payment.value, 18)).toFixed(2)}
              </span>
              <span className="text-zinc-400 ml-1 w-8">EETH</span>
              <a 
                href={`https://etherscan.io/tx/${payment.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline ml-4 w-32 text-right"
              >
                View on explorer
              </a>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

</div>

<DisclaimerNotification/>

  </main>

        <footer className="text-center py-4">
          <p className={`${darkMode ? 'text-white' : 'text-black'}`}>
            dApp by <a href="https://evereth.net" target="_blank" rel="noopener noreferrer">EverETH</a>.
          </p>
        </footer>
      </div>
    </RainbowKitProvider>
);
};

export default Page;

async function fetchTokenData(address: string, userAddress: string) {
  if (typeof window === 'undefined') {
    return {
      name: '',
      symbol: '',
      totalSupply: 0,
      userBalance: 0,
      decimals: 0,
      tokenPrice: null,
      marketCap: null,
      liquidity: null,
      ownership: 'Unknown',
      fdv: null,
      pairCreatedAt: null,
      volume24h: null,
      txns24h: { buys: null, sells: null },
      priceChange24h: null,
      socials: null,
    };
  }

  const provider = new Web3Provider(window.ethereum);
  const tokenContract = new Contract(
    address,
    [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function owner() view returns (address)"
    ],
    provider
  );

  try {
    const [name, symbol, totalSupplyBN, userBalanceBN, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.totalSupply(),
      tokenContract.balanceOf(userAddress),
      tokenContract.decimals(),
    ]);

    const totalSupplyFormatted = parseFloat(formatUnits(totalSupplyBN.toString(), decimals));
    const userBalanceFormatted = parseFloat(formatUnits(userBalanceBN.toString(), decimals));

    const dexScreenerData = await fetchDexScreenerData(address, symbol);
    const { liquidity, fdv, pairCreatedAt } = dexScreenerData;

    let ownerAddress;
    try {
      ownerAddress = await tokenContract.owner();
    } catch (error) {
      ownerAddress = null;
    }

    let ownershipInfo;
    if (ownerAddress === '0x0000000000000000000000000000000000000000') {
      ownershipInfo = 'Renounced';
    } else if (ownerAddress) {
      ownershipInfo = ownerAddress;
    } else {
      ownershipInfo = 'Unknown';
    }

    const dexScreenerPairData = await fetchDexScreenerPairData(address, symbol, totalSupplyFormatted);
    const { tokenPrice, marketCap } = dexScreenerPairData || {};

    return {
      name,
      symbol,
      totalSupply: totalSupplyFormatted,
      userBalance: userBalanceFormatted,
      decimals,
      tokenPrice,
      marketCap,
      liquidity,
      ownership: ownershipInfo,
      fdv,
      pairCreatedAt,
      volume24h: dexScreenerPairData?.volume24h || null,
      txns24h: dexScreenerPairData?.txns24h || { buys: null, sells: null },
      priceChange24h: dexScreenerPairData?.priceChange24h || null,
      socials: dexScreenerPairData?.socials || null,
    };
  } catch (error) {
    console.error('Error fetching token contract data:', error);
    // Return a default object with null or empty values
    return {
      name: '',
      symbol: '',
      totalSupply: 0,
      userBalance: 0,
      decimals: 0,
      tokenPrice: null,
      marketCap: null,
      liquidity: null,
      ownership: 'Unknown',
      fdv: null,
      pairCreatedAt: null,
      volume24h: null,
      txns24h: { buys: null, sells: null },
      priceChange24h: null,
      socials: null,
    };
  }
}

async function fetchUserHoldings(tokenAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    const provider = new Web3Provider(window.ethereum);
    const tokenContract = new Contract(
      tokenAddress,
      ['function balanceOf(address owner) view returns (uint256)'],
      provider
    );
    const balance = await tokenContract.balanceOf(userAddress);
    return {
      balance: parseFloat(formatUnits(balance.toString(), 18)),
    };
  }
  return {
    balance: 0,
  };
}


async function fetchPendingRewards(tokenAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(EverETHDividendTrackerAddress, EverETHDividendTrackerABI, provider);
      const pendingRewards = await tokenContract.withdrawableDividendOf(userAddress);
      return parseFloat(formatUnits(pendingRewards.toString(), 18));
    } catch (error) {
      console.error('Error fetching pending rewards:', error);
      return 0;
    }
  }
  return 0;
}

async function fetchTotalDividendsDistributed(contractAddress: string): Promise<number> {
  if (isClient) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(contractAddress, EverETHDividendTrackerABI, provider);
      const totalDividendsDistributed = await tokenContract.totalDividendsDistributed();
      const formattedTotal = parseFloat(formatUnits(totalDividendsDistributed.toString(), 18));
      return formattedTotal + 1039130; // Add 1,039,130 to the result
    } catch (error) {
      console.error('Error fetching total dividends distributed:', error);
      return 0; // Return 0 if there's an error, we'll add 1,039,130 later
    }
  }
  return 0; // Return 0 if not client-side, we'll add 1,039,130 later
}

async function fetchRewardsHistory(userAddress: string) {
  if (isClient && userAddress) {
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0xe46a1D19962Ea120765D3139c588fFd617bE04A8&address=${userAddress}&page=1&offset=5&startblock=0&endblock=999999999&sort=desc&apikey=PRJ8U88HNYNW3XKQ8Y6N25X74WGKXXAHST`);
      const data = await response.json();
      if (data.status === '1' && data.result) {
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching rewards history:', error);
    }
  }
  return [];
}

async function fetchLatestTrades(userAddress: string) {
  const apiKey = 'PRJ8U88HNYNW3XKQ8Y6N25X74WGKXXAHST';
  const everEthAddress = '0xe46a1D19962Ea120765D3139c588fFd617bE04A8';
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${everEthAddress}&address=${userAddress}&page=1&offset=100&sort=desc&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === '1' && data.result) {
      return data.result;
    } else {
      console.error('Error fetching latest trades:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching latest trades:', error);
    return [];
  }
}

async function fetchLatestDividendPayments() {
  const apiKey = 'PRJ8U88HNYNW3XKQ8Y6N25X74WGKXXAHST';
  const dividendTrackerAddress = '0x5D87Df89c3bBeB2EBb399DB86aDb288542e9f0bd';
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${dividendTrackerAddress}&startblock=0&endblock=999999999&sort=desc&offset=100&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === '1' && data.result) {
      return data.result.slice(0, 25); // Ensure we only return 100 results
    } else {
      console.error('Error fetching latest dividend payments:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching latest dividend payments:', error);
    return [];
  }
}


async function fetchWithdrawableDividends(contractAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(contractAddress, EverETHDividendTrackerABI, provider);
      const withdrawableDividends = await tokenContract.withdrawableDividendOf(userAddress);
      return parseFloat(formatUnits(withdrawableDividends.toString(), 18));
    } catch (error) {
      console.error('Error fetching withdrawable dividends:', error);
      return 0;
    }
  }
  return 0;
}

async function fetchTimeUntilEligibleForClaim(contractAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(contractAddress, EverETHDividendTrackerABI, provider);
      const timeUntilEligible = await tokenContract.timeUntilEligibleForClaim(userAddress);
      return timeUntilEligible.toNumber();
    } catch (error) {
      console.error('Error fetching time until eligible for claim:', error);
      return 0;
    }
  }
  return 0;
}

async function fetchNextDividendPaymentEstimate(contractAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(contractAddress, EverETHDividendTrackerABI, provider);
      const nextPaymentEstimate = await tokenContract.getNextDividendPaymentEstimate(userAddress);
      return parseFloat(formatUnits(nextPaymentEstimate.toString(), 18));
    } catch (error) {
      console.error('Error fetching next dividend payment estimate:', error);
      return 0;
    }
  }
  return 0;
}

async function fetchTotalDividends(tokenAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(EverETHDividendTrackerAddress, EverETHDividendTrackerABI, provider);
      const totalDividends = await tokenContract.dividendOf(userAddress);
      return parseFloat(formatUnits(totalDividends.toString(), 18));
    } catch (error) {
      console.error('Error fetching total dividends:', error);
      return 0;
    }
  }
  return 0;
}

async function fetchLastClaimTime(contractAddress: string, userAddress: string): Promise<Date | null> {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(contractAddress, EverETHDividendTrackerABI, provider);
      const lastClaimTime = await tokenContract.lastClaimTimes(userAddress);
      const timestamp = lastClaimTime.toNumber();
      return timestamp === 0 ? null : new Date(timestamp * 1000);
    } catch (error) {
      console.error('Error fetching last claim time:', error);
      return null;
    }
  }
  return null;
}

async function fetchNextClaimTime(tokenAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(EverETHDividendTrackerAddress, EverETHDividendTrackerABI, provider);
      const accountData = await tokenContract.getAccount(userAddress);
      return new Date(accountData[5].toNumber() * 1000);
    } catch (error) {
      console.error('Error fetching next claim time:', error);
      return null;
    }
  }
  return null;
}

async function fetchWithdrawnDividends(contractAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(contractAddress, EverETHDividendTrackerABI, provider);
      const withdrawnDividends = await tokenContract.withdrawnDividendOf(userAddress);
      return parseFloat(formatUnits(withdrawnDividends.toString(), 18));
    } catch (error) {
      console.error('Error fetching withdrawn dividends:', error);
      return 0;
    }
  }
  return 0;
}

async function fetchSecondsUntilAutoClaim(tokenAddress: string, userAddress: string) {
  if (isClient && userAddress) {
    try {
      const provider = new Web3Provider(window.ethereum);
      const tokenContract = new Contract(EverETHDividendTrackerAddress, EverETHDividendTrackerABI, provider);
      const accountData = await tokenContract.getAccount(userAddress);
      return accountData[7].toString(); // Access the secondsUntilAutoClaimAvailable value from the array
    } catch (error) {
      console.error('Error fetching seconds until auto claim:', error);
      return null;
    }
  }
  return null;
}

async function fetchDexScreenerData(tokenAddress: string, tokenSymbol: string) {
  if (typeof window === 'undefined') {
    return {
      liquidity: null,
      fdv: null,
      pairCreatedAt: null,
    };
  }

  try {
    const searchResponse = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${tokenAddress}`);
    const searchData = await searchResponse.json();

    let bestPair = null;
    let maxLiquidity = 0;

    if (searchData.pairs.length > 0) {
      for (const pair of searchData.pairs) {
        if (pair.baseToken.address.toLowerCase() === tokenAddress.toLowerCase()) {
          const liquidity = pair.liquidity?.usd || 0;
          if (liquidity > maxLiquidity) {
            maxLiquidity = liquidity;
            bestPair = pair;
          }
        }
      }
    }

    if (bestPair) {
      const { liquidity, fdv, pairCreatedAt } = bestPair;

      return {
        liquidity: liquidity?.usd || null,
        fdv: fdv || null,
        pairCreatedAt: pairCreatedAt || null,
      };
    }

    return {
      liquidity: null,
      fdv: null,
      pairCreatedAt: null,
    };
  } catch (error) {
    console.error('Error fetching DexScreener data:', error);
    return {
      liquidity: null,
      fdv: null,
      pairCreatedAt: null,
    };
  }
}

async function fetchDexScreenerPairData(tokenAddress: string, tokenSymbol: string, totalSupplyFormatted: number) {
  if (typeof window === 'undefined') {
    return {
      tokenPrice: null,
      marketCap: null,
      volume24h: null,
      txns24h: { buys: null, sells: null },
      priceChange24h: null,
      socials: null,
    };
  }

  try {
    const searchResponse = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${tokenAddress}`);
    const searchData = await searchResponse.json();

    let bestPair = null;
    let maxLiquidity = 0;

    if (searchData.pairs.length > 0) {
      for (const pair of searchData.pairs) {
        if (pair.baseToken.address.toLowerCase() === tokenAddress.toLowerCase()) {
          const liquidity = pair.liquidity?.usd || 0;
          if (liquidity > maxLiquidity) {
            maxLiquidity = liquidity;
            bestPair = pair;
          }
        }
      }
    }

    if (bestPair) {
      const { priceUsd, volume, txns, priceChange, info, fdv } = bestPair;

      return {
        tokenPrice: priceUsd ? parseFloat(priceUsd) : null,
        marketCap: fdv,
        volume24h: volume?.h24 || null,
        txns24h: {
          buys: txns?.h24?.buys || null,
          sells: txns?.h24?.sells || null,
        },
        priceChange24h: priceChange?.h24 || null,
        socials: info?.socials || null,
      };
    }

    return {
      tokenPrice: null,
      marketCap: null,
      volume24h: null,
      txns24h: {
        buys: null,
        sells: null,
      },
      priceChange24h: null,
      socials: null,
    };
  } catch (error) {
    console.error('Error fetching DexScreener pair data:', error);
    return {
      tokenPrice: null,
      marketCap: null,
      volume24h: null,
      txns24h: {
        buys: null,
        sells: null,
      },
      priceChange24h: null,
      socials: null,
    };
  }
}       