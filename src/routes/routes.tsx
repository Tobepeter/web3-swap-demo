import { Layout } from '@/components/Layout'
import { Home } from '@/pages/home/Home'
import { Liquidity } from '@/pages/liquidity/Liquidity'
import { Swap } from '@/pages/swap/Swap'
import { History } from '@/pages/history/History'
import { createBrowserRouter } from 'react-router-dom'

type RouteConfig = {
  name?: string
  icon?: string
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
      },
      {
        path: RoutePath.Swap,
        element: <Swap />,
        name: '兑换',
      },
      {
        path: RoutePath.Liquidity,
        element: <Liquidity />,
        name: '流动性',
      },
      {
        path: RoutePath.History,
        element: <History />,
        name: '历史',
      },
    ],
  },
]

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_BASE_URL || '/',
})
