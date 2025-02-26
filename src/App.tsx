import { useWeb3Modal } from '@web3modal/wagmi/react'
import { App as AntdApp } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { AntdWrapper } from './components/AntdWrapper'
import { router } from './routes/routes'
import { contract } from './utils/contract'
import { debugUtil } from './utils/DebugUtil'
import { globalUtil } from './utils/global-util'
import { walletControl } from './utils/WalletControl'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const App = () => {
  const { message, modal } = AntdApp.useApp()
  debugUtil.init()
  globalUtil.injectAntd(message, modal)
  contract.init()

  walletControl.init()
  const { open: openWeb3Modal } = useWeb3Modal()
  walletControl.wagmi.open = openWeb3Modal
  walletControl.wagmi.useAccountListener()

  useEffect(() => {
    // win.test = () => {
    //   openWeb3Modal()
    // }
  }, [])

  return <RouterProvider router={router} />
}

const WrapApp = () => {
  // wagmi需要此对象
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={walletControl.wagmi.config}>
        <AntdWrapper>
          <App />
        </AntdWrapper>
      </WagmiProvider>
    </QueryClientProvider>
  )
}

// export default App
export default WrapApp

// NOTE：如果副作用难以处理，可以放开这段注释
// if (import.meta.hot) {
//   import.meta.hot.accept(() => {
//     window.location.reload()
//   })
// }
