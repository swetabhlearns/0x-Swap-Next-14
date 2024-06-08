"use client";
import { fetchPrice, getSwapQuote } from "@/lib/0x";
import {
  POLYGON_TOKENS,
  POLYGON_TOKENS_BY_ADDRESS,
  POLYGON_TOKENS_BY_SYMBOL,
} from "@/lib/constant";
import React, { ChangeEvent, use, useEffect, useState } from "react";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { useWallet } from "../hooks/useWallet";
import {
  useEstimateGas,
  useReadContract,
  useSendTransaction,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { getBalance } from "@wagmi/core";
import { config } from "@/lib/config";
import { ConnectBtn } from "../components/connectButton";
import { useDebounce } from "@uidotdev/usehooks";

const Swap = () => {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [sellToken, setSellToken] = useState("wmatic");
  const [buyToken, setBuyToken] = useState("dai");
  const [price, setPrice] = useState<any>(null);
  const [error, setError] = useState("");
  const { address, isConnected } = useWallet();
  const [quote, setQuote] = useState<any>(null);
  const [erc20bal, setERC20Bal] = useState<any>(null);
  const [isEnoughBal, setIsEnoughBal] = useState<boolean>(false);
  const AFFILIATE_FEE = 0.01;
  const FEE_RECIPIENT = "0x2C5416c7b9155cC6D740FAb019696300a0fC4A49";
  const sellTokens = POLYGON_TOKENS_BY_SYMBOL[sellToken];
  const buyTokens = POLYGON_TOKENS_BY_SYMBOL[buyToken];
  const exchangeProxy = `0xdef1c0ded9bec7f1a1670819833240f027b25eff`;
  const MAX_ALLOWANCE = BigInt(
    `115792089237316195423570985008687907853269984665640564039457584007913129639935`
  );
  const debouncedSellAmount = useDebounce(sellAmount, 300);

  const fetch_balance = async (token_address: any) => {
    if (isConnected) {
      const ERC20balance = getBalance(config, {
        address: address ? (address as `0x${string}`) : `0x0000`,
        chainId: 137,
        token: token_address,
      }).then((bal) => {
        setERC20Bal(bal?.formatted);
        const enoughBal = Number(sellAmount) < Number(bal?.formatted);

        setIsEnoughBal(enoughBal);
      });
      return ERC20balance;
    }
  };
  useEffect(() => {
    if (isConnected) {
      fetch_balance(sellTokens?.address);
    }
  }, [debouncedSellAmount, sellToken]);

  useEffect(() => {
    if (sellAmount) {
      calculatePrice();
    }
  }, [debouncedSellAmount, sellToken, buyToken]);
  useEffect(() => {
    const sellTokens = POLYGON_TOKENS_BY_SYMBOL[sellToken];
    if (price) {
      setBuyAmount(
        String(formatUnits(BigInt(price?.buyAmount), buyTokens.decimals))
      );
    }
  }, [price]);
  useEffect(() => {
    if (quote && Boolean(sendTransaction)) {
      sendTransaction({
        gas: data,
        to: quote?.to,

        data: quote?.data,
      });
    }
  }, [quote]);

  const { data: allowance, refetch } = useReadContract({
    address: sellTokens ? sellTokens?.address : undefined,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, exchangeProxy!],
  });

  const { data: approve_data } = useSimulateContract({
    address: sellTokens ? sellTokens?.address : undefined,
    abi: erc20Abi,
    functionName: "approve",
    args: [exchangeProxy, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeContract: approveAsync,
    error: approve_error,
  } = useWriteContract();

  const { isLoading: isApproving, isSuccess: wait_success } =
    useWaitForTransactionReceipt({
      hash: writeContractResult ? writeContractResult : undefined,
    });

  useEffect(() => {
    if (wait_success) {
      fetchQuote();
    }
  }, [wait_success]);

  const { data } = useEstimateGas({
    to: quote?.to,
    data: quote?.data,
  });

  const { sendTransaction, error: sendError } = useSendTransaction();

  function handleBuyTokenChange(e: ChangeEvent<HTMLSelectElement>) {
    setBuyToken(e.target.value);
  }
  const calculatePrice = async () => {
    const sellTokens = POLYGON_TOKENS_BY_SYMBOL[sellToken];
    const buyTokens = POLYGON_TOKENS_BY_SYMBOL[buyToken];
    const sellAmounts = parseUnits(`${sellAmount}`, sellTokens?.decimals!);
    const queryParams = {
      sellToken: sellToken ? sellTokens?.address : undefined,
      buyToken: buyToken ? buyTokens?.address : undefined,
      sellAmount: sellAmounts,
    };

    fetchPrice(queryParams)
      .then((data) => {
        setPrice(data);
        setBuyAmount(
          String(
            Number(parseUnits(`${data?.buyAmount}`, sellTokens?.decimals!))
          )
        );
      })
      .catch((error) => console.error(error));
  };

  const fetchQuote = async () => {
    try {
      const sellTokens = POLYGON_TOKENS_BY_SYMBOL[sellToken];
      const buyTokens = POLYGON_TOKENS_BY_SYMBOL[buyToken];
      const sellAmounts = parseUnits(`${sellAmount}`, sellTokens?.decimals!);
      const response = await getSwapQuote({
        sellToken: sellToken ? sellTokens?.address : undefined,
        buyToken: buyToken ? buyTokens?.address : undefined,
        sellAmount: sellAmounts,

        // Add other parameters as needed
      });
      setQuote(response);
    } catch (error) {
      console.error("Failed to fetch swap quote:", error);
    }
  };

  const handleSellTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSellToken(e.target.value);
  };

  const handleSwap = async () => {
    const amount = parseUnits(buyAmount, sellTokens?.decimals);
    const tokensAmount1BigInt = amount;

    if ((!allowance || allowance < tokensAmount1BigInt) && approveAsync) {
      await approveAsync(approve_data!?.request);
    } else {
      fetchQuote();
    }
  };

  return (
    <div className="p-3 mx-auto max-w-screen-sm ">
      <form>
        <h1 className="text-center text-3xl font-bold mb-4">
          Swap using 0x Api
        </h1>

        <p className="text-md text-center font-bold mb-2">Polygon Network</p>

        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-md mb-3">
          <section className="mt-4 flex items-start justify-center">
            <label htmlFor="sell-select" className="sr-only"></label>
            <img
              alt={sellToken}
              className="h-9 w-9 mr-2 rounded-md"
              src={POLYGON_TOKENS_BY_SYMBOL[sellToken].logoURI}
            />
            <div className="h-14 sm:w-full sm:mr-2">
              <select
                value={sellToken}
                name="sell-token-select"
                id="sell-token-select"
                className="mr-2 w-50 sm:w-full h-9 rounded-md text-black"
                onChange={handleSellTokenChange}
              >
                {POLYGON_TOKENS.map((token) => {
                  return (
                    <option
                      key={token.address}
                      value={token.symbol.toLowerCase()}
                      className="text-black"
                    >
                      {token.symbol}
                    </option>
                  );
                })}
              </select>
            </div>
            <label htmlFor="sell-amount" className="sr-only"></label>
            <input
              id="sell-amount"
              value={sellAmount}
              className="h-9 rounded-md text-black"
              style={{ border: "1px solid black" }}
              onChange={(e) => {
                setTradeDirection("sell");
                setSellAmount(e.target.value);
              }}
            />
          </section>
          <section className="flex mb-6 mt-4 items-start justify-center">
            <label htmlFor="buy-token" className="sr-only"></label>
            <img
              alt={buyToken}
              className="h-9 w-9 mr-2 rounded-md"
              src={POLYGON_TOKENS_BY_SYMBOL[buyToken].logoURI}
            />
            <select
              name="buy-token-select"
              id="buy-token-select"
              value={buyToken}
              className="mr-2 w-50 sm:w-full h-9 rounded-md text-black"
              onChange={(e) => handleBuyTokenChange(e)}
            >
              {POLYGON_TOKENS.map((token) => {
                return (
                  <option
                    key={token.address}
                    value={token.symbol.toLowerCase()}
                    className="text-black"
                  >
                    {token.symbol}
                  </option>
                );
              })}
            </select>
            <label htmlFor="buy-amount" className="sr-only"></label>
            <input
              id="buy-amount"
              value={buyAmount}
              className="h-9 rounded-md bg-white cursor-not-allowed text-black"
              style={{ border: "1px solid black" }}
              disabled
              onChange={(e) => {
                // setTradeDirection("buy");
                setBuyAmount(e.target.value);
              }}
            />
          </section>
          <div className="text-slate-400">
            {price && price?.grossBuyAmount
              ? "Affiliate Fee: " +
                Number(
                  formatUnits(
                    BigInt(price.grossBuyAmount),
                    POLYGON_TOKENS_BY_SYMBOL[buyToken].decimals
                  )
                ) *
                  AFFILIATE_FEE +
                " " +
                POLYGON_TOKENS_BY_SYMBOL[buyToken].symbol
              : null}
          </div>
        </div>

        {/* {isLoadingPrice && (
          <div className="text-center mt-2">Fetching the best price...</div>
        )} */}
      </form>

      {isConnected ? (
        <button
          className={`${
            isEnoughBal && Number(sellAmount) > 0
              ? "bg-blue-500 hover:bg-blue-700"
              : "bg-gray-200"
          } text-black font-bold py-2 px-4 rounded w-full`}
          onClick={() => {
            handleSwap();
          }}
          disabled={
            isEnoughBal === false ||
            Number(sellAmount) === 0 ||
            sellAmount === ""
          }
        >
          {Number(sellAmount) === 0 || isEnoughBal
            ? `Place Order`
            : `Insufficient Balance`}
        </button>
      ) : (
        <div
          className={`${"bg-gray-200"} text-black font-bold py-2 px-4 rounded w-full flex justify-center`}
          onClick={() => {
            handleSwap();
          }}
        >
          <ConnectBtn />
        </div>
      )}
    </div>
  );
};

export default Swap;
