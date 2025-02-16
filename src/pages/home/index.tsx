import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">首页</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">钱包信息</h2>
          {/* 钱包地址显示区域 */}
          <div className="p-4 bg-gray-100 rounded">
            <p>钱包地址: 未连接</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">代币余额</h2>
          {/* 代币余额显示区域 */}
          <div className="space-y-2">
            <div className="p-4 bg-gray-100 rounded">
              <p>MockERC20: 0</p>
            </div>
            <div className="p-4 bg-gray-100 rounded">
              <p>MOCK_USDC: 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 