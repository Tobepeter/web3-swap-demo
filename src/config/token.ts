import { addressConfig } from "@/address-config"
import { Address } from "viem"

export const mockERC20 = 'MOCK_ERC20'

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