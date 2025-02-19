// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("MockUSDC Token", "MockUSDC") Ownable(msg.sender) {
        // 初始铸造 1000000 个代币（6位小数）
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // 重写 decimals() 函数返回 6，模仿 USDC
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    // 允许任何人铸造代币（仅用于测试目的）
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
} 