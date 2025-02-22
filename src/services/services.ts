import { store } from '@/store/store'
import { tokenUtil } from '@/utils/token-util'
import { wallet } from '@/utils/wallet'
import { contract } from '@/utils/contract'
import { type Address } from 'viem'
import { liquidity } from '@/utils/liquidity'
import { swap } from '@/utils/swap'

class Services {
  async fetchBalance(token: TokenType) {
    const address = store.getState().address
    if (!address) {
      message.error('请先连接钱包')
      return
    }

    const config = tokenConfig[token]
    const balance = await wallet.getBalance(token, address)
    const tk = tokenUtil.unit2tk(token, balance)
    console.log(`查询 ${config.name} 余额: ${tk}`)

    if (token === mockERC20) {
      store.setState({ mockERC20: balance, mockERC20TK: tk })
    } else if (token === mockUSDC) {
      store.setState({ mockUSDC: balance, mockUSDCTK: tk })
    }
  }

  async fetchBalances() {
    return Promise.all([this.fetchBalance(mockERC20), this.fetchBalance(mockUSDC)])
  }

  async mint(token: TokenType, account: Address, tk: string) {
    const config = tokenConfig[token]
    const wei = tokenUtil.tk2unit(token, tk)
    // TODO: 处理失败的case
    //  Uncaught (in promise) ContractFunctionExecutionError: User rejected the request.
    try {
      await wallet.mint(token, account, wei)
      const tk = tokenUtil.unit2tk(token, wei)
      message.success(`铸造 ${tk} 个 ${config.name} 成功`)
      await this.fetchBalance(token)
    } catch (error) {
      message.error(`铸造 ${config.name} 失败`)
      console.error(error)
    }
  }

  async addLiquidity(amount0: bigint, amount1: bigint) {
    await liquidity.addLiquidity(amount0, amount1)
    await this.fetchLiquidity()
    await this.fetchBalances()
  }

  async removeLiquidity(amount: bigint) {
    await liquidity.removeLiquidity(amount)
    await this.fetchLiquidity()
    await this.fetchBalances()
  }

  // TODO：需要适配数据变化，不过这个不怎么常用其实
  private onAccountChanged(accounts: string[]) {
    store.setState({ address: accounts[0] as Address })
  }

  async fetchLiquidity() {
    const address = store.getState().address
    if (!address) {
      message.error('请先连接钱包')
      return
    }

    const userLiq = await liquidity.getLiquidity(address)
    const totalLiq = await liquidity.getTotalLiquidity()
    const { reserve0, reserve1 } = await liquidity.getReserves()
    const reserve0TK = tokenUtil.unit2tk(mockERC20, reserve0)
    const reserve1TK = tokenUtil.unit2tk(mockUSDC, reserve1)

    console.log(`userLiq ${userLiq}, totalLiq ${totalLiq}`)
    console.log(`reserve0 ${reserve0}, reserve0TK ${reserve0TK}`)
    console.log(`reserve1 ${reserve1}, reserve1TK ${reserve1TK}`)

    store.setState({
      userLiq,
      totalLiq,
      reserve0,
      reserve1,
      reserve0TK,
      reserve1TK,
    })
  }

  async getAmountOut(amountIn: bigint, token: TokenType) {
    return swap.getAmountOut(amountIn, token)
  }

  async swap(amountIn: bigint, amountOut: bigint, token: TokenType) {
    await swap.swap(amountIn, amountOut, token)
    await this.fetchBalances()
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

    // 连接后自动拉取数据
    if (isConnected) {
      await this.fetchBalances()
      await this.fetchLiquidity()
      this.listenAccount()
    }
  }
}

export const services = new Services()
