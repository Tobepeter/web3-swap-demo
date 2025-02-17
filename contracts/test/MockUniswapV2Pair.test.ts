import { expect } from "chai";
import { ethers } from "hardhat";
import { MockUniswapV2Pair, MockERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MockUniswapV2Pair", function () {
  let pair: MockUniswapV2Pair;
  let token0: MockERC20;
  let token1: MockERC20;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // 部署两个测试代币
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    token0 = await MockERC20Factory.deploy();
    token1 = await MockERC20Factory.deploy();

    // 确保 token0 的地址小于 token1
    if (token0.target > token1.target) {
      [token0, token1] = [token1, token0];
    }

    // 部署交易对
    const MockUniswapV2PairFactory = await ethers.getContractFactory("MockUniswapV2Pair");
    pair = await MockUniswapV2PairFactory.deploy(token0.target, token1.target);

    // 给用户一些代币用于测试
    await token0.mint(user.address, ethers.parseEther("1000"));
    await token1.mint(user.address, ethers.parseEther("1000"));

    // 批准交易对合约使用代币
    await token0.approve(pair.target, ethers.MaxUint256);
    await token1.approve(pair.target, ethers.MaxUint256);
    await token0.connect(user).approve(pair.target, ethers.MaxUint256);
    await token1.connect(user).approve(pair.target, ethers.MaxUint256);
  });

  describe("部署", function () {
    it("应该正确设置代币地址", async function () {
      expect(await pair.token0()).to.equal(token0.target);
      expect(await pair.token1()).to.equal(token1.target);
    });
  });

  describe("添加流动性", function () {
    it("应该正确添加初始流动性", async function () {
      const amount0 = ethers.parseEther("10");
      const amount1 = ethers.parseEther("20");
      
      await pair.addLiquidity(amount0, amount1);
      
      expect(await pair.reserve0()).to.equal(amount0);
      expect(await pair.reserve1()).to.equal(amount1);
      expect(await pair.totalLiquidity()).to.be.gt(0);
    });

    it("应该正确计算流动性代币数量", async function () {
      const amount0 = ethers.parseEther("10");
      const amount1 = ethers.parseEther("20");
      
      // 首次添加流动性
      const tx = await pair.addLiquidity(amount0, amount1);
      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        log => log.topics[0] === pair.interface.getEvent("AddLiquidity").topicHash
      );
      const [provider, , , liquidity] = pair.interface.decodeEventLog(
        "AddLiquidity",
        event!.data,
        event!.topics
      );
      
      expect(liquidity).to.equal(ethers.parseEther("14.142135623730950488")); // sqrt(10 * 20) * 10^18
    });
  });

  describe("移除流动性", function () {
    beforeEach(async function () {
      // 添加初始流动性
      await pair.addLiquidity(ethers.parseEther("10"), ethers.parseEther("20"));
    });

    it("应该正确移除流动性", async function () {
      const liquidityBalance = await pair.liquidity(owner.address);
      await pair.removeLiquidity(liquidityBalance);
      
      expect(await pair.reserve0()).to.equal(0);
      expect(await pair.reserve1()).to.equal(0);
      expect(await pair.totalLiquidity()).to.equal(0);
    });
  });

  describe("交换", function () {
    beforeEach(async function () {
      // 添加初始流动性
      await pair.addLiquidity(ethers.parseEther("100"), ethers.parseEther("100"));
    });

    it("应该正确计算交换金额", async function () {
      const amountIn = ethers.parseEther("1");
      const expectedAmountOut = await pair.getAmountOut(amountIn, token0.target);
      
      // 验证输出金额在合理范围内
      expect(expectedAmountOut).to.be.gt(0);
      expect(expectedAmountOut).to.be.lt(amountIn); // 由于手续费，输出金额应该小于输入金额
      
      // 验证手续费计算（应该是输入金额的 0.3%）
      const fee = amountIn - (BigInt(997) * amountIn / BigInt(1000));
      expect(fee).to.equal(amountIn * BigInt(3) / BigInt(1000));
    });

    it("应该成功执行代币交换", async function () {
      const amountIn = ethers.parseEther("1");
      const amountOut = await pair.getAmountOut(amountIn, token0.target);
      
      await pair.connect(user).swap(amountIn, 0, 0, amountOut, user.address);
      
      // 验证储备金更新
      expect(await pair.reserve0()).to.equal(ethers.parseEther("101"));
      expect(await pair.reserve1()).to.be.lt(ethers.parseEther("100"));
    });

    it("应该在违反 K 值时回滚", async function () {
      const amountIn = ethers.parseEther("1");
      const invalidAmountOut = ethers.parseEther("2"); // 过高的输出金额
      
      await expect(
        pair.connect(user).swap(amountIn, 0, 0, invalidAmountOut, user.address)
      ).to.be.revertedWith("K value must not decrease");
    });
  });
}); 