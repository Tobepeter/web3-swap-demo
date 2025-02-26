import { addressConfig } from '@/address-config'
import { useReadErc20BalanceOf, useReadErc20Name, useReadErc20Symbol } from '../generated'
import { Card } from 'antd'
import { store } from '@/store/store'
import { Address } from 'viem'

export const TestWagmi = () => {
  const erc2oAddress = addressConfig.mockERC20 as Address
  const usdcAddress = addressConfig.mockUSDC as Address
  const userAddress = store(state => state.address)

  const { data: mockerc20_name } = useReadErc20Name({
    address: erc2oAddress,
  })

  const { data: mockerc20_symbol } = useReadErc20Symbol({
    address: erc2oAddress,
  })

  const { data: mockerc20_balance } = useReadErc20BalanceOf({
    address: erc2oAddress,
    args: [userAddress],
  })

  const { data: mockusdc_name } = useReadErc20Name({
    address: erc2oAddress,
  })

  const { data: mockusdc_symbol } = useReadErc20Symbol({
    address: usdcAddress,
  })

  const { data: mockusdc_balance } = useReadErc20BalanceOf({
    address: usdcAddress,
    args: [userAddress],
  })

  return (
    <div className="mt-10">
      <Card title="【测试 Wagmi react hooks】" className="max-w-md">
        <div className="space-y-2">
          <div> 
            <div>代币名称: {mockerc20_name || '加载中...'}</div>
            <div>代币符号: {mockerc20_symbol || '加载中...'}</div>
            <div>余额: {mockerc20_balance?.toString() || '加载中...'}</div>
          </div>
          <div className="mt-2">
            <div>代币名称: {mockusdc_name || '加载中...'}</div>
            <div>代币符号: {mockusdc_symbol || '加载中...'}</div>
            <div>余额: {mockusdc_balance?.toString() || '加载中...'}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
