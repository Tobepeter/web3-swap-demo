import { TestWagmiERC20 } from './TestWagmiERC20'
import { TestWagmiUSDC } from './TestWagmiUSDC'

export const TestWagmi = () => {
  return (
    <div className="mt-10">
      <TestWagmiERC20 />
      <TestWagmiUSDC />
    </div>
  )
}
