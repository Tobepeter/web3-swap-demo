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

  // 配置多个RPC节点，按优先级排序
  RPC_URLS = {
    // NOTE: 默认免费节点，老挂
    drpc: 'https://sepolia.drpc.org',

    // 'https://rpc.sepolia.org',
    // 'https://rpc2.sepolia.org',
    // 'https://eth-sepolia.g.alchemy.com/v2/your-api-key', // 替换为你的 Alchemy API Key

    // NOTE: infura 的节点，现在归属 metamask
    //   @doc: https://docs.metamask.io/services/get-started/endpoints/#ethereum
    infura: 'https://sepolia.infura.io/v3/6441ad67f596437d9f2b4e994c66cb4e',
  }

  /* 初始化合约 */
  init() {
    const { mockERC20, mockUSDC, mockUniswapV2Pair } = addressConfig

    this.publicClient = createPublicClient({
      transport: http(this.RPC_URLS.infura),
      chain: this.chain,
    }) as any

    // TODO：看看如何优化体验
    // 如果 window.ethereum 不存在，则不初始化 walletClient
    if (!window.ethereum) {
      return
    }

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
