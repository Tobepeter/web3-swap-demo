import { routes } from '@/routes/routes'
import { services } from '@/services/services'
import { store } from '@/store/store'
import { walletControl } from '@/utils/WalletControl'
import { Button } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const isConnected = store(state => state.isConnected)

  // TODO: 增加自动连接功能
  const connectWallet = async () => {
    if (isConnected) {
      message.info('已连接')
      return
    }

    if (!walletControl.isMetaMaskValid()) {
      // message.error('请安装 MetaMask!')
      modal.info({
        title: '请安装 MetaMask!',
        content: 'MetaMask 是一个以太坊钱包，用于连接到以太坊区块链。',
        onOk: () => {
          window.open(walletControl.metaMaskInstallUrl, '_blank')
        },
        okText: '安装 MetaMask',
        cancelText: '稍后安装',
      })
      return
    }

    setIsConnecting(true)
    await services.connectWallet().finally(() => {
      setIsConnecting(false)
    })
  }

  const autoDetectWallet = async () => {
    if (isConnected) return
    setIsConnecting(true)
    await services.autoDetectWallet().catch(() => {
      // nothinig
    })
    setIsConnecting(false)
  }

  useEffect(() => {
    autoDetectWallet()
  }, [])

  let connectText = '连接钱包'
  if (isConnecting) {
    connectText = '钱包连接中...'
  } else if (isConnected) {
    connectText = '钱包已连接'
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {routes[0].children.map(route => {
              return (
                <Link to={route.path} key={route.path} className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                  <span className="mr-1">{route.icon}</span>
                  {route.name}
                </Link>
              )
            })}
          </div>

          {/* 钱包连接按钮 */}
          <div className="flex items-center">
            <Button type="primary" onClick={connectWallet} loading={isConnecting}>
              {connectText}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
