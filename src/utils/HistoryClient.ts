import { addressConfig } from '@/address-config'
import { store } from '@/store/store'
import { Address } from 'viem'
import { MockUniswapV2Pair__factory } from '../../contracts/typechain-types'
import { isEmptyAddress } from './common'
import { contract } from './contract'

class HistoryClient {
  secPerBlock = 15 // 以太坊区块平均的时间间隔
  currentBlock = BigInt(0)

  async getLogs() {
    const address = store.getState().address

    if (isEmptyAddress(address)) {
      message.error('请先设置钱包地址')
      return
    }

    const client = contract.publicClient
    const abi = MockUniswapV2Pair__factory.abi

    this.currentBlock = await client.getBlockNumber()
    const hours = 24
    const blockToGoBack = BigInt(Math.floor((hours * 60 * 60) / this.secPerBlock))
    const fromBlock = this.currentBlock - blockToGoBack

    const logs = await client.getLogs({
      address: addressConfig.mockUniswapV2Pair as Address,
      events: abi.filter(x => x.type === 'event'),
      fromBlock,
    })
    return logs
  }

  // 监听后续变化
  watchLogs(onLogs: (logs: HistoryLog[]) => void) {
    const client = contract.publicClient
    const abi = MockUniswapV2Pair__factory.abi

    const unwatch = client.watchEvent({
      address: addressConfig.mockUniswapV2Pair as Address,
      events: abi.filter(x => x.type === 'event'),
      onLogs,
    })

    return unwatch
  }
}

export type HistoryLog = Awaited<ReturnType<HistoryClient['getLogs']>>[number]

export const historyClient = new HistoryClient()
