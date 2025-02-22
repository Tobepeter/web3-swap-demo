import { addressConfig } from '@/address-config'
import { store } from '@/store/store'
import type { Address } from 'viem'
import { MockUniswapV2Pair__factory } from '../../contracts/typechain-types'
import { contract } from './contract'
import { tokenUtil } from './TokenUtil'

class LiqControl {
  precision = 2

  /* 添加流动性 */
  async addLiquidity(amount0: bigint, amount1: bigint) {
    const tx = await contract.walletClient.writeContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'addLiquidity',
      args: [amount0, amount1],
      account: store.getState().address,
      // TODO: walletClient 已经存在 chain 参数，不知道为什么还要传？
      chain: contract.chain,
    })
    console.log('addLiquidity', tx)
    const receipt = await contract.publicClient.waitForTransactionReceipt({ hash: tx })
    console.log('addLiquidity', receipt)
    return receipt
  }

  /* 移除流动性 */
  async removeLiquidity(amount: bigint) {
    const tx = await contract.walletClient.writeContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'removeLiquidity',
      args: [amount],
      account: store.getState().address,
      chain: contract.chain,
    })
    console.log('removeLiquidity', tx)
    const receipt = await contract.publicClient.waitForTransactionReceipt({ hash: tx })
    console.log('removeLiquidity', receipt)
    return receipt
  }

  /* 查询用户流动性 */
  async getLiquidity(address: Address) {
    return contract.publicClient.readContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'liquidity',
      args: [address],
    })
  }

  /* 查询总流动性 */
  async getTotalLiquidity() {
    return contract.publicClient.readContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'totalLiquidity',
    })
  }

  /* 查询储备量 */
  async getReserves() {
    const [reserve0, reserve1] = await Promise.all([
      contract.publicClient.readContract({
        address: addressConfig.mockUniswapV2Pair as Address,
        abi: MockUniswapV2Pair__factory.abi,
        functionName: 'reserve0',
      }),
      contract.publicClient.readContract({
        address: addressConfig.mockUniswapV2Pair as Address,
        abi: MockUniswapV2Pair__factory.abi,
        functionName: 'reserve1',
      }),
    ])
    return { reserve0, reserve1 }
  }

  /* 查询代币地址 */
  async getTokens() {
    const [token0, token1] = await Promise.all([
      contract.publicClient.readContract({
        address: addressConfig.mockUniswapV2Pair as Address,
        abi: MockUniswapV2Pair__factory.abi,
        functionName: 'token0',
      }),
      contract.publicClient.readContract({
        address: addressConfig.mockUniswapV2Pair as Address,
        abi: MockUniswapV2Pair__factory.abi,
        functionName: 'token1',
      }),
    ])
    return { token0, token1 }
  }

  /* 查询汇率 */
  async getAmountOut(amountIn: bigint, tokenIn: Address) {
    return contract.publicClient.readContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'getAmountOut',
      args: [amountIn, tokenIn],
    })
  }

  /**
   * 用户流动性百分比
   */
  getUserLpPercent() {
    const userLiq = store.getState().userLiq
    const totalLiq = store.getState().totalLiq
    if (!userLiq || !totalLiq) return 0

    const percFactor = 2
    const userLPMult = userLiq * BigInt(10 ** (this.precision + percFactor))
    const totalLPMult = totalLiq
    const result = Number(userLPMult / totalLPMult) / 10 ** this.precision
    return result
  }

  /**
   * 计算移除流动性获得代币
   * @param percent 百分比，如 10.12
   *
   * 公式:
   * amount0 = (LP * reserve0) / totalLP
   * amount1 = (LP * reserve1) / totalLP
   *
   * LP = percent * 0.01 * totalLP
   * amount0 = percent * reserve0 / 100
   * amount1 = percent * reserve1 / 100
   */
  getRemoveLiquidityTokens(percent: number) {
    // TODO: 这种写法很容易丢失react响应式，有空要优化下
    //  但是太多相似的变量又会导致一个组件维护很多冗余的状态
    const { totalLiq, reserve0, reserve1 } = store.getState()
    let amount0 = 0n
    let amount1 = 0n

    if (totalLiq > 0) {
      const percentFactor = 2
      const percentMult = Math.floor(percent * 10 ** this.precision)
      const divider = 10 ** (this.precision + percentFactor)
      amount0 = (BigInt(percentMult) * reserve0) / BigInt(divider)
      amount1 = (BigInt(percentMult) * reserve1) / BigInt(divider)
    }

    const token0 = tokenUtil.unit2tk(TK_ERC20, amount0)
    const token1 = tokenUtil.unit2tk(TK_USDC, amount1)
    return { amount0, amount1, token0, token1 }
  }

  /**
   * 计算添加流动性最大的添加代币数量
   */
  getMaxAddLiquidityTokens() {
    // TODO: reserve 为 0，比例计算不了，不知道该如何处理
    const { reserve0, reserve1, mockERC20, mockUSDC } = store.getState()

    // TODO: 应该会有严重的bug，因为tokens的decimals是不同的，这个公式需要调整

    let amount0 = 0n
    let amount1 = 0n
    const valid = reserve0 > 0n && reserve1 > 0n && mockERC20 > 0n && mockUSDC > 0n
    if (valid) {
      const percFactor = 2
      // TODO: 很多精度换算代码，待优化
      const mult = BigInt(10 ** (this.precision + percFactor))
      // 比例尺不同，非常容易丢失精度，一定要额外计算一个Inv
      const reserveRatio = (reserve0 * mult) / reserve1
      const reserveRatioInv = (reserve1 * mult) / reserve0
      const tokenRatio = (mockERC20 * mult) / mockUSDC

      if (reserveRatio > tokenRatio) {
        amount0 = mockERC20
        amount1 = (amount0 * reserveRatioInv) / mult
      } else {
        amount1 = mockUSDC
        amount0 = (amount1 * reserveRatio) / mult
      }
    }
    return { amount0, amount1 }
  }

  /**
   * 根据百分比计算流动性
   */
  getLPByPerc(perc: number) {
    const { totalLiq } = store.getState()
    if (!totalLiq) return 0n
    const percFactor = 2
    const percMult = BigInt(Math.floor(perc * 10 ** this.precision))
    const divider = BigInt(10 ** (this.precision + percFactor))
    return (percMult * totalLiq) / divider
  }
}

export const liqControl = new LiqControl()
