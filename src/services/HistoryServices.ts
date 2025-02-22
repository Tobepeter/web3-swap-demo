import { historyStore } from '@/store/history'
import { store } from '@/store/store'
import { TransactionEvent, TransactionHistory } from '@/types/HistoryType'
import { isEmptyAddress } from '@/utils/common'
import { historyClient, HistoryLog } from '@/utils/HistoryClient'

class HistoryServices {
  isInit = false
  history: TransactionHistory[] = []
  secPerBlock = 15 // 以太坊区块平均的时间间隔

  async init() {
    if (this.isInit) return
    this.isInit = true

    const address = store.getState().address

    if (isEmptyAddress(address)) {
      message.error('请先设置钱包地址')
      return
    }

    const logs = await historyClient.getLogs()
    const history = this.processLogs(logs)
    historyStore.setState({ history })

    // 监听后续变化
    const unwatch = historyClient.watchLogs(logs => {
      const newHistory = this.processLogs(logs)
      console.log('新的日志', newHistory)
      historyStore.setState(state => ({
        history: state.history.concat(newHistory),
      }))
    })
  }

  processLogs(logs: HistoryLog[]) {
    const history: TransactionHistory[] = []
    for (const log of logs) {
      const item = this.processLog(log)
      if (item) {
        history.push(item)
      }
    }
    return history
  }

  processLog(log: HistoryLog) {
    const address = store.getState().address

    if (log.args === undefined) {
      console.error('log.args is undefined', log)
      return
    }

    const sender = log.args.sender
    if (!sender || sender.toLowerCase() !== address.toLowerCase()) return

    // NOTE: 获取时间戳还要一个接口，暂时先不加，看看如何优化
    // const block = await client.getBlock({ blockNumber: log.blockNumber })
    const eventName = log.eventName as TransactionEvent

    const common: Partial<TransactionHistory> = {
      txHash: log.transactionHash,
      // timestamp: Number(block.timestamp),
      sender,
      eventName,
    }

    let override: Partial<TransactionHistory>
    // TODO：其实是联合类型中的一个，但是下面会变化，看看如何优化
    const argsAny = log.args as any
    switch (eventName) {
      case TransactionEvent.Swap:
        override = {
          swap: {
            amount0In: argsAny.amount0In,
            amount1In: argsAny.amount1In,
            amount0Out: argsAny.amount0Out,
            amount1Out: argsAny.amount1Out,
            to: argsAny.to,
          },
        }
        break
      case TransactionEvent.AddLiquidity:
        override = {
          liquidity: {
            isAdd: true,
            amount0: argsAny.amount0,
            amount1: argsAny.amount1,
            liquidity: argsAny.liquidity,
          },
        }
        break
      case TransactionEvent.RemoveLiquidity:
        override = {
          liquidity: {
            isAdd: false,
            amount0: argsAny.amount0,
            amount1: argsAny.amount1,
            liquidity: argsAny.liquidity,
          },
        }
        break
      default:
        console.error('unknown event', eventName)
        break
    }

    return { ...common, ...override } as TransactionHistory
  }
}

export const historyServices = new HistoryServices()
