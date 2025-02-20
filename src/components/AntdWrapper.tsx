import { App, ConfigProvider } from 'antd'
import { PropsWithChildren } from 'react'

export const AntdWrapper = (props: PropsWithChildren<any>) => {
  return (
    <ConfigProvider>
      <App>{props.children}</App>
    </ConfigProvider>
  )
}
