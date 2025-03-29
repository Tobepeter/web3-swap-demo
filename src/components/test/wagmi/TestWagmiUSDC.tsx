import { addressConfig } from '@/address-config'
import { useReadErc20Allowance, useReadErc20BalanceOf, useReadErc20Name, useReadErc20Symbol } from '../../../generated'
import { Card } from 'antd'
import { store } from '@/store/store'
import { Address } from 'viem'

export const TestWagmiUSDC = () => {
  const usdcAddress = addressConfig.mockUSDC as Address
  const userAddress = store(state => state.address)

  const { data: name } = useReadErc20Name({
    address: usdcAddress,
  })

  const { data: symbol } = useReadErc20Symbol({
    address: usdcAddress,
  })

  const { data: balance } = useReadErc20BalanceOf({
    address: usdcAddress,
    args: [userAddress],
  })

  const { data: allowance } = useReadErc20Allowance({
    address: usdcAddress,
    args: [userAddress, userAddress],
  })

  return (
    <div className="mt-10">
      <Card title="【测试 USDC Wagmi】" className="max-w-md">
        <div className="space-y-2">
          <div>代币名称: {name || '加载中...'}</div>
          <div>代币符号: {symbol || '加载中...'}</div>
          <div>余额: {balance?.toString() || '加载中...'}</div>
          <div>授权: {allowance?.toString() || '加载中...'}</div>
        </div>
      </Card>
    </div>
  )
}
