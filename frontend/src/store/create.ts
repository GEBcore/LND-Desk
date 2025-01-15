import { create } from 'zustand'
import { GenSeed, InitWallet } from '../../wailsjs/go/main/App';
import { formatWords, formatWordsIndex } from '@/utils/formatWords';
import { useState } from 'react';
export const defaultConfig = `[Application Options]
debuglevel=trace
maxpendingchannels=10
alias=
no-macaroons=false
coin-selection-strategy=largest
rpclisten=10009
restlisten=8080
no-rest-tls=true
restcors=https://bevmhub.bevm.io

[Bitcoin]
bitcoin.mainnet=false
bitcoin.testnet=false
bitcoin.simnet=false
bitcoin.regtest=false
bitcoin.signet=true
bitcoin.node=neutrino

[neutrino]
neutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl
neutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333

[protocol]
protocol.simple-taproot-chans=true`;


interface CreateState {
  config: string
  setConfig:(val: string) =>void
  aliasName: string
  setAliasName:(val: string) =>void
  pwd: string
  setPwd:(val: string) =>void
  status: 'pwd'|'create'
  setStatus:(val: 'pwd'|'create') =>void
  tabStatus: string
  setTabStatus:(val: string) =>void
  createPassphrase: string
  setCreatePassphrase:(val: string) =>void
  initWallet:(walletPassword:string, existMnemonic:string, aezeedPass:string, existXprv: string) => Promise<{ status: string; data?: any; error?: any }>
  showCreateMnemonic: string[],
  createMnemonic: string,
  genSeed:(aezeedPass: string) => Promise<{ status: string; data?: any; error?: any }>
  isReady: boolean
  setIsReady: (val: boolean) => void
  isWalletUnlocked: boolean
  setIsWalletUnlocked: (val: boolean) => void
  isWalletRpcReady: boolean
  setIsWalletRpcReady: (val: boolean) => void
  showMnemonicDialog: boolean
  setShowMnemonicDialog: (val: boolean) => void
  confirmLoading: boolean
  setConfirmLoading: (val: boolean) => void
  showQADialog: boolean
  setShowQADialog: (val: boolean) => void
}

export const useCreateStore = create<CreateState>((set, get) => ({
  config: defaultConfig,
  setConfig:(val: string) =>set({config: val}),
  aliasName: '',
  setAliasName:(val: string) => set({aliasName: val}),
  pwd: '',
  setPwd:(val: string) =>set({pwd: val}),
  status: 'pwd',
  setStatus:(val: 'pwd'|'create') =>set({status: val}),
  tabStatus: 'import',
  setTabStatus:(val: string) =>set({tabStatus: val}),
  createPassphrase: '',
  setCreatePassphrase:(val: string) =>set({createPassphrase: val}),
  createMnemonic: '',
  showCreateMnemonic: [],
  initWallet: async (walletPassword:string, existMnemonic:string, aezeedPass:string, existXprv: string):Promise<{ status: string; data?: any; error?: any }> => {
    try {
      const data = await InitWallet(walletPassword, existMnemonic, aezeedPass, existXprv);
      return { status: 'success', data };
    } catch (error) {
      console.error('Error:', error);
      return { status: 'fail', error };
    }
  },
  genSeed:async (aezeedPass:string):Promise<{ status: string; data?: any; error?: any }> => {
    try {
      const data = await GenSeed(aezeedPass);
      set({createMnemonic: formatWords(data), showCreateMnemonic: data})
      return { status: 'success', data };
    } catch (error) {
      console.error('Error:', error);
      return { status: 'fail', error };
    }
  },
  isReady: true,
  setIsReady: (val: boolean) => set({isReady: val}),
  isWalletUnlocked: true,
  setIsWalletUnlocked: (val: boolean) => set({isWalletUnlocked: val}),
  isWalletRpcReady: false,
  setIsWalletRpcReady: (val: boolean) => set({isWalletRpcReady: val}),
  showMnemonicDialog: false,
  setShowMnemonicDialog:(val: boolean) => set({showMnemonicDialog: val}),
  confirmLoading: false,
  setConfirmLoading: (val: boolean) => set({confirmLoading: val}),
  showQADialog: false,
  setShowQADialog: (val: boolean) => set({showQADialog: val})
}))
