import { MessageInstance } from 'antd/es/message/interface'
import React from 'react'
import { sleep, nextFrame } from './common'
import { HookAPI as ModalHookAPI } from 'antd/es/modal/useModal'
import { mockERC20, mockUSDC, tokenConfig } from '@/config/token'
import { store } from '@/store/store'
import { wallet } from './wallet'

class GlobalUtil {
  init() {
    this.injectUnplugin()
    this.injectDevConsole()
  }

  private injectDevConsole() {
    win.React = React
    win.store = store
    win.wallet = wallet
  }

  /**
   * 注入 antd 常用方法
   */
  injectAntd(message: MessageInstance, modal: ModalHookAPI) {
    win.message = message
    win.modal = modal
  }

  /**
   * 减少一些高频代码的导入
   *
   * @desc 从模拟 vue elementUI 的 unplugin，虽然是挂window上的
   * @TODO 有空记得删掉一些react的导入，精简下代码
   */
  private injectUnplugin() {
    const win = window as any

    // -- win --
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

    // -- token --
    win.mockERC20 = mockERC20
    win.mockUSDC = mockUSDC
    win.tokenConfig = tokenConfig
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
  const modal: ModalHookAPI

  // -- token --
  const mockERC20: typeof import('../config/token').mockERC20
  const mockUSDC: typeof import('../config/token').mockUSDC
  type TokenType = import('../config/token').TokenType
  type TokenConfig = import('../config/token').TokenConfig
  const tokenConfig: typeof import('../config/token').tokenConfig
}
