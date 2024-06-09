import axios from "axios";
import Web3 from "web3";
import { chains } from "./utils/chains";
import { tokens } from "./utils/tokens";
import {
  performArbitrage,
  getCurrentGasPrice,
  isProfitableArbitrage,
} from "./performarbitrage";
import readline from "readline";

const tokenPriceBaseUrl = "https://api.odos.xyz/pricing/token";

const web3Instances: { [chain: string]: Web3 } = {};
for (const [chain, data] of Object.entries(chains)) {
  if (data.chain_id !== null) {
    web3Instances[chain] = new Web3(
      new Web3.providers.HttpProvider(data.http_endpoint),
    );
  }
}

async function fetchTokenPrice(
  chainId: number,
  tokenAddress: string,
): Promise<number | null> {
  try {
    const response = await axios.get(
      `${tokenPriceBaseUrl}/${chainId}/${tokenAddress}`,
    );
    return response.data.price || null;
  } catch (error) {
    console.error(
      `Error getting token price for ${tokenAddress} on chain ${chainId}: ${error}`,
    );
    return null;
  }
}

async function fetchTokenPriceOnSolana(
  tokenMintAddress: string,
): Promise<number | null> {
  try {
    const response = await axios.get(
      `https://price.jup.ag/v6/price?ids=${tokenMintAddress}`,
    );
    const data = response.data;
    if (data.data && data.data[tokenMintAddress]) {
      return data.data[tokenMintAddress].price;
    } else {
      console.error(
        `Price data not found in response for Solana. Response: ${JSON.stringify(data)}`,
      );
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch token price on Solana. Response: ${error}`);
    return null;
  }
}

interface Prices {
  [key: string]: {
    price: number;
    chain: string;
    chain_id: number | null;
    token_address: string;
  };
}

async function promptUserForArbitrage(tokenName: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `Proceed with arbitrage for ${tokenName}? (yes/no): `,
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      },
    );
  });
}

async function comparePrices(
  prices: Prices,
  isFirstScan: boolean,
): Promise<boolean> {
  const minPrice = Object.values(prices).reduce((min, p) =>
    p.price < min.price ? p : min,
  );
  const maxPrice = Object.values(prices).reduce((max, p) =>
    p.price > max.price ? p : max,
  );

  const priceDiff =
    (Math.abs(maxPrice.price - minPrice.price) /
      ((maxPrice.price + minPrice.price) / 2)) *
    100;
  console.log(`Price difference: ${priceDiff.toFixed(2)}%`);

  if (priceDiff > 4) {
    const arbitrageInfo = {
      buy_on: minPrice.chain,
      buy_chain_id: minPrice.chain_id!,
      buy_contract_address: minPrice.token_address,
      sell_on: maxPrice.chain,
      sell_chain_id: maxPrice.chain_id!,
      sell_contract_address: maxPrice.token_address,
      arbitrage_percentage: priceDiff,
    };
    console.log(
      `Arbitrage opportunity: Buy on ${arbitrageInfo.buy_on} at $${minPrice.price.toFixed(6)} and sell on ${arbitrageInfo.sell_on} at $${maxPrice.price.toFixed(6)}`,
    );

    if (arbitrageInfo.buy_chain_id === 1 || arbitrageInfo.sell_chain_id === 1) {
      const gasPriceGwei = await getCurrentGasPrice();
      if (gasPriceGwei === null) {
        console.log("Failed to fetch gas price. Aborting arbitrage.");
        return false;
      }
      if (
        !isProfitableArbitrage(arbitrageInfo.arbitrage_percentage, gasPriceGwei)
      ) {
        console.log(
          `Arbitrage not profitable after factoring gas costs. Gas price: ${gasPriceGwei} Gwei, Arbitrage percentage: ${arbitrageInfo.arbitrage_percentage.toFixed(2)}%`,
        );
        return false;
      }
    }

    if (isFirstScan) {
      const userConfirmed = await promptUserForArbitrage(minPrice.chain);
      if (!userConfirmed) {
        console.log("User aborted arbitrage.");
        return false;
      }
    }

    await performArbitrage(
      arbitrageInfo.buy_on,
      arbitrageInfo.buy_chain_id,
      arbitrageInfo.buy_contract_address,
      arbitrageInfo.sell_on,
      arbitrageInfo.sell_chain_id,
      arbitrageInfo.sell_contract_address,
      arbitrageInfo.arbitrage_percentage,
      100000000000000,
    );

    // Wait for arbitrage to complete before restarting the scanner
    console.log("Arbitrage executed. Restarting scanner in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return true;
  } else {
    // console.log("No significant arbitrage opportunity detected.");
    return false;
  }
}

async function main() {
  let isFirstScan = true;

  try {
    while (true) {
      for (const [tokenName, tokenAddresses] of Object.entries(tokens)) {
        const prices: Prices = {};

        // Fetch prices for each token on each chain
        for (const [chain, tokenAddress] of Object.entries(tokenAddresses)) {
          let price: number | null = null;
          if (chains[chain].chain_id !== null) {
            price = await fetchTokenPrice(
              chains[chain].chain_id!,
              tokenAddress,
            );
          } else {
            price = await fetchTokenPriceOnSolana(tokenAddress);
          }

          if (price !== null) {
            prices[`${tokenName} on ${chain}`] = {
              price,
              chain,
              chain_id: chains[chain].chain_id,
              token_address: tokenAddress,
            };
            // console.log(`${tokenName} Price on ${chain}: $${price.toFixed(2)}`);
          }
        }

        // Compare prices to identify arbitrage opportunities
        if (Object.keys(prices).length > 1) {
          const arbitrageExecuted = await comparePrices(prices, isFirstScan);
          if (arbitrageExecuted) {
            // Restart the main function after a short delay
            console.log("Restarting scanner in 5 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return main(); // Restart the main function
          }
        } else {
          console.log(
            `Failed to fetch sufficient prices for ${tokenName} for comparison.`,
          );
        }
      }

      isFirstScan = false;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Pause for 5 seconds before fetching prices again
    }
  } catch (error) {
    console.error("Error in main loop:", error);
    console.log("Restarting in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    main(); // Restart the main function
  }
}

main().catch(console.error);
