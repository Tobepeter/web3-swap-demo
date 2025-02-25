import { addressConfig } from '@/address-config'
import { store } from '@/store/store'
import { Address } from 'viem'
import { MockUniswapV2Pair__factory } from '../../contracts/typechain-types'
import { contract } from './contract'
import { tokenConfig } from '@/config/token'

class SwapControl {
  /**
   * 计算兑换后获得的代币数量
   */
  async getAmountOut(amountIn: bigint, tokenIn: TokenType) {
    const tokenAddress = tokenConfig[tokenIn].address
    const amountOut = await contract.publicClient.readContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'getAmountOut',
      args: [amountIn, tokenAddress],
    })
    return amountOut
  }

  /**
   * 执行代币兑换
   * @param amountIn 输入代币数量
   * @param amountOut 期望获得的输出代币数量
   * @param token 输入代币类型
   * @returns 交易回执
   */
  async swap(amountIn: bigint, amountOut: bigint, token: TokenType, slippage: bigint) {
    const amount0In = token === TK_ERC20 ? amountIn : 0n
    const amount1In = token === TK_USDC ? amountIn : 0n
    const amount0Out = token === TK_USDC ? amountOut : 0n
    const amount1Out = token === TK_ERC20 ? amountOut : 0n

    const tx = await contract.walletClient.writeContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'swap',
      args: [amount0In, amount1In, amount0Out, amount1Out, store.getState().address, slippage],
      account: store.getState().address,
      chain: contract.chain,
    })
    // TODO: success 字段 还没有使用
    const receipt = await contract.publicClient.waitForTransactionReceipt({ hash: tx })
  }
}

export const swapControl = new SwapControl()
