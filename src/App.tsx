import { HistoryPage } from '@/pages/history'
import { HomePage } from '@/pages/home'
import { LiquidityPage } from '@/pages/liquidity'
import { TradingPage } from '@/pages/trading'
import React, { useEffect, useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { walletUtils } from './utils/wallet'

const App: React.FC = () => {
  const [account, setAccount] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // 监听账户变化
    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts[0])
    }

    walletUtils.on('accountsChanged', handleAccountsChanged)

    return () => {
      walletUtils.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      const address = await walletUtils.connectWallet()
      setAccount(address)
      console.log('连接钱包成功:', address)
    } catch (error) {
      console.error('连接钱包失败:', error)
      alert('连接钱包失败，请重试')
    } finally {
      setIsConnecting(false)
    }
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
                  {isConnecting ? '连接中...' : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '连接钱包'}
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
