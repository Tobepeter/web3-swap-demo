import { addressConfig } from '@/address-config'
import { Address } from 'viem'

// TODO: 这个全局变量太容易和本地变量冲突了
export const mockERC20 = 'MockERC20'

export const mockUSDC = 'MOCK_USDC'

export type TokenType = typeof mockERC20 | typeof mockUSDC

export type TokenConfig = {
  name: string
  address: Address
  decimal?: number
}

export const tokenConfig: Record<string, TokenConfig> = {
  [mockERC20]: {
    name: mockERC20,
    address: addressConfig.mockERC20 as Address,
  },
  [mockUSDC]: {
    name: mockUSDC,
    address: addressConfig.mockUSDC as Address,
    decimal: 6,
  },
}
