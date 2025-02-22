import { TokenTag } from '@/components/TokenTag'
import { AddLiquidityModal } from '@/pages/liquidity/components/AddLiquidityModal'
import { RemoveLiquidityModal } from '@/pages/liquidity/components/RemoveLiquidityModal'
import { services } from '@/services/services'
import { store } from '@/store/store'
import { liqControl } from '@/utils/LiqControl'
import { tokenUtil } from '@/utils/TokenUtil'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useState } from 'react'

/**
 * 流动性管理
 *
 * 1. 查询用户流动性额度
 * 2. 查询总流动性，代币总量（以及常量积），比例关系
 * 3. 展示暂时写死一个手续费
 * 4. 添加流动性，弹窗形式，只能输入整数，两边输入联动响应（但是都不能超过余额）
 * 5. 移除流动性，弹窗形式，输入流动性，自动计算出代币数量
 */
export const Liquidity = () => {
  const address = store(state => state.address)
  const isConnected = store(state => state.isConnected)
  const reserve0 = store(state => state.reserve0)
  const reserve1 = store(state => state.reserve1)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // 查询流动性信息
  const fetchLiquidityInfo = async () => {
    if (!isConnected) return
    setLoading(true)
    await services.fetchLiquidity()
    setLoading(false)
  }

  useEffect(() => {
    fetchLiquidityInfo()
  }, [address])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">流动性管理</h1>

      {/* 流动性信息展示 */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">信息</h2>
        <div className="space-y-2">
          <div className="p-4 bg-gray-100 rounded">
            <p>我的流动性: {liqControl.getUserLpPercent()}%</p>
          </div>
          <div className="p-4 bg-gray-100 rounded">
            <p className="bold">总储备量:</p>
            <div className="flex gap-2 mt-2 ">
              <span className="min-w-20">{tokenUtil.unit2tk(TK_ERC20, reserve0)}</span>
              <TokenTag token={TK_ERC20} />
            </div>
            <div className="flex gap-2 mt-2">
              <span className="min-w-20">{tokenUtil.unit2tk(TK_USDC, reserve1)}</span>
              <TokenTag token={TK_USDC} />
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-x-4">
        <Button type="primary" onClick={() => setIsAddModalOpen(true)} loading={loading} disabled={!isConnected} icon={<PlusOutlined />}>
          添加流动性
        </Button>
        <Button type="primary" onClick={() => setIsRemoveModalOpen(true)} loading={loading} disabled={!isConnected} icon={<MinusOutlined />}>
          移除流动性
        </Button>
      </div>

      {/* 添加流动性弹窗 */}
      <AddLiquidityModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* 移除流动性弹窗 */}
      <RemoveLiquidityModal isOpen={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)} />
    </div>
  )
}
