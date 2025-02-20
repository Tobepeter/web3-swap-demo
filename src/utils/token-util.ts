import { store } from '@/store/store'
import { formatEther, formatUnits, parseEther, parseUnits } from 'viem'

class TokenUtil {
  getBalanceTK(token: TokenType): string {
    if (token === mockERC20) {
      return store.getState().mockERC20TK
    } else if (token === mockUSDC) {
      return store.getState().mockUSDCTK
    }
    return ''
  }

  tk2wei(token: TokenType, tk: string): bigint {
    const config = tokenConfig[token]
    let balance: bigint
    if (config.decimal) {
      balance = parseUnits(tk, config.decimal)
    } else {
      balance = parseEther(tk)
    }
    return balance
  }

  wei2tk(token: TokenType, wei: bigint): string {
    const config = tokenConfig[token]
    let tk: string
    if (config.decimal) {
      tk = formatUnits(wei, config.decimal)
    } else {
      tk = formatEther(wei)
    }
    return tk
  }
}
export const tokenUtil = new TokenUtil()
