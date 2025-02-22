import { TokenTag } from '@/components/TokenTag'
import { historyServices } from '@/services/HistoryServices'
import { historyStore } from '@/store/history'
import { store } from '@/store/store'
import { TransactionEvent } from '@/types/HistoryType'
import { isEmptyAddress } from '@/utils/common'
import { historyClient } from '@/utils/HistoryClient'
import { tokenUtil } from '@/utils/TokenUtil'
import { MinusCircleOutlined, PlusCircleOutlined, SwapOutlined } from '@ant-design/icons'
import { Card, List, Typography } from 'antd'
import { useEffect } from 'react'
import { formatUnits } from 'viem'

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
        return (
          <div className="flex items-center gap-2">
            <SwapOutlined className="text-blue-500 text-xl" />
            <span>交易</span>
          </div>
        )
      case TransactionEvent.AddLiquidity:
        return (
          <div className="flex items-center gap-2">
            <PlusCircleOutlined className="text-green-500 text-xl" />
            <span>添加流动性</span>
          </div>
        )
      case TransactionEvent.RemoveLiquidity:
        return (
          <div className="flex items-center gap-2">
            <MinusCircleOutlined className="text-orange-500 text-xl" />
            <span>移除流动性</span>
          </div>
        )
    }
  }

  const getEventContent = (item: (typeof history)[0]) => {
    const tagERC20 = <TokenTag token={TK_ERC20} />
    const tagUSDC = <TokenTag token={TK_USDC} />

    if (item.swap) {
      const { amount0In, amount1In, amount0Out, amount1Out } = item.swap

      const isFromERC20 = amount0In > 0n
      const fromToken = isFromERC20 ? TK_ERC20 : TK_USDC
      const toToken = isFromERC20 ? TK_USDC : TK_ERC20
      const fromAmount = isFromERC20 ? amount0In : amount1In
      const toAmount = isFromERC20 ? amount1Out : amount0Out

      const fromTag = isFromERC20 ? tagERC20 : tagUSDC
      const toTag = isFromERC20 ? tagUSDC : tagERC20

      const fromText = tokenUtil.unit2tk(fromToken, fromAmount)
      const toText = tokenUtil.unit2tk(toToken, toAmount)

      return (
        <>
          <div className="flex items-center gap-2">
            <div>
              {fromText} {fromTag}
            </div>
            <div className="mx-2">→</div>
            <div>
              {toText} {toTag}
            </div>
          </div>
        </>
      )
    }

    if (item.liquidity) {
      const { amount0, amount1 } = item.liquidity
      return (
        <>
          <Text>
            {formatUnits(amount0, 18)} {tagERC20}
          </Text>
          <Text className="mx-2">+</Text>
          <Text>
            {formatUnits(amount1, 6)} {tagUSDC}
          </Text>
        </>
      )
    }
  }

  // 需要倒序的形式，最新的在前面
  const dataSource = history.concat().reverse()

  // TODO：有空可以实现一个无限滚动的，每次滚动加载或者分页模式

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
                    <div className="min-w-40">{getEventTitle(item.eventName)}</div>
                    <div>{getEventContent(item)}</div>
                  </div>
                  <Typography.Link className="mr-2" href={historyClient.getTransactionViewUrl(item.txHash)} target="_blank">
                    查看交易详情
                  </Typography.Link>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}
