import { store } from '@/store/store'
import { tokenUtil } from '@/utils/TokenUtil'
import { walletControl } from '@/utils/WalletControl'
import { contract } from '@/utils/contract'
import { type Address } from 'viem'
import { liqControl } from '@/utils/LiqControl'
import { swapControl } from '@/utils/SwapClient'

/**
 * 服务层
 *
 * 相比直接调用合约，服务层有很多额外的状态控制
 * 比如交易后要拉取余额、发生错误要提示
 */
class Services {
  async fetchBalance(token: TokenType) {
    const address = store.getState().address
    if (!address) {
      message.error('请先连接钱包')
      return
    }

    const config = tokenConfig[token]
    const balance = await walletControl.getBalance(token, address)
    const tk = tokenUtil.unit2tk(token, balance)
    console.log(`查询 ${config.name} 余额: ${tk}`)

    if (token === TK_ERC20) {
      store.setState({ mockERC20: balance, mockERC20TK: tk })
    } else if (token === TK_USDC) {
      store.setState({ mockUSDC: balance, mockUSDCTK: tk })
    }
  }

  async fetchBalances() {
    return Promise.all([this.fetchBalance(TK_ERC20), this.fetchBalance(TK_USDC)])
  }

  async mint(token: TokenType, account: Address, tk: string) {
    const config = tokenConfig[token]
    const wei = tokenUtil.tk2unit(token, tk)
    // TODO: 处理失败的case
    //  Uncaught (in promise) ContractFunctionExecutionError: User rejected the request.
    try {
      await walletControl.mint(token, account, wei)
      const tk = tokenUtil.unit2tk(token, wei)
      message.success(`铸造 ${tk} 个 ${config.name} 成功`)
      await this.fetchBalance(token)
    } catch (error) {
      message.error(`铸造 ${config.name} 失败`)
      console.error(error)
    }
  }

  async addLiquidity(amount0: bigint, amount1: bigint) {
    await liqControl.addLiquidity(amount0, amount1)
    await this.fetchLiquidity()
    await this.fetchBalances()
  }

  async removeLiquidity(amount: bigint) {
    await liqControl.removeLiquidity(amount)
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

    const userLiq = await liqControl.getLiquidity(address)
    const totalLiq = await liqControl.getTotalLiquidity()
    const { reserve0, reserve1 } = await liqControl.getReserves()
    const reserve0TK = tokenUtil.unit2tk(TK_ERC20, reserve0)
    const reserve1TK = tokenUtil.unit2tk(TK_USDC, reserve1)

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
    return swapControl.getAmountOut(amountIn, token)
  }

  async swap(amountIn: bigint, amountOut: bigint, token: TokenType) {
    await swapControl.swap(amountIn, amountOut, token)
    await this.fetchBalances()
    message.success('交换成功')
  }

  unlistenAccount() {
    walletControl.off('accountsChanged', this.onAccountChanged)
  }

  listenAccount() {
    this.unlistenAccount()
    walletControl.on('accountsChanged', this.onAccountChanged)
  }

  async connectWallet() {
    let address: Address = '0x0'
    let isConnected = false
    try {
      address = await walletControl.connectWallet()
      console.log('connectWallet', address)
      isConnected = true
    } catch (error) {
      message.error('连接钱包失败')
    }
    store.setState({ address, isConnected })

    // 连接后自动拉取数据
    if (isConnected) {
      await this.fetchBaseInfo()
    }
  }

  async autoDetectWallet() {
    const address = await walletControl.checkWallet()
    if (address) {
      store.setState({ address, isConnected: true })
      await this.fetchBaseInfo()
    }
  }

  private async fetchBaseInfo() {
    await this.fetchBalances()
    await this.fetchLiquidity()
    this.listenAccount()
  }
}

export const services = new Services()
