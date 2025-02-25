import { routes } from '@/routes/routes'
import { services } from '@/services/services'
import { store } from '@/store/store'
import { walletControl } from '@/utils/WalletControl'
import { Button, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const NavBar = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const isConnected = store(state => state.isConnected)
  const location = useLocation()

  // TODO: 增加自动连接功能
  const onClickWalletButton = async () => {
    if (walletControl.wagmi.enable) {
      walletControl.wagmi.open()
      return
    }

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

    if (walletControl.wagmi.enable) {
      connectText = '打开wagmi'
    }
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-14">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            style={{
              height: '100%',
              lineHeight: '3.5rem',
            }}
            items={routes[0].children.map(route => ({
              key: route.path,
              icon: <span className="text-xl mr-1">{route.icon}</span>,
              label: (
                <Link to={route.path} className="!text-base font-medium">
                  {route.name}
                </Link>
              ),
            }))}
          />

          {/* 钱包连接按钮 */}
          <div className="flex items-center">
            <Button type="primary" onClick={onClickWalletButton} loading={isConnecting} size="large" className="text-base font-medium px-6">
              {connectText}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
