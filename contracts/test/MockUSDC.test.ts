import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { MockUSDC } from '../typechain-types'

describe('MockUSDC', function () {
  let mockUSDC: MockUSDC
  let owner: SignerWithAddress
  let user: SignerWithAddress

  beforeEach(async function () {
    ;[owner, user] = await ethers.getSigners()
    const MockUSDCFactory = await ethers.getContractFactory('MockUSDC')
    mockUSDC = await MockUSDCFactory.deploy()
  })

  describe('部署', function () {
    it('应该设置正确的名称和符号', async function () {
      expect(await mockUSDC.name()).to.equal('Mock USDC')
      expect(await mockUSDC.symbol()).to.equal('MockUSDC')
    })

    it('应该铸造初始供应量给部署者', async function () {
      const decimals = await mockUSDC.decimals()
      const initialSupply = BigInt(1000000) * BigInt(10) ** BigInt(decimals)
      expect(await mockUSDC.balanceOf(owner.address)).to.equal(initialSupply)
    })

    it('应该设置正确的小数位数为6', async function () {
      expect(await mockUSDC.decimals()).to.equal(6)
    })
  })

  describe('铸造', function () {
    it('任何人都可以铸造代币', async function () {
      const mintAmount = BigInt(100) * BigInt(10) ** BigInt(6) // 100 USDC
      await mockUSDC.connect(user).mint(user.address, mintAmount)
      expect(await mockUSDC.balanceOf(user.address)).to.equal(mintAmount)
    })

    it('铸造应该正确增加总供应量', async function () {
      const initialSupply = await mockUSDC.totalSupply()
      const mintAmount = BigInt(100) * BigInt(10) ** BigInt(6) // 100 USDC
      await mockUSDC.mint(user.address, mintAmount)
      expect(await mockUSDC.totalSupply()).to.equal(initialSupply + mintAmount)
    })
  })

  describe('转账', function () {
    it('应该允许用户转账代币', async function () {
      const transferAmount = BigInt(100) * BigInt(10) ** BigInt(6) // 100 USDC
      await mockUSDC.transfer(user.address, transferAmount)
      expect(await mockUSDC.balanceOf(user.address)).to.equal(transferAmount)
    })

    it('应该在余额不足时回滚', async function () {
      const transferAmount = BigInt(1000001) * BigInt(10) ** BigInt(6) // 超过初始供应量
      await expect(mockUSDC.connect(user).transfer(owner.address, transferAmount)).to.be.revertedWithCustomError(mockUSDC, 'ERC20InsufficientBalance')
    })
  })
})
