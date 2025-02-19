import type { Address, Chain, PublicClient, WalletClient } from 'viem'
import { createPublicClient, createWalletClient, custom, formatEther, http } from 'viem'
import { sepolia } from 'viem/chains'

class Wallet {
  private client: PublicClient // 公共客户端，用于读取链上数据
  private walletClient: WalletClient // 钱包客户端，用于发送交易

  chain: Chain

  constructor() {
    this.initClient()
  }

  private initClient() {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask!')
    }

    this.chain = sepolia

    // TODO: 类型不兼容，不好排查
    this.client = createPublicClient({
      chain: this.chain,
      transport: http(),
    }) as any

    this.walletClient = createWalletClient({
      chain: this.chain,
      transport: custom(window.ethereum),
    })
  }

  /**
   * 连接钱包
   * @returns 钱包地址
   *
   * 一个 MetaMask 钱包可以同时管理多个账户地址
   * 这是 EIP-1102 规范的一部分，定义了 Web3 提供商应该如何请求用户授权
   * accounts[0] 代表当前选中的主账户
   */
  async connectWallet(): Promise<Address> {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    return accounts[0]
  }

  /**
   * 获取当前网络 ID
   * @returns 当前网络 ID
   */
  async getNetworkId(): Promise<number> {
    const chainId = await this.client.transport.getChainId()
    return chainId
  }

  /**
   * 获取钱包余额
   * @param address 钱包地址
   */
  async getBalance(address: Address) {
    return this.client.getBalance({ address })
  }

  /**
   * 获取钱包余额（以 ETH 为单位）
   * @param address 钱包地址
   */
  async getBalanceETH(address: Address): Promise<string> {
    const balance = await this.getBalance(address)
    return formatEther(balance)
  }

  /**
   * 发送交易
   * @param to 接收地址
   * @param amount ETH 数量
   */
  async sendTransaction(to: Address, amount: bigint) {
    const [address] = await this.walletClient.getAddresses()
    return this.walletClient.sendTransaction({
      account: address,
      to,
      value: amount,
      kzg: undefined,
      chain: this.chain,
    })
  }

  /**
   * 切换网络
   * @param chainId 目标链 ID
   */
  async switchNetwork(chainId: number) {
    // TODO: 和本地变量同步起来
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('需要添加网络到 MetaMask')
      }
      throw error
    }
  }

  /**
   * 添加代币到 MetaMask
   * @param tokenAddress 代币合约地址
   * @param symbol 代币符号 (如 USDT、LINK 等)
   * @param decimals 代币精度
   */
  async addToken(tokenAddress: string, symbol: string, decimals: number) {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: [
        {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol,
            decimals,
          },
        },
      ],
    })
  }

  /**
   * 获取代币精度
   * @param address 代币合约地址
   * @returns 代币精度
   */
  async getTokenDecimals(address: Address): Promise<number> {
    const erc20Abi = ['function decimals(address) view returns (uint8)']
    const decimals = (await this.client.readContract({
      address: address,
      abi: erc20Abi,
      functionName: 'decimals',
    })) as number
    return decimals
  }

  /**
   * 监听钱包事件
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  on(eventName: string, callback: (...args: any[]) => void) {
    window.ethereum.on(eventName, callback)
  }

  /**
   * 移除事件监听
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  removeListener(eventName: string, callback: (...args: any[]) => void) {
    window.ethereum.removeListener(eventName, callback)
  }
}

export const wallet = new Wallet()
