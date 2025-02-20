import { addressConfig } from '@/address-config'
import { useStore } from '@/store/store'
import { wallet } from '@/utils/wallet'
import type { Address } from 'viem'

class Services {
  // TODO: 名字太长了，需要优化
  async getMockERC20Balance(): Promise<bigint> {
    // TODO: 每次用都要 as 一下，配置的地方改一下
    const contract = addressConfig.mockERC20 as Address
    const balance = await wallet.getBalance(contract)
    console.log('查询 MockERC20 余额', contract, balance)
    useStore.setState({ MockERC20_Balance: balance })
    return balance
  }

  async mintMockERC20(account: Address, amount: bigint): Promise<boolean> {
    const contract = addressConfig.mockERC20 as Address
    const success = await wallet.mint(contract, account, amount)
    if (success) {
      console.log('铸造 MockERC20 成功', account, amount)
      await this.getMockERC20Balance()
    } else {
      console.log('铸造 MockERC20 失败', account, amount)
    }
    return success
  }

  async getMockUSDCBalance(): Promise<bigint> {
    const contract = addressConfig.mockUSDC as Address
    const balance = await wallet.getBalance(contract)
    console.log('查询 MockUSDC 余额', contract, balance)
    useStore.setState({ MockUSDC_Balance: balance })
    return balance
  }

  async mintMockUSDC(account: Address, amount: bigint): Promise<boolean> {
    const contract = addressConfig.mockUSDC as Address
    const success = await wallet.mint(contract, account, amount)
    if (success) {
      console.log('铸造 MockUSDC 成功', account, amount)
      await this.getMockUSDCBalance()
    } else {
      console.log('铸造 MockUSDC 失败', account, amount)
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
    useStore.setState({ address: accounts[0] as Address })
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
    useStore.setState({ address, isConnected })

    // 连接后自动拉取余额
    if (isConnected) {
      await this.getMockERC20Balance()
      await this.getMockUSDCBalance()
      this.listenAccount()
    }
  }
}

export const services = new Services()
