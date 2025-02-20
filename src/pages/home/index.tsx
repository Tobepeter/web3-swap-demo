import { services } from '@/services/services'
import { store } from '@/store/store'
import { isEmptyAddress } from '@/utils/common'
import { PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Modal } from 'antd'
import React, { useState } from 'react'

export const HomePage: React.FC = () => {
  const address = store(state => state.address)
  const mockERC20TK = store(state => state.mockERC20TK)
  const mockUSDCTK = store(state => state.mockUSDCTK)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mintToken, setMintToken] = useState<TokenType>(null)
  const [amount, setAmount] = useState<number>(100)

  const handleOpenModal = (token: TokenType) => {
    setMintToken(token)
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    // TODO: 添加loading
    setIsModalOpen(false)
    await services.mint(mintToken, address, amount.toString())
  }

  const addressStr = isEmptyAddress(address) ? '-' : address

  const isConnected = !isEmptyAddress(address)
  const MockERC20BalanceStr = isConnected ? mockERC20TK : '-'
  const MockUSDCBalanceStr = isConnected ? mockUSDCTK : '-'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">首页</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">钱包信息</h2>
          {/* 钱包地址显示区域 */}
          <div className="p-4 bg-gray-100 rounded">
            <p>钱包地址: {addressStr}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">代币余额</h2>
          {/* 代币余额显示区域 */}
          <div className="space-y-2">
            <div className="p-4 bg-gray-100 rounded flex justify-between items-center">
              <p>MockERC20: {MockERC20BalanceStr}</p>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(mockERC20)} size="small" />
            </div>
            <div className="p-4 bg-gray-100 rounded flex justify-between items-center">
              <p>MOCK_USDC: {MockUSDCBalanceStr}</p>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(mockUSDC)} size="small" />
            </div>
          </div>
        </div>
      </div>

      <Modal title={`添加${mintToken}代币（测试用）`} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <div className="py-4">
          <InputNumber defaultValue={100} value={amount} onChange={value => setAmount(value || 0)} style={{ width: '100%' }} />
        </div>
      </Modal>
    </div>
  )
}
