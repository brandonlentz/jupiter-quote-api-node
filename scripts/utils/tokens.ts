export interface TokenAddresses {
  [chain: string]: string;
}

export const tokens: { [tokenName: string]: TokenAddresses } = {
  //   "Trump Meme Token": {
  //     Ethereum: "0x576e2BeD8F7b46D34016198911Cdf9886f78bea7",
  //     "Binance Smart Chain": "0x4eA98c1999575aaadfb38237Dd015c5E773F75a2",
  //     "Base Chain": "0x57f5fbd3de65dfc0bd3630f732969e5fb97e6d37",
  //     Solana: "HaP8r3ksG76PhQLTqR8FYBeNiQpejcFbQmiHbg787Ut1",
  //   },
  "Test Token": {
    Solana: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    "Base Chain": "0x57f5fbd3de65dfc0bd3630f732969e5fb97e6d37",
  },
  // Add more tokens here as needed
};
