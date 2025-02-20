import { format_Mock_ERC20_Balance, format_MOCK_USDC_Balance, isEmptyAddress } from '@/utils/common'
import { Address, Hash } from 'viem'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface StoreState {
  address: Address
  isConneted: boolean
  chainId: number
  // TODO: 大小写重新确认下
  MockERC20_Balance: bigint
  MockUSDC_Balance: bigint
  txHash?: Hash
  get isConnected(): boolean
  get isEmptyAddress(): boolean
  get MockERC20_BalanceFormat(): string
  get MockUSDC_BalanceFormat(): string
}

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      address: '0x0' as Address,
      isConneted: false,
      chainId: 1,
      MockERC20_Balance: 0n,
      MockUSDC_Balance: 0n,
      // TODO: 做什么的？
      txHash: undefined as Hash,
    }),
    {
      name: 'store',
    }
  )
)
