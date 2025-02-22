import { describe, it, expect, beforeEach, vi } from 'vitest'
import { liquidity } from '../liquidity'
import { store } from '@/store/store'
import type { StoreState } from '@/store/store'
import type { Address } from 'viem'
import { globalUtil } from '../global-util'

// Mock store
vi.mock('@/store/store', () => ({
  store: {
    getState: vi.fn(),
  },
}))

// TODO: 有空研究下 vscode Vitetest 插件

// 创建 mock state
const createMockState = (overrides: Partial<StoreState> = {}): StoreState =>
  Object.assign(
    {
      address: '0x0' as Address,
      isConnected: false,
      chainId: 1,
      mockERC20: 0n,
      mockERC20TK: '0',
      mockUSDC: 0n,
      mockUSDCTK: '0',
      userLiq: 0n,
      totalLiq: 0n,
      reserve0: 0n,
      reserve1: 0n,
    },
    overrides
  )

describe('Liquidity Calculator', () => {
  beforeEach(() => {
    globalUtil.injectUnplugin()
    vi.clearAllMocks()
  })

  describe('getUserLpPercent', () => {
    describe('当用户没有流动性时', () => {
      it('应该返回 0', () => {
        vi.mocked(store.getState).mockReturnValue(createMockState({ userLiq: 0n, totalLiq: 100n }))
        expect(liquidity.getUserLpPercent()).toBe(0)
      })
    })

    describe('当总流动性为 0 时', () => {
      it('应该返回 0', () => {
        vi.mocked(store.getState).mockReturnValue(createMockState({ totalLiq: 0n, userLiq: 100n }))
        expect(liquidity.getUserLpPercent()).toBe(0)
      })
    })

    describe('当用户有流动性且总流动性不为 0 时', () => {
      it('应该正确计算百分比（10%）', () => {
        vi.mocked(store.getState).mockReturnValue(createMockState({ userLiq: 100n, totalLiq: 1000n }))
        expect(liquidity.getUserLpPercent()).toBe(10)
      })

      it('应该正确处理小数（1.23%）', () => {
        vi.mocked(store.getState).mockReturnValue(createMockState({ userLiq: 123n, totalLiq: 10000n }))
        expect(liquidity.getUserLpPercent()).toBe(1.23)
      })

      it('应该正确处理大数字', () => {
        vi.mocked(store.getState).mockReturnValue(createMockState({ userLiq: 123456789n, totalLiq: 987654321n }))
        expect(liquidity.getUserLpPercent()).toBeCloseTo(12.5, 1)
      })
    })
  })

  describe('getRemoveLiquidityTokens', () => {
    describe('当总流动性为 0 时', () => {
      it('应该返回 0', () => {
        vi.mocked(store.getState).mockReturnValue(createMockState({ reserve0: 1000n, reserve1: 2000n }))
        const { amount0, amount1 } = liquidity.getRemoveLiquidityTokens(10)
        expect(amount0).toBe(0n)
        expect(amount1).toBe(0n)
      })
    })

    describe('当总流动性不为 0 时', () => {
      it('应该正确计算移除 10% 的情况', () => {
        vi.mocked(store.getState).mockReturnValue(
          createMockState({
            userLiq: 100n,
            totalLiq: 1000n,
            reserve0: 1000n,
            reserve1: 2000n,
          })
        )
        const { amount0, amount1 } = liquidity.getRemoveLiquidityTokens(10)
        expect(amount0).toBe(100n)
        expect(amount1).toBe(200n)
      })

      it('应该正确计算小数百分比（1.23%）', () => {
        vi.mocked(store.getState).mockReturnValue(
          createMockState({
            userLiq: 123n,
            totalLiq: 10000n,
            reserve0: 10000n,
            reserve1: 20000n,
          })
        )
        const { amount0, amount1 } = liquidity.getRemoveLiquidityTokens(1.23)
        expect(amount0).toBe(123n)
        expect(amount1).toBe(246n)
      })

      it('应该正确处理大数字', () => {
        vi.mocked(store.getState).mockReturnValue(
          createMockState({
            userLiq: 123456789n,
            totalLiq: 987654321n,
            reserve0: 1000000000n,
            reserve1: 2000000000n,
          })
        )
        const { amount0, amount1 } = liquidity.getRemoveLiquidityTokens(12.5)
        expect(amount0).toBe(125000000n)
        expect(amount1).toBe(250000000n)
      })
    })
  })

  describe('getMaxAddLiquidityTokens', () => {
    it('应该根据当前池子比例计算最大可添加数量', () => {
      vi.mocked(store.getState).mockReturnValue(
        createMockState({
          reserve0: 1000n,
          reserve1: 2000n,
          mockERC20: 500n,
          mockUSDC: 1200n,
        })
      )
      const { amount0, amount1 } = liquidity.getMaxAddLiquidityTokens()
      expect(amount0).toBe(500n)
      expect(amount1).toBe(1000n)
    })
    it('应该根据当前池子比例计算最大可添加数量', () => {
      vi.mocked(store.getState).mockReturnValue(
        createMockState({
          reserve0: 1000n,
          reserve1: 2000n,
          mockERC20: 500n,
          mockUSDC: 800n,
        })
      )
      const { amount0, amount1 } = liquidity.getMaxAddLiquidityTokens()
      expect(amount0).toBe(400n)
      expect(amount1).toBe(800n)
    })
  })
})
