import { Address, Hash } from 'viem'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// WIP: 状态管理
export interface StoreState {
  address: Address
  chainId: number
  MockERC20Balance: bigint
  MOCK_USDCBalance: bigint
  txHash?: Hash
  get isConnected(): boolean
  setState: (values: Partial<StoreState>) => void
}

export const store = create<StoreState>()(
  devtools(
    (set, get) => ({
      address: '0x0' as Address,
      chainId: 1,
      MockERC20Balance: 0n,
      MOCK_USDCBalance: 0n,
      txHash: undefined as Hash,

      get isConnected() {
        return !!get().address
      },
      setState: values => set(values),
    }),
    {
      name: 'store',
    }
  )
)
