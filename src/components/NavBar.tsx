import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useStore } from '@/store/store'
import { wallet } from '@/utils/wallet'
import { services } from '@/services/services'

export const NavBar = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const isConnected = useStore(state => state.isConnected)

  useEffect(() => {
    services.initClient()
  }, [])

  const connectWallet = async () => {
    if (!wallet.isValid) {
      const valid = services.initClient()
      if (!valid) return
    }

    try {
      setIsConnecting(true)
      const address = await wallet.connectWallet()
      useStore.setState({ address: address as Address })
      console.log('连接钱包成功:', address)
    } catch (error) {
      console.error('连接钱包失败:', error)
      message.error('连接钱包失败')
    } finally {
      setIsConnecting(false)
    }
  }

  let connectText = '未连接'
  if (isConnecting) {
    connectText = '连接中...'
  } else if (isConnected) {
    connectText = '已连接'
  }

  return (
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
              {connectText}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
