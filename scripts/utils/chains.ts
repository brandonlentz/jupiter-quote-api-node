export interface Chain {
  chain_id: number | null;
  wormhole_chain_id: number;
  http_endpoint: string;
  wss_endpoint: string;
}

export const chains: { [key: string]: Chain } = {
  Ethereum: {
    chain_id: 1,
    wormhole_chain_id: 2,
    http_endpoint:
      "https://evocative-dimensional-feather.quiknode.pro/0ec72b8d55315dc480f51395596e48dd9a614ca4/",
    wss_endpoint:
      "wss://evocative-dimensional-feather.quiknode.pro/0ec72b8d55315dc480f51395596e48dd9a614ca4/",
  },
  "Binance Smart Chain": {
    chain_id: 56,
    wormhole_chain_id: 4,
    http_endpoint:
      "https://responsive-white-dew.bsc.quiknode.pro/eeb81b094133058d75b86926dcdef6c9ffa54482/",
    wss_endpoint:
      "wss://responsive-white-dew.bsc.quiknode.pro/eeb81b094133058d75b86926dcdef6c9ffa54482/",
  },
  "Base Chain": {
    chain_id: 8453,
    wormhole_chain_id: 30,
    http_endpoint:
      "https://evocative-falling-friday.base-mainnet.quiknode.pro/706b384a96717d2c91eeed1334dee0da1cfa173b/",
    wss_endpoint:
      "wss://evocative-falling-friday.base-mainnet.quiknode.pro/706b384a96717d2c91eeed1334dee0da1cfa173b/",
  },
  Solana: {
    chain_id: null, // Solana does not use EVM chain IDs
    wormhole_chain_id: 1,
    http_endpoint:
      "https://few-winter-owl.solana-mainnet.quiknode.pro/ecbd3e6824f50e2213eac1088801aafecd70c6c0/",
    wss_endpoint:
      "wss://few-winter-owl.solana-mainnet.quiknode.pro/ecbd3e6824f50e2213eac1088801aafecd70c6c0/",
  },
  // Add more chains here as needed
};
