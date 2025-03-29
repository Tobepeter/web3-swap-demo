import { addressConfig } from '@/address-config'
import { store } from '@/store/store'
import { Card } from 'antd'
import { Address } from 'viem'
import { useReadErc20Allowance, useReadErc20BalanceOf, useReadErc20Name, useReadErc20Symbol } from '../../../generated'
export const TestWagmiERC20 = () => {
  const erc2oAddress = addressConfig.mockERC20 as Address
  const userAddress = store(state => state.address)

  const { data: name } = useReadErc20Name({
    address: erc2oAddress,
  })

  const { data: allowance } = useReadErc20Allowance({
    address: erc2oAddress,
    args: [userAddress, userAddress],
  })

  const { data: symbol } = useReadErc20Symbol({
    address: erc2oAddress,
  })

  const { data: balance } = useReadErc20BalanceOf({
    address: erc2oAddress,
    args: [userAddress],
  })

  return (
    <div>
      <Card title="【测试 Wagmi ERC20】" className="max-w-md">
        <div className="space-y-2">
          <div>代币名称: {name || '加载中...'}</div>
          <div>授权: {allowance?.toString() || '加载中...'}</div>
          <div>代币符号: {symbol || '加载中...'}</div>
          <div>余额: {balance?.toString() || '加载中...'}</div>
        </div>
      </Card>
    </div>
  )
}
