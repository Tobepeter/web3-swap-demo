import { TransactionHistory } from '@/types/HistoryType'
import { create } from 'zustand'

export const defaultHistoryState = {
  history: [] as TransactionHistory[],
}

export type HistoryState = typeof defaultHistoryState
export type PartialHistoryState = Partial<HistoryState>

export const historyStore = create<HistoryState>()((set, get) => ({
  ...defaultHistoryState,
}))
