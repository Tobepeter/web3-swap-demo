import { Address, formatEther, formatUnits } from 'viem'

export const USDC_DECIMALS = 6

export const isEmptyAddress = (address: Address): boolean => {
  return address === '0x0' || !address
}

// TODO: 修改导入规则
export const format_Mock_ERC20_Balance = (balance: bigint): string => {
  return formatEther(balance)
}

export const format_MOCK_USDC_Balance = (balance: bigint): string => {
  return formatUnits(balance, USDC_DECIMALS)
}
