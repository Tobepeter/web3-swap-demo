import { ethers } from 'ethers'

class WalletUtils {
  private provider: ethers.providers.Web3Provider | null = null
  private signer: ethers.Signer | null = null

  /**
   * 初始化 provider
   */
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
   */
  async connectWallet(): Promise<string> {
    if (!this.provider) {
      this.initProvider()
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      return accounts[0]
    } catch (error) {
      console.error('连接钱包失败:', error)
      throw error
    }
  }

  /**
   * 获取当前网络 ID
   */
  async getNetworkId(): Promise<number> {
    if (!this.provider) {
      this.initProvider()
    }
    const network = await this.provider!.getNetwork()
    return network.chainId
  }

  /**
   * 获取钱包余额
   * @param address 钱包地址
   */
  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      this.initProvider()
    }
    const balance = await this.provider!.getBalance(address)
    return ethers.utils.formatEther(balance) // 转换为 ETH 单位
  }

  /**
   * 发送交易
   * @param to 接收地址
   * @param amount ETH 数量
   */
  async sendTransaction(to: string, amount: string) {
    if (!this.signer) {
      this.initProvider()
    }
    const tx = await this.signer!.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount),
    })
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
   * @param symbol 代币符号
   * @param decimals 代币精度
   */
  async addToken(tokenAddress: string, symbol: string, decimals: number) {
    try {
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
    } catch (error) {
      console.error('添加代币失败:', error)
      throw error
    }
  }

  /**
   * 监听钱包事件
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  on(eventName: string, callback: (...args: any[]) => void) {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask!')
    }
    window.ethereum.on(eventName, callback)
  }

  /**
   * 移除事件监听
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  removeListener(eventName: string, callback: (...args: any[]) => void) {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask!')
    }
    window.ethereum.removeListener(eventName, callback)
  }
}

export const walletUtils = new WalletUtils()
