import { services } from '@/services/services'
import { store } from '@/store/store'
import { liqControl } from '@/utils/LiqControl'
import { InputNumber, message, Modal } from 'antd'
import React, { useState } from 'react'

export const RemoveLiquidityModal: React.FC<RemoveLiquidityModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const userLP = store(state => state.userLiq)

  const [rmPerc, setRemovePerc] = useState(0)
  const [loading, setLoading] = useState(false)

  const userPerc = liqControl.getUserLpPercent()
  const maxPerc = 100 - 1 / 10 ** liqControl.precision
  const maxRemovePerc = Math.min(userPerc, maxPerc)
  const { token0, token1 } = liqControl.getRemoveLiquidityTokens(rmPerc)

  const onChange = (val: number) => {
    val = Math.min(val, maxRemovePerc)
    val = Math.max(val, 0)
    setRemovePerc(val)
  }

  // 处理移除流动性
  const handleRemoveLiquidity = async () => {
    if (!rmPerc) {
      message.error('请输入要移除的流动性数量')
      return
    }

    const amount = liqControl.getLPByPerc(rmPerc)
    if (amount <= 0n) {
      message.error('移除的流动性数量必须大于0')
      return
    }

    if (amount > userLP) {
      message.error('移除的流动性数量不能超过当前持有量')
      return
    }

    setLoading(true)
    try {
      await services.removeLiquidity(amount)
      message.success('移除流动性成功')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('移除流动性失败:', error)
      message.error('移除流动性失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="移除流动性" open={isOpen} onOk={handleRemoveLiquidity} onCancel={onClose} confirmLoading={loading}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>我的流动性:</span>
            <span>{userPerc}%</span>
          </div>
          <div className="mb-4">
            <InputNumber value={rmPerc} onChange={onChange} placeholder="请输入要移除的流动性数量（最多两位小数）" />
          </div>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p>您将收到:</p>
          <p>
            {TK_ERC20}: {token0}
          </p>
          <p>
            {TK_USDC}: {token1}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export interface RemoveLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}
