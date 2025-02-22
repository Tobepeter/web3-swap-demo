export const History = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">交易历史</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* 交易历史列表 */}
        <div className="divide-y divide-gray-200">
          {/* 示例交易记录 */}
          <div className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900">交易</span>
                <p className="text-sm text-gray-500">MockERC20 → MOCK_USDC</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-900">0.1 MockERC20</span>
                <p className="text-sm text-gray-500">100 MOCK_USDC</p>
              </div>
            </div>
            <div className="mt-2">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                查看交易详情
              </a>
            </div>
          </div>

          {/* 示例流动性记录 */}
          <div className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900">添加流动性</span>
                <p className="text-sm text-gray-500">MockERC20/MOCK_USDC</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-900">1.0 MockERC20</span>
                <p className="text-sm text-gray-500">1000 MOCK_USDC</p>
              </div>
            </div>
            <div className="mt-2">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                查看交易详情
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
