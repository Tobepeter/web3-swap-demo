// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';

contract MockUniswapV2Pair {
  using SafeERC20 for IERC20;

  address public token0;
  address public token1;
  uint256 public reserve0;
  uint256 public reserve1;

  // 流动性提供者的份额
  mapping(address => uint256) public liquidity;
  uint256 public totalLiquidity;

  event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to);
  event AddLiquidity(address indexed sender, uint256 amount0, uint256 amount1, uint256 liquidity);
  event RemoveLiquidity(address indexed sender, uint256 amount0, uint256 amount1, uint256 liquidity);

  constructor(address _token0, address _token1) {
    require(_token0 != address(0) && _token1 != address(0), 'Invalid token address');
    token0 = _token0;
    token1 = _token1;
  }

  // 添加流动性
  function addLiquidity(uint256 amount0, uint256 amount1) external returns (uint256 liquidityMinted) {
    IERC20(token0).safeTransferFrom(msg.sender, address(this), amount0);
    IERC20(token1).safeTransferFrom(msg.sender, address(this), amount1);

    uint256 _totalLiquidity = totalLiquidity;
    if (_totalLiquidity == 0) {
      liquidityMinted = Math.sqrt(amount0 * amount1);
    } else {
      liquidityMinted = Math.min((amount0 * _totalLiquidity) / reserve0, (amount1 * _totalLiquidity) / reserve1);
    }

    require(liquidityMinted > 0, 'Insufficient liquidity minted');

    reserve0 += amount0;
    reserve1 += amount1;
    liquidity[msg.sender] += liquidityMinted;
    totalLiquidity += liquidityMinted;

    emit AddLiquidity(msg.sender, amount0, amount1, liquidityMinted);
  }

  // 移除流动性
  function removeLiquidity(uint256 liquidityAmount) external returns (uint256 amount0, uint256 amount1) {
    require(liquidity[msg.sender] >= liquidityAmount, 'Insufficient liquidity');

    amount0 = (reserve0 * liquidityAmount) / totalLiquidity;
    amount1 = (reserve1 * liquidityAmount) / totalLiquidity;

    require(amount0 > 0 && amount1 > 0, 'Insufficient liquidity burned');

    liquidity[msg.sender] -= liquidityAmount;
    totalLiquidity -= liquidityAmount;
    reserve0 -= amount0;
    reserve1 -= amount1;

    IERC20(token0).safeTransfer(msg.sender, amount0);
    IERC20(token1).safeTransfer(msg.sender, amount1);

    emit RemoveLiquidity(msg.sender, amount0, amount1, liquidityAmount);
  }

  // 交换代币
  function swap(
    uint256 amount0In,
    uint256 amount1In,
    uint256 amount0Out,
    uint256 amount1Out,
    address to,
    uint256 slippage // 精度2，0.01%其实会放大1e4倍
  ) external {
    // 数量检查
    require(amount0In > 0 || amount1In > 0, 'Insufficient input amount');
    require(amount0Out > 0 || amount1Out > 0, 'Insufficient output amount');

    // 只允许单向
    require((amount0In > 0 && amount1Out > 0 && amount0Out == 0 && amount1In == 0) || (amount1In > 0 && amount0Out > 0 && amount0In == 0 && amount1Out == 0), 'Invalid swap direction');

    // 接收者检查
    require(to != token0 && to != token1, 'Invalid recipient');

    // 滑点检查
    require(slippage <= 5000, 'Slippage too high'); // 最大允许 50% 滑点

    // 提前存入所有代币
    if (amount0In > 0) {
      IERC20(token0).safeTransferFrom(msg.sender, address(this), amount0In);
    }
    if (amount1In > 0) {
      IERC20(token1).safeTransferFrom(msg.sender, address(this), amount1In);
    }

    // 滑点检查
    if (amount0In > 0 && amount1Out > 0) {
      uint256 actualOut = getAmountOut(amount0In, token0);
      require(actualOut >= (amount1Out * (10000 - slippage)) / 10000, 'Slippage exceeded');
      amount1Out = actualOut;
    } else if (amount1In > 0 && amount0Out > 0) {
      uint256 actualOut = getAmountOut(amount1In, token1);
      require(actualOut >= (amount0Out * (10000 - slippage)) / 10000, 'Slippage exceeded');
      amount0Out = actualOut;
    }

    // TODO: 上面的计算一定采纳汇率值，这里的k值计算是不是不需要了？

    // 检查 k 值是否保持不变或增加（使用扣除手续费后的金额）
    uint256 balance0 = reserve0 + amount0In - amount0Out;
    uint256 balance1 = reserve1 + amount1In - amount1Out;
    require(balance0 * balance1 >= reserve0 * reserve1, 'K value must not decrease');

    // 更新储备量（包括手续费）
    reserve0 = balance0;
    reserve1 = balance1;

    if (amount0Out > 0) {
      IERC20(token0).safeTransfer(to, amount0Out);
    }
    if (amount1Out > 0) {
      IERC20(token1).safeTransfer(to, amount1Out);
    }

    emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
  }

  // 获取当前汇率
  function getAmountOut(uint256 amountIn, address tokenIn) public view returns (uint256) {
    require(tokenIn == token0 || tokenIn == token1, 'Invalid token');

    if (reserve0 == 0 || reserve1 == 0) return 0;

    uint256 reserveIn = tokenIn == token0 ? reserve0 : reserve1;
    uint256 reserveOut = tokenIn == token0 ? reserve1 : reserve0;

    // TODO: 手续抽取为const?
    uint256 amountInWithFee = amountIn * 997; // 0.3% 手续费
    uint256 numerator = amountInWithFee * reserveOut;
    uint256 denominator = reserveIn * 1000 + amountInWithFee;
    return numerator / denominator;
  }
}
