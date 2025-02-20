import { HistoryPage } from '@/pages/history'
import { HomePage } from '@/pages/home'
import { LiquidityPage } from '@/pages/liquidity'
import { TradingPage } from '@/pages/trading'
import { App as AntdApp } from 'antd'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AntdWrapper } from './components/AntdWrapper'
import { NavBar } from './components/NavBar'
import { globalUtil } from './utils/global-util'

const App = () => {
  // TODO: Warning: [antd: compatible] antd v5 support React is 16 ~ 18. see https://u.ant.design/v5-for-19 for compatible.
  //  react 19 兼容性不好，很多库都不支持，这里是 antd，还有 ahooks
  const { message, modal } = AntdApp.useApp()
  globalUtil.injectAntd(message, modal)

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
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

const WrapApp = () => {
  return (
    <AntdWrapper>
      <App />
    </AntdWrapper>
  )
}

// export default App
export default WrapApp
