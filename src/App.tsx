import { HistoryPage } from '@/pages/history'
import { HomePage } from '@/pages/home'
import { LiquidityPage } from '@/pages/liquidity'
import { TradingPage } from '@/pages/trading'
import { store } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Address } from 'viem'
import { services } from './services/services'
import { wallet } from './utils/wallet'

const App: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // 监听账户变化
    const handleAccountsChanged = (accounts: string[]) => {
      store.setState({ address: accounts[0] as Address })
    }

    wallet.on('accountsChanged', handleAccountsChanged)

    return () => {
      wallet.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const connectWallet = async () => {
    let address: Address
    try {
      setIsConnecting(true)
      address = await wallet.connectWallet()
      store.setState({ address: address as Address })
      console.log('连接钱包成功:', address)
    } catch (error) {
      console.error('连接钱包失败:', error)
    } finally {
      setIsConnecting(false)
    }

    // 如果连接成功，则获取余额
    if (address) {
      await services.getMockERC20Balance()
      await services.getMockUSDCBalance()
    }
  }

  let connectBtnText = '未连接'
  if (isConnecting) {
    connectBtnText = '连接中...'
  } else if (store.getState().isConnected) {
    connectBtnText = '已连接'
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* 导航栏 */}
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                  首页
                </Link>
                <Link to="/trading" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                  交易
                </Link>
                <Link to="/liquidity" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                  流动性
                </Link>
                <Link to="/history" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                  历史记录
                </Link>
              </div>

              {/* 钱包连接按钮 */}
              <div className="flex items-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400" onClick={connectWallet} disabled={isConnecting}>
                  {connectBtnText}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* 路由内容 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trading" element={<TradingPage />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
