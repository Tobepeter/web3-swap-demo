import { services } from '@/services/services'
import { store } from '@/store/store'
import { tokenUtil } from '@/utils/TokenUtil'
import { Button, Card, Form, Input, Select, Typography } from 'antd'
import React, { useState } from 'react'

export const Swap = () => {
  // TODO: 感觉变量还是不能放全局，需要导入
  const TOKEN_OPTIONS = [
    { value: TK_ERC20, label: 'MockERC20' },
    { value: TK_USDC, label: 'MOCK_USDC' },
  ]
  const mockERC20TK = store(state => state.mockERC20TK)
  const mockUSDCTK = store(state => state.mockUSDCTK)

  const [payOpt, setPayOpt] = useState(TOKEN_OPTIONS[0].value)
  const [receiveOpt, setReceiOpt] = useState(TOKEN_OPTIONS[1].value)
  const [payAmount, setPayAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [isExchanging, setIsExchanging] = useState(false)

  const maxToken = payOpt === TOKEN_OPTIONS[0].value ? TK_ERC20 : TK_USDC
  const currentTK = payOpt === TOKEN_OPTIONS[0].value ? mockERC20TK : mockUSDCTK
  const targetTKBalance = receiveOpt === TOKEN_OPTIONS[0].value ? mockERC20TK : mockUSDCTK
  let updateReceiveAmountTimer = useRef(-1)

  const updateReceiveAmount = async () => {
    setIsCalculating(true)
    const payToken = payOpt as TokenType
    const receiveToken = receiveOpt as TokenType
    const amountIn = tokenUtil.tk2unit(payToken, payAmount)
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

  /** 支付代币类型变化 */
  const onPayOptChange = async (value: string) => {
    setPayOpt(value)
    setReceiOpt(TOKEN_OPTIONS.find(token => token.value !== value)?.value || '')

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
    setReceiOpt(value)
    setPayOpt(TOKEN_OPTIONS.find(token => token.value !== value)?.value || '')
  }

  /** 交换 */
  const onExchange = async () => {
    setIsExchanging(true)
    const payToken = payOpt as TokenType
    const receiveToken = receiveOpt as TokenType
    const amountIn = tokenUtil.tk2unit(payToken, payAmount)
    const amountOut = await services.getAmountOut(amountIn, payToken)

    console.log(`swap 支付 ${payAmount} ${payToken}，期望得到 ${receiveAmount} ${receiveToken}`)

    // TODO: 目前交换后貌似不对
    // console.log(`swap 预期余额 ${payAmount} ${payToken}，期望得到 ${receiveAmount} ${receiveToken}`)
    await services.swap(amountIn, amountOut, payToken)
    setIsExchanging(false)
  }

  /** 是否可以交换 */
  const exchangeEnable = payAmount && Number(payAmount) > 0 && Number(payAmount) <= Number(currentTK)

  const isLoading = isCalculating || isExchanging

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">代币交易</h1>
      <Card>
        <Form layout="vertical">
          <Form.Item
            label={
              <div className="flex gap-2 justify-between w-full items-end">
                <Typography.Title level={4} style={{ margin: 0 }}>
                  支付
                </Typography.Title>
                <Typography.Text type="secondary">余额: {currentTK} </Typography.Text>
              </div>
            }
            className="mb-4"
          >
            <Input type="number" placeholder="0" className="mb-2" value={payAmount} onChange={onPayAmountChange} max={maxToken} disabled={isExchanging} />
            <Select className="w-full" value={payOpt} onChange={onPayOptChange}>
              {TOKEN_OPTIONS.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <div className="flex gap-2 justify-between w-full items-end">
                <Typography.Title level={4} style={{ margin: 0 }}>
                  接收
                </Typography.Title>
                <Typography.Text type="secondary">当前余额: {targetTKBalance} </Typography.Text>
              </div>
            }
            className="mb-4"
          >
            <Input type="number" placeholder="0.0" readOnly className="mb-2" value={receiveAmount} />
            <Select className="w-full" value={receiveOpt} onChange={onReceiveOptChange}>
              {TOKEN_OPTIONS.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" block size="large" disabled={!exchangeEnable} loading={isLoading} onClick={onExchange}>
            交换
          </Button>
        </Form>
      </Card>
    </div>
  )
}
