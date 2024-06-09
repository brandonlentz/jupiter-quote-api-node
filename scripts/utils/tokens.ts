export interface TokenAddresses {
  [chain: string]: string;
}

export const tokens: { [tokenName: string]: TokenAddresses } = {
  "Trump Meme Token": {
    Ethereum: "0x576e2BeD8F7b46D34016198911Cdf9886f78bea7",
    "Binance Smart Chain": "0x4eA98c1999575aaadfb38237Dd015c5E773F75a2",
    "Base Chain": "0x57f5fbd3de65dfc0bd3630f732969e5fb97e6d37",
    Solana: "HaP8r3ksG76PhQLTqR8FYBeNiQpejcFbQmiHbg787Ut1",
  },
  "Cramer Token": {
    Solana: "E3tHHRa9Y1TWAA1nPZo8FAyVFgBDnXrS8u8nmMShL3M3",
    Ethereum: "0x64Df3aAB3b21cC275bB76c4A581Cf8B726478ee0",
  },
  NPC: {
    Ethereum: "0x8eD97a637A790Be1feff5e888d43629dc05408F6",
    "Base Chain": "0xB166E8B140D35D9D8226E40C09f757BAC5A4d87d",
  },
  Trunk: {
    "Binance Smart Chain": "0xdd325C38b12903B727D16961e61333f4871A70E0",
    Solana: "9mV4WUukVsva5wYcYW4veo34CNDiF44sh3Ji65JNdvh5",
  },
  // Add more tokens here as needed
  //   Test: {
  //     "Base Chain": "0xB166E8B140D35D9D8226E40C09f757BAC5A4d87d",
  //     Solana: "HaP8r3ksG76PhQLTqR8FYBeNiQpejcFbQmiHbg787Ut1",
  //   },
};
