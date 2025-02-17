import { expect } from "chai";
import { ethers } from "hardhat";
import { MockERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MockERC20", function () {
  let mockToken: MockERC20;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy();
  });

  describe("部署", function () {
    it("应该设置正确的名称和符号", async function () {
      expect(await mockToken.name()).to.equal("Mock Token");
      expect(await mockToken.symbol()).to.equal("MTK");
    });

    it("应该铸造初始供应量给部署者", async function () {
      const initialSupply = ethers.parseEther("1000000");
      expect(await mockToken.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("应该设置正确的小数位数", async function () {
      expect(await mockToken.decimals()).to.equal(18);
    });
  });

  describe("铸造", function () {
    it("任何人都可以铸造代币", async function () {
      const mintAmount = ethers.parseEther("100");
      await mockToken.connect(user).mint(user.address, mintAmount);
      expect(await mockToken.balanceOf(user.address)).to.equal(mintAmount);
    });

    it("铸造应该正确增加总供应量", async function () {
      const initialSupply = await mockToken.totalSupply();
      const mintAmount = ethers.parseEther("100");
      await mockToken.mint(user.address, mintAmount);
      expect(await mockToken.totalSupply()).to.equal(initialSupply + mintAmount);
    });
  });

  describe("转账", function () {
    it("应该允许用户转账代币", async function () {
      const transferAmount = ethers.parseEther("100");
      await mockToken.transfer(user.address, transferAmount);
      expect(await mockToken.balanceOf(user.address)).to.equal(transferAmount);
    });

    it("应该在余额不足时回滚", async function () {
      const transferAmount = ethers.parseEther("1000001"); // 超过初始供应量
      await expect(mockToken.connect(user).transfer(owner.address, transferAmount))
        .to.be.revertedWithCustomError(mockToken, "ERC20InsufficientBalance");
    });
  });
}); 