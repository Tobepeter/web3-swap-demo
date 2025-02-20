import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { globalUtil } from './utils/global-util.ts'

globalUtil.init()

const StrictApp = () => {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}

// NOTE: strictMode 所有 useEffect 执行两次，交互不太好
// createRoot(document.getElementById('root')).render(<StrictApp />)

createRoot(document.getElementById('root')).render(<App />)
