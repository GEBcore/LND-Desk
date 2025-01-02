import { create } from 'zustand'
import axios from 'axios'
import { useState } from 'react';
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
  initWallet:(walletPassword:string, existMnemonic:string, aezeedPass:string, existXprv: string) => any
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
  initWallet: async (walletPassword:string, existMnemonic:string, aezeedPass:string, existXprv: string) => {
    try {
      // const path = await InitWallet();
      return ''
    } catch (error) {
      console.error('Error getting LND path:', error);
    }
  }
}))
