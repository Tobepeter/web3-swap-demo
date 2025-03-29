import { TestWagmi } from '@/components/test/wagmi/TestWagmi'
import { TokenTag } from '@/components/TokenTag'
import { services } from '@/services/services'
import { store } from '@/store/store'
import { isEmptyAddress } from '@/utils/common'
import { useGitPagesNav } from '@/utils/useGitPagesNav'
import { CopyOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, InputNumber, Modal, Typography } from 'antd'
import { useState } from 'react'

export const Home = () => {
  const address = store(state => state.address)
  const mockERC20TK = store(state => state.mockERC20TK)
  const mockUSDCTK = store(state => state.mockUSDCTK)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mintToken, setMintToken] = useState<TokenType>(null)
  const [amount, setAmount] = useState<number>(100)
  const [isLoading, setIsLoading] = useState(false)

  useGitPagesNav()

  const handleOpenModal = (token: TokenType) => {
    setMintToken(token)
    setIsModalOpen(true)
  }

  const onMint = async () => {
    setIsLoading(true)
    try {
      await services.mint(mintToken, address, amount.toString())
      setIsModalOpen(false)
    } catch (error) {
      message.error('添加代币失败')
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = async () => {
    setIsLoading(true)
    await services.fetchBalances()
    setIsLoading(false)
  }

  const addressStr = isEmptyAddress(address) ? '-' : address
  const isConnected = !isEmptyAddress(address)
  const MockERC20BalanceStr = isConnected && !isLoading ? mockERC20TK : '-'
  const MockUSDCBalanceStr = isConnected && !isLoading ? mockUSDCTK : '-'

  const onMintCancel = () => {
    if (isLoading) return
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">首页</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">钱包信息</h2>
          {/* 钱包地址显示区域 */}
          <div className="p-4 bg-gray-100 rounded">
            <div className="flex items-center gap-2">
              <span>地址</span>
              <Typography.Text copyable={{ tooltips: ['复制', '已复制'] }}>{addressStr}</Typography.Text>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">代币余额</h2>
              <Button icon={<SyncOutlined spin={isLoading} />} onClick={onRefresh} size="small" loading={isLoading} disabled={!isConnected} />
            </div>
          </div>
          {/* 代币余额显示区域 */}
          <div className="space-y-2">
            <div className="p-4 bg-gray-100 rounded flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TokenTag token={TK_ERC20} />
                {MockERC20BalanceStr}
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(TK_ERC20)} size="small" disabled={!isConnected} />
            </div>
            <div className="p-4 bg-gray-100 rounded flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TokenTag token={TK_USDC} />
                {MockUSDCBalanceStr}
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(TK_USDC)} size="small" disabled={!isConnected} />
            </div>
          </div>
        </div>
      </div>

      <Modal title={`添加${mintToken}代币（测试用）`} open={isModalOpen} onOk={onMint} onCancel={onMintCancel} confirmLoading={isLoading}>
        <div className="py-4">
          <InputNumber defaultValue={100} value={amount} onChange={value => setAmount(value || 0)} style={{ width: '100%' }} disabled={isLoading} />
        </div>
      </Modal>
    </div>
  )
}
