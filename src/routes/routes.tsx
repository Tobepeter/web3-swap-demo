import { Layout } from '@/components/Layout'
import { Home } from '@/pages/home/Home'
import { Liquidity } from '@/pages/liquidity/Liquidity'
import { Swap } from '@/pages/swap/Swap'
import { History } from '@/pages/history/History'
import { createBrowserRouter } from 'react-router-dom'
import { HomeOutlined, SwapOutlined, BankOutlined, HistoryOutlined } from '@ant-design/icons'

type RouteConfig = {
  name?: string
  icon?: string | React.ReactNode
  path?: string
  element?: React.ReactNode
  children?: RouteConfig[]
}

export enum RoutePath {
  Home = '/',
  Swap = '/swap',
  Liquidity = '/liquidity',
  History = '/history',
}

export const routes: RouteConfig[] = [
  {
    element: <Layout />,
    children: [
      {
        path: RoutePath.Home,
        element: <Home />,
        name: '首页',
        icon: <HomeOutlined />,
      },
      {
        path: RoutePath.Swap,
        element: <Swap />,
        name: '兑换',
        icon: <SwapOutlined />,
      },
      {
        path: RoutePath.Liquidity,
        element: <Liquidity />,
        name: '流动性',
        icon: <BankOutlined />,
      },
      {
        path: RoutePath.History,
        element: <History />,
        name: '历史',
        icon: <HistoryOutlined />,
      },
    ],
  },
]

const baseUrl = import.meta.env.VITE_BASE_URL || '/'
export const router = createBrowserRouter(routes, {
  basename: baseUrl,
})
