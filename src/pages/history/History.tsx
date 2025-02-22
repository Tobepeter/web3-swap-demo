import { useEffect } from 'react'
import { Card, List, Tag, Typography } from 'antd'
import { historyStore } from '@/store/history'
import { historyServices } from '@/services/HistoryServices'
import { TransactionEvent } from '@/types/HistoryType'
import { formatUnits } from 'viem'
import { store } from '@/store/store'
import { isEmptyAddress } from '@/utils/common'

const { Text, Link } = Typography

export const History = () => {
  const address = store(state => state.address)
  const history = historyStore(state => state.history)
  const [loading, setLoading] = useState(false)

  const initHistory = async () => {
    if (isEmptyAddress(address)) return
    setLoading(true)
    await historyServices.init()
    setLoading(false)
  }

  useEffect(() => {
    initHistory()
  }, [address])

  const getEventTitle = (eventName: TransactionEvent) => {
    switch (eventName) {
      case TransactionEvent.Swap:
        return <Tag color="blue">交易</Tag>
      case TransactionEvent.AddLiquidity:
        return <Tag color="green">添加流动性</Tag>
      case TransactionEvent.RemoveLiquidity:
        return <Tag color="orange">移除流动性</Tag>
    }
  }

  const getEventContent = (item: (typeof history)[0]) => {
    if (item.swap) {
      const { amount0In, amount1In, amount0Out, amount1Out } = item.swap
      if (amount0In > 0n) {
        return (
          <>
            <Text>{formatUnits(amount0In, 18)} MockERC20</Text>
            <Text className="mx-2">→</Text>
            <Text>{formatUnits(amount1Out, 6)} MOCK_USDC</Text>
          </>
        )
      } else {
        return (
          <>
            <Text>{formatUnits(amount1In, 6)} MOCK_USDC</Text>
            <Text className="mx-2">→</Text>
            <Text>{formatUnits(amount0Out, 18)} MockERC20</Text>
          </>
        )
      }
    }

    if (item.liquidity) {
      const { amount0, amount1 } = item.liquidity
      return (
        <>
          <Text>{formatUnits(amount0, 18)} MockERC20</Text>
          <Text className="mx-2">+</Text>
          <Text>{formatUnits(amount1, 6)} MOCK_USDC</Text>
        </>
      )
    }
  }

  // 需要倒序的形式，最新的在前面
  const dataSource = history.concat().reverse()

  return (
    <div className="container mx-auto p-4">
      <Card title="交易历史" className="shadow-lg">
        <List
          dataSource={dataSource}
          loading={loading}
          renderItem={item => (
            <List.Item key={item.txHash} className="hover:bg-gray-50">
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getEventTitle(item.eventName)}
                    <div>{getEventContent(item)}</div>
                  </div>
                  <Link href={`https://sepolia.etherscan.io/tx/${item.txHash}`} target="_blank">
                    查看交易详情
                  </Link>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}
