import { contract } from './contract'
import type { Address } from 'viem'
import { store } from '@/store/store'
import { addressConfig } from '@/address-config'
import { MockUniswapV2Pair__factory } from '../../contracts/typechain-types'
import { hardhat } from 'viem/chains'

class Liquidity {
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
    const receipt = await contract.publicClient.waitForTransactionReceipt({ hash: tx })
    return receipt
  }

  /* 移除流动性 */
  async removeLiquidity(liquidityAmount: bigint) {
    const tx = await contract.walletClient.writeContract({
      address: addressConfig.mockUniswapV2Pair as Address,
      abi: MockUniswapV2Pair__factory.abi,
      functionName: 'removeLiquidity',
      args: [liquidityAmount],
      account: store.getState().address,
      chain: contract.chain,
    })
    const receipt = await contract.publicClient.waitForTransactionReceipt({ hash: tx })
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
}

export const liquidity = new Liquidity()
