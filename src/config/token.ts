import { addressConfig } from '@/address-config'
import { Address } from 'viem'

export const TK_ERC20 = 'MockERC20'

export const TK_USDC = 'MOCK_USDC'

export type TokenType = typeof TK_ERC20 | typeof TK_USDC

export type TokenConfig = {
  name: string
  address: Address
  decimal?: number
}

export const tokenConfig: Record<string, TokenConfig> = {
  [TK_ERC20]: {
    name: TK_ERC20,
    address: addressConfig.mockERC20 as Address,
  },
  [TK_USDC]: {
    name: TK_USDC,
    address: addressConfig.mockUSDC as Address,
    decimal: 6,
  },
}
