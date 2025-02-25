import { store } from '@/store/store'
import { swapControl } from './SwapClient'
import { tokenUtil } from './TokenUtil'

export const isDev = process.env.NODE_ENV === 'development'

class DebugUtil {
  init() {
    if (!isDev) return
    win.debugUtil = this
  }

  printBalance() {
    const state = store.getState()
    const { mockERC20TK, mockUSDCTK } = state
    console.log('mockERC20TK', mockERC20TK)
    console.log('mockUSDCTK', mockUSDCTK)
  }

  async printERC20AmoutOut(tk: number | string) {
    const amountIn = tokenUtil.tk2unit(TK_ERC20, tk + '')
    const amountOut = await swapControl.getAmountOut(amountIn, TK_ERC20)

    const amountOutTK = tokenUtil.unit2tk(TK_USDC, amountOut)
    console.log('amountOutTK', amountOutTK)
  }

  async printUSDCAmoutOut(tk: number | string) {
    const amountIn = tokenUtil.tk2unit(TK_USDC, tk + '')
    const amountOut = await swapControl.getAmountOut(amountIn, TK_USDC)

    const amountOutTK = tokenUtil.unit2tk(TK_ERC20, amountOut)
    console.log('amountOutTK', amountOutTK)
  }
}

export const debugUtil = new DebugUtil()
