import { addressConfig } from '@/address-config'

import { Chain, createPublicClient, createWalletClient, custom, http, PublicClient, WalletClient } from 'viem'
import { sepolia } from 'viem/chains'
import { MockERC20, MockERC20__factory, MockUniswapV2Pair, MockUniswapV2Pair__factory, MockUSDC, MockUSDC__factory } from '../../contracts/typechain-types'

class Contract {
  publicClient: PublicClient
  walletClient: WalletClient

  swap: MockUniswapV2Pair
  erc20: MockERC20
  usdc: MockUSDC

  chain: Chain = sepolia

  /* 初始化合约 */
  init() {
    const { mockERC20, mockUSDC, mockUniswapV2Pair } = addressConfig

    // TODO: 类型不兼容，不好排查
    this.publicClient = createPublicClient({
      transport: http(),
      chain: this.chain,
    }) as any

    this.walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: this.chain,
    })

    // 连接合约
    this.swap = MockUniswapV2Pair__factory.connect(mockUniswapV2Pair)
    this.erc20 = MockERC20__factory.connect(mockERC20)
    this.usdc = MockUSDC__factory.connect(mockUSDC)
  }

  getChainId() {
    return this.publicClient.getChainId()
  }
}

export const contract = new Contract()
