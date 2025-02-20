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
  const { message } = AntdApp.useApp()

  globalUtil.injectAntd(message)

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
