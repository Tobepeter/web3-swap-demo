import { addressConfig } from '@/address-config'
import { store } from '@/store/store'
import { wallet } from '@/utils/wallet'
import type { Address } from 'viem'

class Services {
  // TODO: 名字太长了，需要优化
  async getMockERC20Balance(): Promise<bigint> {
    const mockERC20Address = addressConfig.mockERC20
    const balance = await wallet.getBalance(mockERC20Address as Address)
    console.log('查询 MockERC20 余额', mockERC20Address, balance)
    store.setState({ MockERC20_Balance: balance })
    return balance
  }

  async getMockUSDCBalance(): Promise<bigint> {
    const mockUSDCAddress = addressConfig.mockUSDC
    const balance = await wallet.getBalance(mockUSDCAddress as Address)
    console.log('查询 MockUSDC 余额', mockUSDCAddress, balance)
    store.setState({ MockUSDC_Balance: balance })
    return balance
  }
}

export const services = new Services()
