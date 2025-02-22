import { Address, Hash } from 'viem'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// TODO: 接口和声明两边写，貌似官方也没有比较好的解决方式
//  https://zustand.docs.pmnd.rs/guides/typescript
export interface StoreState {
  address: Address
  isConnected: boolean
  chainId: number
  mockERC20: bigint
  mockERC20TK: string
  mockUSDC: bigint
  mockUSDCTK: string

  userLiq: bigint
  totalLiq: bigint
  reserve0: bigint
  reserve0TK: string
  reserve1: bigint
  reserve1TK: string

  txHash?: Hash // TODO: 做什么的？
}

// TODO: 使用devtools，setState的泛型会丢失
export const store = create<StoreState>()((set, get) => ({
  address: '0x0' as Address,
  isConnected: false,
  chainId: 1,
  mockERC20: 0n,
  mockERC20TK: '0',
  mockUSDC: 0n,
  mockUSDCTK: '0',
  txHash: undefined as Hash,
  userLiq: 0n,
  totalLiq: 0n,
  reserve0: 0n,
  reserve0TK: '0',
  reserve1: 0n,
  reserve1TK: '0',
  maxAddLiq0: 0n,
  maxAddLiq1: 0n,
}))
