import {
  QuoteGetRequest,
  QuoteResponse,
  SwapResponse,
  createJupiterApiClient,
} from "../src/index";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import bs58 from "bs58";
import { transactionSenderAndConfirmationWaiter } from "./utils/transactionSender";
import { getSignature } from "./utils/getSignature";

const solprivatekey = process.env.solprivatekey;

// Make sure that you are using your own RPC endpoint.
const connection = new Connection(
  "https://few-winter-owl.solana-mainnet.quiknode.pro/ecbd3e6824f50e2213eac1088801aafecd70c6c0/",
);
const jupiterQuoteApi = createJupiterApiClient();

async function getQuote(outputMint: string, amount: number) {
  const inputMint = "So11111111111111111111111111111111111111112"; // SOL mint address
  const params: QuoteGetRequest = {
    inputMint,
    outputMint,
    amount,
    autoSlippage: true,
    autoSlippageCollisionUsdValue: 1_000,
    maxAutoSlippageBps: 1000, // 10%
    minimizeSlippage: true,
    onlyDirectRoutes: false,
    asLegacyTransaction: false,
  };

  console.log("Quote request params:", params); // Log the params here

  try {
    const quote = await jupiterQuoteApi.quoteGet(params);
    if (!quote) {
      throw new Error("Unable to get quote");
    }
    return quote;
  } catch (error) {
    console.error("Error getting quote:", error);
    console.error("Quote request params:", params);
    throw error;
  }
}

async function getSwapObj(wallet: Wallet, quote: QuoteResponse) {
  try {
    const swapObj = await jupiterQuoteApi.swapPost({
      swapRequest: {
        quoteResponse: quote,
        userPublicKey: wallet.publicKey.toBase58(),
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      },
    });
    return swapObj;
  } catch (error) {
    console.error("Error getting swap object:", error);
    console.error("Swap request params:", {
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58(),
    });
    throw error;
  }
}

async function executeSwap(
  solprivatekey: string,
  outputMint: string,
  amount: number,
) {
  const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(solprivatekey)));
  console.log("Wallet:", wallet.publicKey.toBase58());

  const quote = await getQuote(outputMint, amount);
  console.dir(quote, { depth: null });
  const swapObj = await getSwapObj(wallet, quote);
  console.dir(swapObj, { depth: null });

  const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64");
  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  transaction.sign([wallet.payer]);
  const signature = getSignature(transaction);

  const { value: simulatedTransactionResponse } =
    await connection.simulateTransaction(transaction, {
      replaceRecentBlockhash: true,
      commitment: "processed",
    });
  const { err, logs } = simulatedTransactionResponse;

  if (err) {
    console.error("Simulation Error:", { err, logs });
    return;
  }

  const serializedTransaction = Buffer.from(transaction.serialize());
  const blockhash = transaction.message.recentBlockhash;

  const transactionResponse = await transactionSenderAndConfirmationWaiter({
    connection,
    serializedTransaction,
    blockhashWithExpiryBlockHeight: {
      blockhash,
      lastValidBlockHeight: swapObj.lastValidBlockHeight,
    },
  });

  if (!transactionResponse) {
    console.error("Transaction not confirmed");
    return;
  }

  if (transactionResponse.meta?.err) {
    console.error(transactionResponse.meta?.err);
  }

  console.log(`https://solscan.io/tx/${signature}`);
}

export { executeSwap };
