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
  Arbitrum: {
    chain_id: 42161,
    wormhole_chain_id: 23,
    http_endpoint:
      "https://indulgent-flashy-forest.arbitrum-mainnet.quiknode.pro/ce333f6ddee32313b6e5133af972ef454f221513/",
    wss_endpoint:
      "wss://indulgent-flashy-forest.arbitrum-mainnet.quiknode.pro/ce333f6ddee32313b6e5133af972ef454f221513/",
  },
  Optimism: {
    chain_id: 10,
    wormhole_chain_id: 24,
    http_endpoint:
      "https://twilight-multi-paper.optimism.quiknode.pro/0801a63bc9ebd46d47ce4a091a93cddf4a5e9a8b/",
    wss_endpoint:
      "wss://twilight-multi-paper.optimism.quiknode.pro/0801a63bc9ebd46d47ce4a091a93cddf4a5e9a8b/",
  },
  Avalanche: {
    chain_id: 43114,
    wormhole_chain_id: 6,
    http_endpoint:
      "https://yolo-warmhearted-liquid.avalanche-mainnet.quiknode.pro/5a07c72d84559ebf81eaed80dbb6772e60012aac/ext/bc/C/rpc/",
    wss_endpoint:
      "wss://yolo-warmhearted-liquid.avalanche-mainnet.quiknode.pro/5a07c72d84559ebf81eaed80dbb6772e60012aac/ext/bc/C/ws/",
  },
  Polygon: {
    chain_id: 137,
    wormhole_chain_id: 5,
    http_endpoint:
      "https://proportionate-ultra-asphalt.matic.quiknode.pro/cd41619a28b4b86b00a060d3b5b20bb8777b148f/",
    wss_endpoint:
      "wss://proportionate-ultra-asphalt.matic.quiknode.pro/cd41619a28b4b86b00a060d3b5b20bb8777b148f/",
  },
  // Add more chains here as needed
};
