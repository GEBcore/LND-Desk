import { create } from 'zustand'
import { FetchVersionInfo, GenSeed, GetLndChainInfo, GetVersion, InitWallet } from '../../wailsjs/go/main/App';
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
restcors=https://gebhub.geb.network

[Bitcoin]
bitcoin.mainnet=true
bitcoin.signet=false
bitcoin.node=neutrino

[neutrino]
neutrino.addpeer=btcd-mainnet.lightning.computer
neutrino.addpeer=neutrino.noderunner.wtf
neutrino.addpeer=node.eldamar.icu
neutrino.addpeer=btcd.lnolymp.us
neutrino.addpeer=btcd0.lightning.engineering
neutrino.addpeer=bb1.breez.technology:8333
neutrino.addpeer=node.blixtwallet.com:8333
neutrino.addpeer=mainnet1-btcd.zaphq.io
neutrino.addpeer=mainnet2-btcd.zaphq.io
neutrino.addpeer=mainnet3-btcd.zaphq.io
neutrino.addpeer=mainnet4-btcd.zaphq.io


[protocol]
protocol.simple-taproot-chans=true

[fee]
fee.url=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json`;

// bitcoin.testnet=false
// bitcoin.simnet=false
// bitcoin.regtest=false
interface CreateState {
  config: string
  setConfig:(val: string) =>void
  lndDir: string
  setLndDir:(val: string) =>void
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
  showUpdateDialog: boolean
  setShowUpdateDialog: (val: boolean) => void
  updateVersion: string
  currentVersion: string
  getVersion:() => Promise<{ status: string; data?: any; error?: any }>
  fetchVersionInfo:() => Promise<{ status: string; data?: any; error?: any }>
  currentNetwork: string
  setCurrentNetwork: (val: string) => void
  lndChainScan: string
  setLndChainScan: (val: string) => void
  isServerActive: boolean
  setIsServerActive: (val: boolean) => void
}

export const useCreateStore = create<CreateState>((set, get) => ({
  config: defaultConfig,
  setConfig:(val: string) =>set({config: val}),
  lndDir: '',
  setLndDir:(val: string) =>set({lndDir: val}),
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
  setShowQADialog: (val: boolean) => set({showQADialog: val}),
  updateVersion: '',
  currentVersion:'',
  showUpdateDialog: false,
  setShowUpdateDialog: (val: boolean) => set({showUpdateDialog: val}),
  getVersion:async ():Promise<{ status: string; data?: any; error?: any }> => {
    try {
      const data = await GetVersion();
      // console.log(data)
      set({currentVersion: data})
      return { status: 'success', data };
    } catch (error) {
      console.error('Error:', error);
      return { status: 'fail', error };
    }
  },
  fetchVersionInfo:async ():Promise<{ status: string; data?: any; error?: any }> => {
    async function getVersionInfo() {
      try {
        const data = await FetchVersionInfo();
        const { CurrentVersion, LatestVersion, NeedUpdate } = data;
        set({ showUpdateDialog: NeedUpdate, updateVersion: LatestVersion, currentVersion: CurrentVersion });
        return { status: 'success', data };
      } catch (error) {
        console.error('Error:', error);
        return { status: 'fail', error };
      }
    }
    const reminderTime = localStorage.getItem('reminderTime');
    const timestamp = Date.now();
    if (reminderTime) {
      const reminderTimestamp = Number(reminderTime);
      const timeDifference = timestamp - reminderTimestamp;
      const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;

      if (timeDifference > twoHoursInMilliseconds) {
        return await getVersionInfo();
      } else {
        console.error('waiting time...')
        return { status: 'fail', error: 'waiting time...' }; // 未超过2小时
      }
    } else {
      return await getVersionInfo();
    }
  },
  currentNetwork: localStorage.getItem('btc_network') ?? 'mainnet',
  setCurrentNetwork: (val: string) => set({currentNetwork: val}),
  lndChainScan: localStorage.getItem('btc_network') == 'mainnet' ? 'https://mempool.space' : 'https://mempool.space/signet',
  setLndChainScan: (val: string) => set({lndChainScan: val}),
  isServerActive: false,
  setIsServerActive: (val: boolean) => set({isServerActive: val}),
}))
