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
  txHash?: Hash // TODO: 做什么的？
}

// TODO: 使用devtools，setState的泛型会丢失
export const store = create<StoreState>()((set, get) => ({
  address: '0x0' as Address,
  isConnected: false,
  chainId: 1,
  mockERC20: 0n,
  mockERC20TK: '',
  mockUSDC: 0n,
  mockUSDCTK: '',
  txHash: undefined as Hash,
}))
