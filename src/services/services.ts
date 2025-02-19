import { addressConfig } from '@/address-config'
import { store } from '@/store/store'
import { wallet } from '@/utils/wallet'
import type { Address } from 'viem'

class Services {
  // TODO: 名字太长了，需要优化
  async getMockERC20Balance(): Promise<bigint> {
    // TODO: 每次用都要 as 一下，配置的地方改一下
    const contract = addressConfig.mockERC20 as Address
    const balance = await wallet.getBalance(contract)
    console.log('查询 MockERC20 余额', contract, balance)
    store.setState({ MockERC20_Balance: balance })
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
    store.setState({ MockUSDC_Balance: balance })
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
}

export const services = new Services()
