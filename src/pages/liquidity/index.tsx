import React from 'react'

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
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">流动性管理</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* 添加流动性表单 */}
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-4">添加流动性</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">MockERC20 数量</label>
              <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="0.0" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">MOCK_USDC 数量</label>
              <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="0.0" />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">添加流动性</button>
          </div>

          {/* 移除流动性表单 */}
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-4">移除流动性</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">LP代币数量</label>
              <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="0.0" />
            </div>

            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">移除流动性</button>
          </div>
        </div>
      </div>
    </div>
  )
}
