import { AddLiquidityModal } from '@/components/AddLiquidityModal'
import { RemoveLiquidityModal } from '@/components/RemoveLiquidityModal'
import { services } from '@/services/services'
import { store } from '@/store/store'
import { isEmptyAddress } from '@/utils/common'
import { liquidity } from '@/utils/liquidity'
import { tokenUtil } from '@/utils/token-util'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'

/**
 * 流动性管理
 *
 * 1. 查询用户流动性额度
 * 2. 查询总流动性，代币总量（以及常量积），比例关系
 * 3. 展示暂时写死一个手续费
 * 4. 添加流动性，弹窗形式，只能输入整数，两边输入联动响应（但是都不能超过余额）
 * 5. 移除流动性，弹窗形式，输入流动性，自动计算出代币数量
 */
export const LiquidityPage: React.FC = () => {
  const address = store(state => state.address)
  const reserve0 = store(state => state.reserve0)
  const reserve1 = store(state => state.reserve1)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  // 查询流动性信息
  const fetchLiquidityInfo = async () => {
    if (isEmptyAddress(address)) return
    await services.fetchLiquidity()
  }

  useEffect(() => {
    fetchLiquidityInfo()
  }, [address])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">流动性管理</h1>

      {/* 流动性信息展示 */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">流动性信息</h2>
        <div className="space-y-2">
          <div className="p-4 bg-gray-100 rounded">
            <p>我的流动性: {liquidity.getUserLpPercent()}%</p>
          </div>
          <div className="p-4 bg-gray-100 rounded">
            <p>总储备量:</p>
            <p>
              {mockERC20}: {tokenUtil.unit2tk(mockERC20, reserve0)}
            </p>
            <p>
              {mockUSDC}: {tokenUtil.unit2tk(mockUSDC, reserve1)}
            </p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-x-4">
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          添加流动性
        </Button>
        <Button type="primary" danger onClick={() => setIsRemoveModalOpen(true)}>
          移除流动性
        </Button>
      </div>

      {/* 添加流动性弹窗 */}
      <AddLiquidityModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchLiquidityInfo} />

      {/* 移除流动性弹窗 */}
      <RemoveLiquidityModal isOpen={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)} onSuccess={fetchLiquidityInfo} />
    </div>
  )
}
