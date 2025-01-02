import { create } from 'zustand'
import axios from 'axios'
import { useState } from 'react';


interface CreateState {
  pwd: string
  setPwd:(val: string) =>void
  status: 'pwd'|'create'
  setStatus:(val: 'pwd'|'create') =>void
  tabStatus: string
  setTabStatus:(val: string) =>void
}

export const useCreateStore = create<CreateState>((set, get) => ({
  pwd: '',
  setPwd:(val: string) =>set({pwd: val}),
  status: 'pwd',
  setStatus:(val: 'pwd'|'create') =>set({status: val}),
  tabStatus: 'import',
  setTabStatus:(val: string) =>set({tabStatus: val}),
}))
