import { services } from '@/services/services'
import { store } from '@/store/store'
import { isEmptyAddress } from '@/utils/common'
import { liquidity } from '@/utils/liquidity'
import { tokenUtil } from '@/utils/token-util'
import { Button, Input, Modal, message } from 'antd'
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
  const mockERC20TK = store(state => state.mockERC20TK)
  const mockUSDCTK = store(state => state.mockUSDCTK)

  const userLiquidity = store(state => state.userLiq)
  const totalLiquidity = store(state => state.totalLiq)
  const reserve0 = store(state => state.reserve0)
  const reserve1 = store(state => state.reserve1)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  const [removeLPAmount, setRemoveLPAmount] = useState<bigint>(0n)
  const [loading, setLoading] = useState(false)
  const fee = 0.3 * 0.01 // 0.3%

  // 查询流动性信息
  const fetchLiquidityInfo = async () => {
    if (isEmptyAddress(address)) return
    await services.fetchLiquidity()
  }

  useEffect(() => {
    fetchLiquidityInfo()
  }, [address])

  // 处理添加流动性
  const handleAddLiquidity = async () => {
    if (!amount0 || !amount1) {
      message.error('请输入添加的代币数量')
      return
    }

    setLoading(true)
    try {
      const amount0Wei = tokenUtil.tk2unit(mockERC20, amount0)
      const amount1Wei = tokenUtil.tk2unit(mockUSDC, amount1)
      await liquidity.addLiquidity(amount0Wei, amount1Wei)
      message.success('添加流动性成功')
      setIsAddModalOpen(false)
      fetchLiquidityInfo()
    } catch (error) {
      console.error('添加流动性失败:', error)
      message.error('添加流动性失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理移除流动性
  const handleRemoveLiquidity = async () => {
    if (removeLPAmount <= 0n) {
      message.error('请输入要移除的流动性数量')
      return
    }

    setLoading(true)
    try {
      await liquidity.removeLiquidity(removeLPAmount)
      message.success('移除流动性成功')
      setIsRemoveModalOpen(false)
      fetchLiquidityInfo()
    } catch (error) {
      console.error('移除流动性失败:', error)
      message.error('移除流动性失败')
    } finally {
      setLoading(false)
    }
  }

  // 计算对应的代币数量
  const calculateTokenAmount = (inputAmount: string, isToken0: boolean) => {
    if (!inputAmount || !reserve0 || !reserve1) return

    // 将输入金额转换为 bigint
    const input = tokenUtil.tk2unit(isToken0 ? mockERC20 : mockUSDC, inputAmount)

    if (isToken0) {
      // amount1 = input * reserve1 / reserve0
      const amount1Wei = (input * reserve1) / reserve0
      setAmount1(tokenUtil.unit2tk(mockUSDC, amount1Wei))
    } else {
      // amount0 = input * reserve0 / reserve1
      const amount0Wei = (input * reserve0) / reserve1
      setAmount0(tokenUtil.unit2tk(mockERC20, amount0Wei))
    }
  }
  // 计算移除流动性时可获得的代币数量
  const calculateRemoveAmounts = (lpAmount: bigint) => {
    if (lpAmount <= 0n || !totalLiquidity) return { amount0: '0', amount1: '0' }

    // amount0 = lp * reserve0 / totalLiquidity
    const amount0Wei = (lpAmount * reserve0) / totalLiquidity
    // amount1 = lp * reserve1 / totalLiquidity
    const amount1Wei = (lpAmount * reserve1) / totalLiquidity

    console.log('amount0Wei', amount0Wei, reserve0, totalLiquidity)
    console.log('amount1Wei', amount1Wei, reserve1, totalLiquidity)

    return {
      amount0: tokenUtil.unit2tk(mockERC20, amount0Wei),
      amount1: tokenUtil.unit2tk(mockUSDC, amount1Wei),
    }
  }

  const removeAmounts = calculateRemoveAmounts(removeLPAmount)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">流动性管理</h1>

      {/* 流动性信息展示 */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">流动性信息</h2>
        <div className="space-y-2">
          <div className="p-4 bg-gray-100 rounded">
            <p>您的流动性: {userLiquidity} LP</p>
          </div>
          <div className="p-4 bg-gray-100 rounded">
            <p>总流动性: {totalLiquidity} LP</p>
          </div>
          <div className="p-4 bg-gray-100 rounded">
            <p>储备量:</p>
            <p>MockERC20: {tokenUtil.unit2tk(mockERC20, reserve0)}</p>
            <p>MOCK_USDC: {tokenUtil.unit2tk(mockUSDC, reserve1)}</p>
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
      <Modal title="添加流动性" open={isAddModalOpen} onOk={handleAddLiquidity} onCancel={() => setIsAddModalOpen(false)} confirmLoading={loading}>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>MockERC20 数量</span>
              <span>余额: {mockERC20TK}</span>
            </div>
            <Input
              value={amount0}
              onChange={e => {
                setAmount0(e.target.value)
                calculateTokenAmount(e.target.value, true)
              }}
              placeholder="0.0"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>MOCK_USDC 数量</span>
              <span>余额: {mockUSDCTK}</span>
            </div>
            <Input
              value={amount1}
              onChange={e => {
                setAmount1(e.target.value)
                calculateTokenAmount(e.target.value, false)
              }}
              placeholder="0.0"
            />
          </div>
        </div>
      </Modal>

      {/* 移除流动性弹窗 */}
      <Modal title="移除流动性" open={isRemoveModalOpen} onOk={handleRemoveLiquidity} onCancel={() => setIsRemoveModalOpen(false)} confirmLoading={loading}>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>LP代币数量</span>
              <span>余额: {userLiquidity}</span>
            </div>
            <Input
              value={removeLPAmount.toString()}
              onChange={e => {
                try {
                  setRemoveLPAmount(BigInt(e.target.value || '0'))
                } catch {
                  setRemoveLPAmount(0n)
                }
              }}
              placeholder="0"
            />
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <p>您将收到:</p>
            <p>MockERC20: {removeAmounts.amount0}</p>
            <p>MOCK_USDC: {removeAmounts.amount1}</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
