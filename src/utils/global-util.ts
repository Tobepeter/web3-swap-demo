import { MessageInstance } from 'antd/es/message/interface'
import React from 'react'
import { sleep, nextFrame } from './common'

class GlobalUtil {
  init() {
    this.injectUnplugin()
    this.injectReact()
  }

  private injectReact() {
    win.React = React
  }

  /**
   * 注入 antd 常用方法
   */
  injectAntd(message: MessageInstance) {
    win.message = message
  }

  /**
   * 减少一些高频代码的导入
   *
   * @desc 从模拟 vue elementUI 的 unplugin，虽然是挂window上的
   * @TODO 有空记得删掉一些react的导入，精简下代码
   */
  private injectUnplugin() {
    const win = window as any
    ;(window as any).win = win

    // -- react --
    win.useEffect = React.useEffect
    win.useState = React.useState
    win.useRef = React.useRef
    win.useCallback = React.useCallback
    win.useMemo = React.useMemo
    win.useContext = React.useContext

    // -- utils --
    win.sleep = sleep
    win.nextFrame = nextFrame
  }
}

export const globalUtil = new GlobalUtil()

declare global {
  const win: any

  // -- react --
  const useEffect: typeof React.useEffect
  const useState: typeof React.useState
  const useRef: typeof React.useRef
  const useCallback: typeof React.useCallback
  const useMemo: typeof React.useMemo
  const useContext: typeof React.useContext

  // -- utils --
  const sleep: typeof import('./common').sleep
  const nextFrame: typeof import('./common').nextFrame

  // -- antd --
  const message: MessageInstance
}
