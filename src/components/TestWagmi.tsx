import { addressConfig } from '@/address-config'
import { useReadErc20BalanceOf, useReadErc20Name, useReadErc20Symbol } from '../generated'
import { Card } from 'antd'
import { store } from '@/store/store'
import { Address } from 'viem'

export const TestWagmi = () => {
  const usdtAddress = addressConfig.mockUSDC as Address
  const userAddress = store(state => state.address)

  const { data: name } = useReadErc20Name({
    address: usdtAddress,
  })

  const { data: symbol } = useReadErc20Symbol({
    address: usdtAddress,
  })

  const { data: balance } = useReadErc20BalanceOf({
    address: usdtAddress,
    args: [userAddress],
  })

  return (
    <div className="mt-10">
      <Card title="【测试 Wagmi react hooks】" className="max-w-md">
        <div className="space-y-2">
          <div>代币名称: {name || '加载中...'}</div>
          <div>代币符号: {symbol || '加载中...'}</div>
          <div>余额: {balance?.toString() || '加载中...'}</div>
        </div>
      </Card>
    </div>
  )
}
