import { store } from '@/store/store'
import { PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Modal } from 'antd'
import React, { useState } from 'react'

export const HomePage: React.FC = () => {
  const { address, chainId, MockERC20Balance, MOCK_USDCBalance, isConnected } = store()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<'MockERC20' | 'MOCK_USDC'>('MockERC20')
  const [amount, setAmount] = useState<number>(100)

  const handleOpenModal = (token: 'MockERC20' | 'MOCK_USDC') => {
    setSelectedToken(token)
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    // TODO: 这里添加确认后的操作
    console.log(`添加 ${amount} ${selectedToken}`)
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
            <p>钱包地址: {address}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">代币余额</h2>
          {/* 代币余额显示区域 */}
          <div className="space-y-2">
            <div className="p-4 bg-gray-100 rounded flex justify-between items-center">
              <p>MockERC20: 0</p>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('MockERC20')} size="small" />
            </div>
            <div className="p-4 bg-gray-100 rounded flex justify-between items-center">
              <p>MOCK_USDC: 0</p>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('MOCK_USDC')} size="small" />
            </div>
          </div>
        </div>
      </div>

      <Modal title={`添加${selectedToken}代币（测试用）`} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <div className="py-4">
          <InputNumber defaultValue={100} value={amount} onChange={value => setAmount(value || 0)} style={{ width: '100%' }} />
        </div>
      </Modal>
    </div>
  )
}
