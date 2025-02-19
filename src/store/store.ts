import { format_Mock_ERC20_Balance, format_MOCK_USDC_Balance, isEmptyAddress } from '@/utils/common'
import { Address, Hash } from 'viem'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// TODO: 能否不用写接口？
export interface StoreState {
  address: Address
  chainId: number
  // TODO: 大小写重新确认下
  MockERC20_Balance: bigint
  MockUSDC_Balance: bigint
  txHash?: Hash
  get isConnected(): boolean
  get isEmptyAddress(): boolean
  get MockERC20_BalanceFormat(): string
  get MockUSDC_BalanceFormat(): string
  setState: (values: Partial<StoreState>) => void
}

export const store = create<StoreState>()(
  devtools(
    (set, get) => ({
      address: '0x0' as Address,
      chainId: 1,
      MockERC20_Balance: 0n,
      MockUSDC_Balance: 0n,
      // TODO: 做什么的？
      txHash: undefined as Hash,

      // TODO: 这个貌似不是响应式的？
      get isConnected() {
        return !isEmptyAddress(get().address)
      },

      get MockERC20_BalanceFormat() {
        return format_Mock_ERC20_Balance(get().MockERC20_Balance)
      },

      get MockUSDC_BalanceFormat() {
        return format_MOCK_USDC_Balance(get().MockUSDC_Balance)
      },

      setState: values => set(values),
    }),
    {
      name: 'store',
    }
  )
)
