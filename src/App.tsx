import { App as AntdApp } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { AntdWrapper } from './components/AntdWrapper'
import { router } from './routes/routes'
import { contract } from './utils/contract'
import { globalUtil } from './utils/global-util'
import { store } from './store/store'
import { isEmptyAddress } from './utils/common'
import { historyServices } from './services/HistoryServices'
import { debugUtil } from './utils/DebugUtil'

const App = () => {
  const { message, modal } = AntdApp.useApp()
  debugUtil.init()
  globalUtil.injectAntd(message, modal)
  contract.init()

  useEffect(() => {
    win.testHistory = () => {
      const address = store.getState().address
      if (isEmptyAddress(address)) return

      historyServices.init()
    }
  }, [])

  return <RouterProvider router={router} />
}

const WrapApp = () => {
  return (
    <AntdWrapper>
      <App />
    </AntdWrapper>
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
