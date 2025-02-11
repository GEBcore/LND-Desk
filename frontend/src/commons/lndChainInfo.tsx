import { createListCollection } from '@chakra-ui/react';

export const frameworks = createListCollection({
  items: [
    { label: "mainnet", value: "mainnet" },
    { label: "testnet", value: "testnet" },
    { label: "simnet", value: "simnet" },
    { label: "regtest", value: "regtest" },
    { label: "signet", value: "signet" },
  ],
})

export const lndChainScanMap: { [key: string]: string } = {
  'mainnet':'https://mempool.space',
  'signet':'https://mempool.space/signet'
}