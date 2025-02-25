import { expect } from 'chai'
import { ethers } from 'hardhat'
import { MockUniswapV2Pair, MockERC20 } from '../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'

describe('MockUniswapV2Pair', function () {
  let pair: MockUniswapV2Pair
  let token0: MockERC20
  let token1: MockERC20
  let owner: SignerWithAddress
  let user: SignerWithAddress

  beforeEach(async function () {
    ;[owner, user] = await ethers.getSigners()

    // 部署两个测试代币
    const MockERC20Factory = await ethers.getContractFactory('MockERC20')
    token0 = await MockERC20Factory.deploy()
    token1 = await MockERC20Factory.deploy()

    // 确保 token0 的地址小于 token1
    if (token0.target > token1.target) {
      ;[token0, token1] = [token1, token0]
    }

    // 部署交易对
    const MockUniswapV2PairFactory = await ethers.getContractFactory('MockUniswapV2Pair')
    pair = await MockUniswapV2PairFactory.deploy(token0.target, token1.target)

    // 给用户一些代币用于测试
    await token0.mint(user.address, ethers.parseEther('1000'))
    await token1.mint(user.address, ethers.parseEther('1000'))

    // 批准交易对合约使用代币
    await token0.approve(pair.target, ethers.MaxUint256)
    await token1.approve(pair.target, ethers.MaxUint256)
    await token0.connect(user).approve(pair.target, ethers.MaxUint256)
    await token1.connect(user).approve(pair.target, ethers.MaxUint256)
  })

  describe('部署', function () {
    it('应该正确设置代币地址', async function () {
      expect(await pair.token0()).to.equal(token0.target)
      expect(await pair.token1()).to.equal(token1.target)
    })
  })

  describe('添加流动性', function () {
    it('应该正确添加初始流动性', async function () {
      const amount0 = ethers.parseEther('10')
      const amount1 = ethers.parseEther('20')

      await pair.addLiquidity(amount0, amount1)

      expect(await pair.reserve0()).to.equal(amount0)
      expect(await pair.reserve1()).to.equal(amount1)
      expect(await pair.totalLiquidity()).to.be.gt(0)
    })

    it('应该正确计算流动性代币数量', async function () {
      const amount0 = ethers.parseEther('10')
      const amount1 = ethers.parseEther('20')

      // 首次添加流动性
      const tx = await pair.addLiquidity(amount0, amount1)
      const receipt = await tx.wait()
      const event = receipt?.logs.find(log => log.topics[0] === pair.interface.getEvent('AddLiquidity').topicHash)
      const [provider, , , liquidity] = pair.interface.decodeEventLog('AddLiquidity', event!.data, event!.topics)

      expect(liquidity).to.equal(ethers.parseEther('14.142135623730950488')) // sqrt(10 * 20) * 10^18
    })
  })

  describe('移除流动性', function () {
    beforeEach(async function () {
      // 添加初始流动性
      await pair.addLiquidity(ethers.parseEther('10'), ethers.parseEther('20'))
    })

    it('应该正确移除流动性', async function () {
      const liquidityBalance = await pair.liquidity(owner.address)
      await pair.removeLiquidity(liquidityBalance)

      expect(await pair.reserve0()).to.equal(0)
      expect(await pair.reserve1()).to.equal(0)
      expect(await pair.totalLiquidity()).to.equal(0)
    })
  })

  describe('交换', function () {
    beforeEach(async function () {
      // 添加初始流动性
      await pair.addLiquidity(ethers.parseEther('100'), ethers.parseEther('100'))
    })

    it('应该正确计算交换金额', async function () {
      const amountIn = ethers.parseEther('1')
      const expectedAmountOut = await pair.getAmountOut(amountIn, token0.target)

      // 验证输出金额在合理范围内
      expect(expectedAmountOut).to.be.gt(0)
      expect(expectedAmountOut).to.be.lt(amountIn) // 由于手续费，输出金额应该小于输入金额

      // 验证手续费计算（应该是输入金额的 0.3%）
      const fee = amountIn - (BigInt(997) * amountIn) / BigInt(1000)
      expect(fee).to.equal((amountIn * BigInt(3)) / BigInt(1000))
    })

    it('应该成功执行代币交换', async function () {
      const amountIn = ethers.parseEther('1')
      const amountOut = await pair.getAmountOut(amountIn, token0.target)

      await pair.connect(user).swap(amountIn, 0, 0, amountOut, user.address, 0)

      // 验证储备金更新
      expect(await pair.reserve0()).to.equal(ethers.parseEther('101'))
      expect(await pair.reserve1()).to.be.lt(ethers.parseEther('100'))
    })

    it('当滑点在允许范围内时应该成功执行交换', async function () {
      const amountIn = ethers.parseEther('1')
      const expectedAmountOut = await pair.getAmountOut(amountIn, token0.target)
      // 设置 1% 的滑点容忍度
      const minAmountOut = (expectedAmountOut * BigInt(99)) / BigInt(100)

      await pair.connect(user).swap(amountIn, 0, 0, minAmountOut, user.address, 0)

      const actualAmountOut = ethers.parseEther('100') - (await pair.reserve1())
      expect(actualAmountOut).to.be.gte(minAmountOut)
      expect(actualAmountOut).to.be.lte(expectedAmountOut)
    })

    it('输入均为空时应该回滚交易', async function () {
      await expect(pair.connect(user).swap(0, 0, 0, 0, user.address, 0)).to.be.revertedWith('Insufficient input amount')
    })

    it('非单向应该回滚交易', async function () {
      await expect(pair.connect(user).swap(ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), ethers.parseEther('10'), user.address, 0)).to.be.revertedWith(
        'Invalid swap direction'
      )
    })

    it('接收者不能是代币0或代币1', async function () {
      await expect(pair.connect(user).swap(ethers.parseEther('10'), 0, 0, ethers.parseEther('10'), token0.target, 0)).to.be.revertedWith('Invalid recipient')
    })

    it('滑点不能超过50%', async function () {
      await expect(pair.connect(user).swap(ethers.parseEther('10'), 0, 0, ethers.parseEther('10'), user.address, 5001)).to.be.revertedWith('Slippage too high')
    })

    it('当滑点超出允许范围时应该回滚交易', async function () {
      const amountIn = ethers.parseEther('1')
      const theoreticalOutput = await pair.getAmountOut(amountIn, token0.target) // 理论输出金额
      const allowedSlippage = BigInt(1) // 允许的滑点 0.01%
      const desiredSlippage = BigInt(2) // 期望的滑点 0.02%（大于允许的滑点）
      const desiredOutput = (theoreticalOutput * (BigInt(10000) + desiredSlippage)) / BigInt(10000) // 期望的输出金额

      await expect(pair.connect(user).swap(amountIn, 0, 0, desiredOutput, user.address, allowedSlippage)).to.be.revertedWith('Slippage exceeded')
    })

    it('滑点在允许范围内', async function () {
      const amountIn = ethers.parseEther('1')
      const theoreticalOutput = await pair.getAmountOut(amountIn, token0.target) // 理论输出金额
      const allowedSlippage = BigInt(2) // 允许的滑点 0.02%
      const desiredSlippage = BigInt(1) // 期望的滑点 0.01%（小于允许的滑点）
      const desiredOutput = (theoreticalOutput * (BigInt(10000) + desiredSlippage)) / BigInt(10000) // 期望的输出金额

      const tx = await pair.connect(user).swap(amountIn, 0, 0, desiredOutput, user.address, allowedSlippage)
      const receipt = await tx.wait()
      const event = receipt?.logs.find(log => log.topics[0] === pair.interface.getEvent('Swap').topicHash)
      const eventArgs = pair.interface.decodeEventLog('Swap', event!.data, event!.topics)
      const amountOut = eventArgs[4]

      expect(amountOut).to.equal(theoreticalOutput)
    })

    it('准备交换前，有人先交易了，滑点在允许范围内', async function () {
      const preResserve0 = await pair.reserve0()
      const preResserve1 = await pair.reserve1()

      const amountIn = ethers.parseEther('1')
      const theoreticalOutput = await pair.getAmountOut(amountIn, token0.target) // 理论输出金额
      const slippage = BigInt(1)

      // TODO: 这个逆运算太难写，有再想想如何实现

      // const tx = await pair.connect(user).swap(amountIn, 0, 0, theoreticalOutput, user.address, slippage)
      // const receipt = await tx.wait()
      // const event = receipt?.logs.find(log => log.topics[0] === pair.interface.getEvent('Swap').topicHash)
      // const [provider, , , amountOut] = pair.interface.decodeEventLog('Swap', event!.data, event!.topics)

      // expect(amountOut).to.equal(theoreticalOutput)
    })

    it('无干扰交换，个人余额变化参考汇率', async function () {
      const amount0Balance = await token0.balanceOf(user.address)
      const amount1Balance = await token1.balanceOf(user.address)

      const amountIn = ethers.parseEther('1')
      const theoreticalOutput = await pair.getAmountOut(amountIn, token0.target) // 理论输出金额
      const slippage = BigInt(1)

      await pair.connect(user).swap(amountIn, 0, 0, theoreticalOutput, user.address, slippage)

      const amount1BalanceAfter = await token1.balanceOf(user.address)
      const amount0BalanceAfter = await token0.balanceOf(user.address)

      expect(amount0BalanceAfter).to.equal(amount0Balance - amountIn)
      expect(amount1BalanceAfter).to.equal(amount1Balance + theoreticalOutput)
    })
  })
})
