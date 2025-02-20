import { store } from '@/store/store'
import { tokenUtil } from '@/utils/token-util'
import { wallet } from '@/utils/wallet'
import { type Address } from 'viem'

class Services {
  async fetchBalance(token: TokenType) {
    const config = tokenConfig[token]
    const balance = await wallet.getBalance(config.address)
    const tk = tokenUtil.wei2tk(token, balance)
    console.log(`查询 ${config.name} 余额: ${tk}`)

    if (token === mockERC20) {
      store.setState({ mockERC20: balance, mockERC20TK: tk })
    } else if (token === mockUSDC) {
      store.setState({ mockUSDC: balance, mockUSDCTK: tk })
    }
  }

  async mint(token: TokenType, account: Address, tk: string): Promise<boolean> {
    const config = tokenConfig[token]
    const wei = tokenUtil.tk2wei(token, tk)
    // TODO: 处理失败的case
    //  Uncaught (in promise) ContractFunctionExecutionError: User rejected the request.
    const success = await wallet.mint(config.address, account, wei)
    if (success) {
      const tk = tokenUtil.wei2tk(token, wei)
      message.success(`铸造 ${tk} 个 ${config.name} 成功`)
      await this.fetchBalance(token)
    } else {
      message.error(`铸造 ${config.name} 失败`)
    }
    return success
  }

  initClient(): boolean {
    const failReason = wallet.initClient()
    if (failReason) {
      message.error(failReason)
      return false
    }
    return true
  }

  private onAccountChanged(accounts: string[]) {
    store.setState({ address: accounts[0] as Address })
  }

  unlistenAccount() {
    wallet.off('accountsChanged', this.onAccountChanged)
  }

  listenAccount() {
    this.unlistenAccount()
    wallet.on('accountsChanged', this.onAccountChanged)
  }

  async connectWallet() {
    let address: Address = '0x0'
    let isConnected = false
    try {
      address = await wallet.connectWallet()
      isConnected = true
    } catch (error) {
      message.error('连接钱包失败')
    }
    store.setState({ address, isConnected })

    // 连接后自动拉取余额
    if (isConnected) {
      await this.fetchBalance(mockERC20)
      await this.fetchBalance(mockUSDC)
      this.listenAccount()
    }
  }
}

export const services = new Services()
