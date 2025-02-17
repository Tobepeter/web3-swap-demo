// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC20 is ERC20, Ownable {
    constructor() ERC20("Mock Token", "MTK") Ownable(msg.sender) {
        // 初始铸造 1000000 个代币（18位小数）
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // 允许任何人铸造代币（仅用于测试目的）
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
} 