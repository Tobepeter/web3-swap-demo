import { Layout } from '@/components/Layout'
import { Home } from '@/pages/home/Home'
import { Liquidity } from '@/pages/liquidity/Liquidity'
import { Swap } from '@/pages/swap/Swap'
import { History } from '@/pages/history/History'
import { NotFound } from '@/pages/404/NotFound'
import { createBrowserRouter } from 'react-router-dom'
import { HomeOutlined, SwapOutlined, BankOutlined, HistoryOutlined, ExperimentOutlined } from '@ant-design/icons'
import { TestPage } from '@/pages/test/TestPage'

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
  Test = '/test',
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
      {
        path: RoutePath.Test,
        element: <TestPage />,
        name: '测试',
        icon: <ExperimentOutlined />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

const baseUrl = import.meta.env.VITE_BASE_URL || '/'
export const router = createBrowserRouter(routes, {
  basename: baseUrl,
})
