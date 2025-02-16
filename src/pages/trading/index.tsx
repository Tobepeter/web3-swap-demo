import React from 'react';

const TradingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">代币交易</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* 代币兑换表单 */}
          <div className="p-4 bg-gray-100 rounded">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">支付</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="0.0"
              />
              <select className="mt-2 block w-full rounded-md border-gray-300 shadow-sm">
                <option>MockERC20</option>
                <option>MOCK_USDC</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">接收</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="0.0"
                readOnly
              />
              <select className="mt-2 block w-full rounded-md border-gray-300 shadow-sm">
                <option>MOCK_USDC</option>
                <option>MockERC20</option>
              </select>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              交换
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage; 