import axios from "axios";
import Web3 from "web3";
import { chains } from "./utils/chains";
import { executeSwap } from "./jupswap"; // Import the Solana swap function
import { sendTelegramNotification } from "./utils/telegram"; // Import the Telegram function

const userAddress = "0x7A33BBD860cFd3aE995C999E98268D400aABd675";

const inputTokenAddresses: { [chainId: number]: string } = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  56: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  8453: "0x4200000000000000000000000000000000000006",
};

const privateKey = process.env.privatekey as string;
const solprivatekey = process.env.solprivatekey as string;
const etherscanApiKey = process.env.etherscanapikey as string;

export async function getValidatedQuote(
  chainId: number,
  inputTokenAddress: string,
  outputTokenAddress: string,
  amount: number,
) {
  const quoteUrl = "https://api.odos.xyz/sor/quote/v2";
  const quoteRequestBody = {
    chainId,
    inputTokens: [
      {
        tokenAddress: inputTokenAddress,
        amount: amount.toString(),
      },
    ],
    outputTokens: [
      {
        tokenAddress: outputTokenAddress,
        proportion: 1,
      },
    ],
    slippageLimitPercent: 1,
    userAddr: userAddress,
    referralCode: 0,
    disableRFQs: true,
    compact: true,
  };

  try {
    const response = await axios.post(quoteUrl, quoteRequestBody, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error in Quote: ${error.response?.data}`);
    } else {
      console.error(`Unknown error in Quote: ${error}`);
    }
    return null;
  }
}

export async function assembleTransaction(quote: any) {
  const assembleUrl = "https://api.odos.xyz/sor/assemble";
  const assembleRequestBody = {
    userAddr: userAddress,
    pathId: quote.pathId,
    simulate: false,
  };

  try {
    const response = await axios.post(assembleUrl, assembleRequestBody, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(
      "Transaction Assembly response:",
      JSON.stringify(response.data, null, 4),
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error in Transaction Assembly: ${error.response?.data}`);
    } else {
      console.error(`Unknown error in Transaction Assembly: ${error}`);
    }
    return null;
  }
}

export async function getCurrentGasPrice(): Promise<number | null> {
  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${etherscanApiKey}`,
    );
    return parseFloat(response.data.result.ProposeGasPrice);
  } catch (error) {
    console.error(`Error fetching gas price: ${error}`);
    return null;
  }
}

export async function performTransaction(
  assembledTransaction: any,
  privateKey: string,
  web3ProviderUrl: string,
) {
  const w3 = new Web3(new Web3.providers.HttpProvider(web3ProviderUrl));
  const transaction = assembledTransaction.transaction;
  transaction.nonce = await w3.eth.getTransactionCount(
    w3.utils.toChecksumAddress(transaction.from),
  );
  transaction.value = parseInt(transaction.value);
  const signedTx = await w3.eth.accounts.signTransaction(
    transaction,
    privateKey,
  );
  const txHash = await w3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction sent with hash: ${txHash.transactionHash}`);
}

export function isProfitableArbitrage(
  arbitragePercentage: number,
  gasPriceGwei: number,
): boolean {
  if (gasPriceGwei > 50) {
    return false;
  } else if (40 <= gasPriceGwei && gasPriceGwei <= 49) {
    return arbitragePercentage > 8;
  } else if (30 <= gasPriceGwei && gasPriceGwei <= 39) {
    return arbitragePercentage > 7;
  } else if (20 <= gasPriceGwei && gasPriceGwei <= 29) {
    return arbitragePercentage > 6;
  } else if (15 <= gasPriceGwei && gasPriceGwei <= 19) {
    return arbitragePercentage > 5;
  } else {
    return true;
  }
}

export async function performArbitrage(
  buyOn: string,
  buyChainId: number,
  buyContractAddress: string,
  sellOn: string,
  sellChainId: number,
  sellContractAddress: string,
  arbitragePercentage: number,
  amount: number,
) {
  if (buyOn === "Solana") {
    const amountInLamports = 10000000; // 0.01 SOL = 10,000,000 lamports
    console.log(
      `Executing swap on Solana for ${amountInLamports} lamports of ${buyContractAddress}`,
    );
    await executeSwap(solprivatekey, buyContractAddress, amountInLamports); // Execute the Solana swap
    await sendTelegramNotification(
      `Arbitrage executed: Buy on ${buyOn} at ${amountInLamports} lamports of ${buyContractAddress}, Sell on ${sellOn}`,
    ); // Send Telegram alert
    return;
  }

  const inputTokenAddress = inputTokenAddresses[buyChainId];
  if (!inputTokenAddress) {
    console.error(`Unsupported chain ID: ${buyChainId}`);
    return;
  }

  const quote = await getValidatedQuote(
    buyChainId,
    inputTokenAddress,
    buyContractAddress,
    amount,
  );
  if (quote) {
    console.log(
      `Valid quote obtained for ${amount} of input token on chain ${buyChainId}`,
    );
    console.log(JSON.stringify(quote, null, 4));

    if (buyChainId === 1 || sellChainId === 1) {
      const gasPriceGwei = await getCurrentGasPrice();
      if (gasPriceGwei === null) {
        console.error("Failed to fetch gas price. Aborting arbitrage.");
        return;
      }
      if (!isProfitableArbitrage(arbitragePercentage, gasPriceGwei)) {
        console.error(
          `Arbitrage not profitable after factoring gas costs. Gas price: ${gasPriceGwei} Gwei, Arbitrage percentage: ${arbitragePercentage.toFixed(2)}%`,
        );
        return;
      }
    }

    const assembledTransaction = await assembleTransaction(quote);
    if (assembledTransaction) {
      const web3ProviderUrl = chains[buyOn].http_endpoint;
      console.log(
        `Performing arbitrage: Buy on ${buyOn} (Chain ID: ${buyChainId}, Contract: ${buyContractAddress}) and sell on ${sellOn} (Chain ID: ${sellChainId}, Contract: ${sellContractAddress}) with an arbitrage percentage of ${arbitragePercentage.toFixed(2)}%`,
      );
      await performTransaction(
        assembledTransaction,
        privateKey,
        web3ProviderUrl,
      );
      await sendTelegramNotification(
        `Arbitrage executed: Buy on ${buyOn} of ${buyContractAddress}, Sell on ${sellOn}.  Arbitrage percentage: ${arbitragePercentage}`,
      ); // Send Telegram alert
    } else {
      console.error("Failed to assemble transaction. Aborting arbitrage.");
    }
  } else {
    console.error("Failed to obtain a valid quote. Aborting arbitrage.");
  }
}
