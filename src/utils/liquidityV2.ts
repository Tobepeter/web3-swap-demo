import { contract } from './contract'
import type { Address } from 'viem'
import { store } from '@/store/store'

class LiquidityV2 {
  /* 添加流动性 */
  async addLiquidity(amount0: bigint, amount1: bigint) {
    // TODO: 需要connect（ethers的类型）才能使用，可以参考 contract 上的单元测试
    const tx = await contract.swap.addLiquidity(amount0, amount1)
    const receipt = await tx.wait()
    return receipt
  }

  /* 移除流动性 */
  async removeLiquidity(liquidityAmount: bigint) {
    const tx = await contract.swap.removeLiquidity(liquidityAmount)
    const receipt = await tx.wait()
    return receipt
  }

  /* 查询用户流动性 */
  async getLiquidity(address: Address) {
    return contract.swap.liquidity(address)
  }

  /* 查询总流动性 */
  async getTotalLiquidity() {
    return contract.swap.totalLiquidity()
  }

  /* 查询储备量 */
  async getReserves() {
    const [reserve0, reserve1] = await Promise.all([contract.swap.reserve0(), contract.swap.reserve1()])
    return { reserve0, reserve1 }
  }

  /* 查询代币地址 */
  async getTokens() {
    const [token0, token1] = await Promise.all([contract.swap.token0(), contract.swap.token1()])
    return { token0, token1 }
  }
}

export const liquidityV2 = new LiquidityV2()
