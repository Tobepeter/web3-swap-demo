import { ethers } from 'ethers'

class Wallet {
  private provider: ethers.providers.Web3Provider // 提供商
  private signer: ethers.Signer // 签名者

  constructor() {
    this.initProvider()
  }

  private initProvider() {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask!')
    }
    this.provider = new ethers.providers.Web3Provider(window.ethereum)
    this.signer = this.provider.getSigner()
  }

  /**
   * 连接钱包
   * @returns 钱包地址
   *
   * 一个 MetaMask 钱包可以同时管理多个账户地址
   * 这是 EIP-1102 规范的一部分，定义了 Web3 提供商应该如何请求用户授权
   * accounts[0] 代表当前选中的主账户
   */
  async connectWallet(): Promise<string> {
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
    const network = await this.provider.getNetwork()
    return network.chainId
  }

  /**
   * 获取钱包余额
   * @param address 钱包地址
   * @returns 余额（转换为 ETH 单位）
   */
  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address)
    return ethers.utils.formatEther(balance)
  }

  /**
   * 发送交易
   * @param to 接收地址
   * @param amount ETH 数量
   */
  async sendTransaction(to: string, amount: string) {
    const value = ethers.utils.parseEther(amount)
    const tx = await this.signer.sendTransaction({ to, value })
    return tx
  }

  /**
   * 切换网络
   * @param chainId 目标链 ID
   */
  async switchNetwork(chainId: number) {
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
   * @param tokenAddress 代币合约地址
   * @returns 代币精度
   */
  async getTokenDecimals(tokenAddress: string): Promise<number> {
    const erc20Abi = ['function decimals() view returns (uint8)']
    const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider)
    return contract.decimals()
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
