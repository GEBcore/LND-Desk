import { create } from 'zustand'
import axios from 'axios'
import { useState } from 'react';
import { GenSeed, InitWallet } from '../../wailsjs/go/main/App';
import { formatWords, formatWordsIndex } from '@/utils/formatWords';
// import { InitWallet } from '../../wailsjs/go/main/App';


interface CreateState {
  pwd: string
  setPwd:(val: string) =>void
  status: 'pwd'|'create'
  setStatus:(val: 'pwd'|'create') =>void
  tabStatus: string
  setTabStatus:(val: string) =>void
  createPassphrase: string
  setCreatePassphrase:(val: string) =>void
  initWallet:(walletPassword:string, existMnemonic:string, aezeedPass:string, existXprv: string) => void
  showCreateMnemonic: string,
  createMnemonic: string,
  genSeed:(aezeedPass: string) => void
}

export const useCreateStore = create<CreateState>((set, get) => ({
  pwd: '',
  setPwd:(val: string) =>set({pwd: val}),
  status: 'pwd',
  setStatus:(val: 'pwd'|'create') =>set({status: val}),
  tabStatus: 'import',
  setTabStatus:(val: string) =>set({tabStatus: val}),
  createPassphrase: '',
  setCreatePassphrase:(val: string) =>set({createPassphrase: val}),
  createMnemonic: '',
  showCreateMnemonic: '',
  initWallet: async (walletPassword:string, existMnemonic:string, aezeedPass:string, existXprv: string) => {
    try {
      console.log('walletPassword, existMnemonic, aezeedPass, existXprv', walletPassword, existMnemonic, aezeedPass, existXprv)
      const data = await InitWallet(walletPassword, existMnemonic, aezeedPass, existXprv);
      console.log(data)
    } catch (error) {
      console.error('Error:', error);
    }
  },
  genSeed:async (aezeedPass:string) => {
    try {
      console.log('aezeedPass', aezeedPass)
      const data = await GenSeed(aezeedPass);
      set({createMnemonic: formatWords(data), showCreateMnemonic: formatWordsIndex(data)})
      console.log(data)
    } catch (error) {
      console.error('Error:', error);
    }
  },

}))
