import { App, ConfigProvider, theme } from 'antd'
import { PropsWithChildren } from 'react'

export const AntdWrapper = (props: PropsWithChildren<any>) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C27AFF',
          colorWarning: '#ED6AFF',
          colorInfo: '#AD46FF', // cyan-500
          colorSuccess: '#C27AFF',
          // colorInfoHover: '#a78bfa',
          borderRadius: 8,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <App>{props.children}</App>
    </ConfigProvider>
  )
}
