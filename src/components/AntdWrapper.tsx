import { App, ConfigProvider, theme } from 'antd'
import { PropsWithChildren } from 'react'

export const AntdWrapper = (props: PropsWithChildren<any>) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#a78bfa', // violet-400
          colorInfo: '#06b6d4', // cyan-500
          borderRadius: 8,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <App>{props.children}</App>
    </ConfigProvider>
  )
}
