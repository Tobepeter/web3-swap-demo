import { MessageInstance } from 'antd/es/message/interface'
import React from 'react'
import { sleep, nextFrame } from './common'
import { HookAPI as ModalHookAPI } from 'antd/es/modal/useModal'
import { TK_ERC20, TK_USDC, tokenConfig } from '@/config/token'
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
  injectUnplugin() {
    this.injectWin()
    this.injectReactHooks()
    this.injectUtils()
    this.injectTokens()
  }

  injectWin() {
    const win = window as any
    ;(window as any).win = win
  }

  injectReactHooks() {
    win.useEffect = React.useEffect
    win.useState = React.useState
    win.useRef = React.useRef
    win.useCallback = React.useCallback
    win.useMemo = React.useMemo
  }

  injectUtils() {
    win.sleep = sleep
    win.nextFrame = nextFrame
  }

  injectTokens() {
    win.TK_ERC20 = TK_ERC20
    win.TK_USDC = TK_USDC
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
  const TK_ERC20: typeof import('../config/token').TK_ERC20
  const TK_USDC: typeof import('../config/token').TK_USDC
  type TokenType = import('../config/token').TokenType
  type TokenConfig = import('../config/token').TokenConfig
  const tokenConfig: typeof import('../config/token').tokenConfig
}
