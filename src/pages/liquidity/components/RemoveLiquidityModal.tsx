import { TokenTag } from '@/components/TokenTag'
import { services } from '@/services/services'
import { store } from '@/store/store'
import { liqControl } from '@/utils/LiqControl'
import { InputNumber, message, Modal, Typography } from 'antd'
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
      onSuccess?.()

      // TODO: 关闭后，应该要清掉弹窗状态的，但是很多地方都没处理
      onClose?.()
    } catch (error) {
      console.error('移除流动性失败:', error)
      message.error('移除流动性失败')
    } finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    // 处理中，不让关闭
    if (loading) return
    onClose?.()
  }

  return (
    <Modal title="移除流动性" open={isOpen} onOk={handleRemoveLiquidity} onCancel={onCancel} confirmLoading={loading}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-start gap-4 mt-2">
            <span>当前流动性:</span>
            <span>{userPerc}%</span>
          </div>
          <div className="mt-2">
            <InputNumber value={rmPerc} style={{ width: '100%' }} onChange={onChange} placeholder="请输入要移除的流动性数量（最多两位小数）" />
          </div>
        </div>

        <div>
          <p>您将收到:</p>
          <div className="bg-gray-100 p-2 rounded mt-2 flex flex-col gap-2">
            <div className="flex justify-start gap-4 items-center">
              <div className="w-1/2">
                <InputNumber style={{ width: '100%' }} value={token0} readOnly />
              </div>
              <TokenTag token={TK_ERC20} />
            </div>
            <div className="flex justify-start gap-4 items-center">
              <div className="w-1/2">
                <InputNumber style={{ width: '100%' }} value={token1} readOnly />
              </div>
              <TokenTag token={TK_USDC} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export interface RemoveLiquidityModalProps {
  isOpen: boolean
  onClose?: () => void
  onSuccess?: () => void
}
