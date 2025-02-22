import { TokenTag } from '@/components/TokenTag'
import { services } from '@/services/services'
import { store } from '@/store/store'
import { tokenUtil } from '@/utils/TokenUtil'
import { SwapOutlined } from '@ant-design/icons'
import { Button, Card, Input, Select, Space, Typography } from 'antd'
import React, { useState } from 'react'

export const Swap = () => {
  // TODO: 感觉变量还是不能放全局，需要导入
  const TOKEN_OPTIONS = [
    { value: TK_ERC20, label: 'MockERC20' },
    { value: TK_USDC, label: 'MOCK_USDC' },
  ] as { value: TokenType; label: string }[]
  const mockERC20TK = store(state => state.mockERC20TK)
  const mockUSDCTK = store(state => state.mockUSDCTK)

  const [payOpt, setPayOpt] = useState<TokenType>(TOKEN_OPTIONS[0].value)
  const [receiveOpt, setReceiOpt] = useState<TokenType>(TOKEN_OPTIONS[1].value)
  const [payAmount, setPayAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [isExchanging, setIsExchanging] = useState(false)

  const maxToken = payOpt === TOKEN_OPTIONS[0].value ? TK_ERC20 : TK_USDC
  const currentTK = payOpt === TOKEN_OPTIONS[0].value ? mockERC20TK : mockUSDCTK
  const targetTKBalance = receiveOpt === TOKEN_OPTIONS[0].value ? mockERC20TK : mockUSDCTK
  const updateReceiveAmountTimer = useRef(-1)

  const updateReceiveAmount = async () => {
    setIsCalculating(true)
    const payToken = payOpt as TokenType
    const receiveToken = receiveOpt as TokenType
    const amountIn = tokenUtil.tk2unit(payToken, payAmount)
    // TODO: 是否使用本地计算模式？
    const amountOut = await services.getAmountOut(amountIn, payToken)

    // 如果有定时器，则不更新
    if (updateReceiveAmountTimer.current === -1) {
      setReceiveAmount(tokenUtil.unit2tk(receiveToken, amountOut))
      setIsCalculating(false)
    }
  }

  /** 停止更新接收金额 */
  const stopUpdateReceiveAmount = () => {
    if (updateReceiveAmountTimer.current !== -1) {
      clearTimeout(updateReceiveAmountTimer.current)
      updateReceiveAmountTimer.current = -1
    }
  }

  /** 延迟更新接收金额 */
  const delayUpdateReceiveAmount = () => {
    // 提前设置好，防止提交上去了
    setIsCalculating(true)
    stopUpdateReceiveAmount()
    updateReceiveAmountTimer.current = setTimeout(() => {
      updateReceiveAmountTimer.current = -1
      updateReceiveAmount()
    }, 200) as any
  }

  const getOtherToken = (value: TokenType) => {
    const val = TOKEN_OPTIONS.find(token => token.value !== value)?.value || ''
    return val as TokenType
  }

  /** 支付代币类型变化 */
  const onPayOptChange = async (value: string) => {
    setPayOpt(value as TokenType)
    const targetToken = getOtherToken(value as TokenType)
    setReceiOpt(targetToken)

    // 清空输入框
    setPayAmount('')
    setReceiveAmount('')
  }

  /** 支付金额变化 */
  const onPayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TOOD: 处理非数字类型
    setPayAmount(e.target.value)
    delayUpdateReceiveAmount()
  }

  /** 接收代币类型变化 */
  const onReceiveOptChange = (value: string) => {
    setReceiOpt(value as TokenType)
    const targetToken = getOtherToken(value as TokenType)
    setPayOpt(targetToken)
  }

  /** 交换 */
  const onExchange = async () => {
    // TODO: 异步问题可能要考虑好路由卸载

    setIsExchanging(true)
    const payToken = payOpt as TokenType
    const receiveToken = receiveOpt as TokenType
    const amountIn = tokenUtil.tk2unit(payToken, payAmount)

    try {
      const amountOut = await services.getAmountOut(amountIn, payToken)
      console.log(`swap 支付 ${payAmount} ${payToken} => ${receiveAmount} ${receiveToken}`)

      // 计算预期结果
      const state = store.getState()
      const balanceIn = payToken === TK_ERC20 ? state.mockERC20 : state.mockUSDC
      const balanceOut = receiveToken === TK_ERC20 ? state.mockERC20 : state.mockUSDC
      const expectIn = tokenUtil.unit2tk(payToken, balanceIn - amountIn)
      const expectOut = tokenUtil.unit2tk(receiveToken, balanceOut + amountOut)
      console.log(`swap 预期余额 ${expectIn} ${payToken}, ${expectOut} ${receiveToken}`)

      await services.swap(amountIn, amountOut, payToken)
    } catch (error) {
      message.error('交换失败')
    }
    setIsExchanging(false)

    // 清空表单
    setPayAmount('')
    setReceiveAmount('')
  }

  const payAmountNum = Number(payAmount)
  const receiveAmountNum = Number(receiveAmount)

  /**
   * 是否可以交换
   * 1. 支付金额大于0
   * 2. 支付金额小于等于当前余额
   * 3. 接收金额大于0（货币如果高精度传递小量，兑换的另一方会计算出0） TODO：不知道是bug么，有空看看
   */
  const exchangeEnable = payAmountNum > 0 && payAmountNum <= Number(currentTK) && receiveAmountNum > 0

  const isLoading = isCalculating || isExchanging

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">代币交易</h1>
      <Card>
        <div className="space-y-4">
          {/* TODO: 代码重复度有点高 */}
          <Space className="w-full" size={8} direction="vertical">
            <div className="flex gap-2 justify-start w-full items-end">
              <Typography.Title level={4} style={{ margin: 0 }}>
                支付
              </Typography.Title>
              <Typography.Text type="secondary">余额: {currentTK} </Typography.Text>
            </div>
            <Input type="number" placeholder="0" className="mb-2" value={payAmount} onChange={onPayAmountChange} max={maxToken} disabled={isExchanging} />
            <div className="flex gap-2 justify-start w-full items-center">
              <Select className="min-w-1/2" value={payOpt} onChange={onPayOptChange} disabled={isExchanging} options={TOKEN_OPTIONS} />
              <TokenTag token={payOpt} />
            </div>
          </Space>

          <Space className="w-full" size={8} direction="vertical">
            <div className="flex gap-2 justify-start w-full items-end">
              <Typography.Title level={4} style={{ margin: 0 }}>
                接收
              </Typography.Title>
              <Typography.Text type="secondary">当前余额: {targetTKBalance} </Typography.Text>
            </div>
            <Input type="number" placeholder="0.0" readOnly className="mb-2" value={receiveAmount} />
            <div className="flex gap-2 justify-start w-full items-center">
              <Select className="min-w-1/2" value={receiveOpt} onChange={onReceiveOptChange} disabled={isExchanging} options={TOKEN_OPTIONS} />
              <TokenTag token={receiveOpt} />
            </div>
          </Space>

          <Button type="primary" block icon={<SwapOutlined />} size="large" disabled={!exchangeEnable} loading={isLoading} onClick={onExchange}>
            交换
          </Button>
        </div>
      </Card>
    </div>
  )
}
