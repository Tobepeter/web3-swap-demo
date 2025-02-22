import { services } from '@/services/services'
import { store } from '@/store/store'
import { liquidity } from '@/utils/liquidity'
import { tokenUtil } from '@/utils/token-util'
import { InputNumber, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'

export const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const mockERC20TK = store(state => state.mockERC20TK)
  const mockUSDCTK = store(state => state.mockUSDCTK)
  // TODO: 响应式没设计好，担心响应式失效，先保留
  const reserve0 = store(state => state.reserve0)
  const reserve1 = store(state => state.reserve1)
  const totalLiq = store(state => state.totalLiq)
  const reserve1TK = store(state => state.reserve1TK)
  const reserve0TK = store(state => state.reserve0TK)

  const [token0, setToken0] = useState(0)
  const [token1, setToken1] = useState(0)
  const [loading, setLoading] = useState(false)

  const masAddTokens = liquidity.getMaxAddLiquidityTokens()
  const maxAddToken0 = Number(tokenUtil.unit2tk(mockERC20, masAddTokens.amount0))
  const maxAddToken1 = Number(tokenUtil.unit2tk(mockUSDC, masAddTokens.amount1))

  const onChangeToken0 = (value: number) => {
    // TODO: 这么处理不知道会不会有问题，理论上要用bigint来计算转换的
    setToken0(value)
    setToken1((value * Number(reserve1TK)) / Number(reserve0TK))
  }

  const onChangeToken1 = (value: number) => {
    setToken1(value)
    setToken0((value * Number(reserve0TK)) / Number(reserve1TK))
  }

  // 处理添加流动性
  const handleAddLiquidity = async () => {
    if (!token0 || !token1) {
      message.error('请输入添加的代币数量')
      return
    }

    setLoading(true)
    try {
      const amount0Wei = tokenUtil.tk2unit(mockERC20, token0.toString())
      const amount1Wei = tokenUtil.tk2unit(mockUSDC, token1.toString())
      await services.addLiquidity(amount0Wei, amount1Wei)
      message.success('添加流动性成功')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('添加流动性失败:', error)
      message.error('添加流动性失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="添加流动性" open={isOpen} onOk={handleAddLiquidity} onCancel={onClose} confirmLoading={loading}>
      <div className="space-y-4">
        <div>
          <div className="flex gap-2 mb-2">
            <span>MockERC20</span>
            <span>最大添加值: {maxAddToken0}</span>
            <span>当前余额: {mockERC20TK}</span>
          </div>
          <InputNumber
            className="w-full"
            value={token0}
            onChange={onChangeToken0}
            // TODO: 即使是token，也不建议转换为数字，后续可能放弃 InputNumber，自己做一个
            min={0}
            max={maxAddToken0}
            placeholder="0.0"
          />
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span>MOCK_USDC</span>
            <span>最大添加值: {maxAddToken1}</span>
            <span>当前余额: {mockUSDCTK}</span>
          </div>
          <InputNumber className="w-full" value={token1} onChange={onChangeToken1} min={0} max={maxAddToken1} placeholder="0.0" />
        </div>
      </div>
    </Modal>
  )
}

export interface AddLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}
