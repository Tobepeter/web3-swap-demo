import { Address, Hash } from 'viem'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const defaultState = {
  address: '0x0' as Address, // 钱包地址
  isConnected: false, // 是否连接钱包
  chainId: 1, // 链ID
  mockERC20: 0n, // 代币余额
  mockERC20TK: '0', // 代币余额
  mockUSDC: 0n, // 代币余额
  mockUSDCTK: '0', // 代币余额

  userLiq: 0n, // 用户流动性
  totalLiq: 0n, // 总流动性
  reserve0: 0n, // 储备量
  reserve0TK: '0', // 储备量
  reserve1: 0n, // 储备量
  reserve1TK: '0', // 储备量
}

export type StoreState = typeof defaultState
export type PartialStoreState = Partial<StoreState>

// TODO: 使用devtools，setState的泛型会丢失
export const store = create<StoreState>()((set, get) => ({
  ...defaultState,
}))
