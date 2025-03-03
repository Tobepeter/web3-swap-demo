# 小白

Q：

现在我已经用hardhat搭建了一个开发环境，我想实现任务描述的合约功能，不着急修改，给我一些思路，（我听说可以使用通用的ERC20来继承，直接使用，不知道可以吗）

A：

需要实现两个 ERC20 代币：
MockERC20：一个普通的 ERC20 代币
MOCK_USDC：模拟 USDC，使用 6 位小数
需要一个简化版的 UniswapV2 配对合约，包含：
swap 功能
addLiquidity 功能

对于你提到的使用通用 ERC20 继承的方案，这是完全可行的！实际上这是一个很好的方案，因为：
OpenZeppelin 提供了经过审计和广泛使用的 ERC20 实现
不需要重复造轮子，可以直接继承并使用
更安全，因为使用了经过验证的代码

# OpenZippelin是什么

OpenZeppelin 是一个非常重要的智能合约开发库，让我为你详细解释：

OpenZeppelin 是以太坊生态系统中最流行的智能合约开发库，它提供了：

1. 安全性保障：
   - 所有代码都经过专业审计
   - 被业界广泛使用和验证
   - 持续维护和更新
2. 标准实现：
   - 提供了所有主要 ERC 标准的标准实现
   - 包括 ERC20、ERC721（NFT）、ERC1155 等
   - 确保符合以太坊标准
3. 常用功能：
   - 访问控制（如 Ownable）
   - 安全数学运算
   - 代币锁定
   - 多重签名钱包等

# 为什么需要自己定义代币，没有测试网络有现成的吗？

## 测试网络的代币情况

1. ETH
   - 所有以太坊测试网络（如 Sepolia, Goerli）都有测试用 ETH
   - 可以通过水龙头（Faucet）免费获取
   - 主要用于支付 gas 费用
2. 常见稳定币（如 USDC）
   - 一些主流代币在测试网确实有官方版本
   - 但是：
     - 不是所有测试网都有
     - 获取这些代币可能不太方便
     - 不能保证稳定可用

## 为什么要自己部署测试代币？

1. 控制性
   - 可以自由铸造代币进行测试
   - 可以完全控制代币的行为
   - 方便调试和测试各种场景
2. 可靠性
   - 不依赖第三方服务
   - 测试环境完全可控
   - 避免测试网上的代币可能存在的问题（如限制、延迟等）

## 面试任务要求

    - 查看任务描述中明确要求：
        - Use mock ERC20 contracts (`MockERC20`, `MOCK_USDC`) and a simple UniswapV2 pair contract.
    - 这是考察点之一，要看你是否能够正确实现 ERC20 合约

## 学习目的

    - 帮助理解 ERC20 标准
    - 实践智能合约开发

为将来开发真实项目打基础

# Sepolia测试网ETH

好的，让我帮你获取 Sepolia 测试网的 ETH。以下是几个可靠的 Sepolia 测试网 ETH 水龙头：

1. Alchemy Sepolia 水龙头
   访问：https://sepoliafaucet.com/
   需要连接 Alchemy 账户
   每天可以领取 0.5 Sepolia ETH
   最稳定可靠

2. Infura Sepolia 水龙头
   访问：https://www.infura.io/faucet/sepolia
   需要注册 Infura 账号
   每天可以领取 0.5 Sepolia ETH

3. QuickNode Sepolia 水龙头
   访问：https://faucet.quicknode.com/ethereum/sepolia
   需要完成社交媒体任务
   每天可以领取 0.1 Sepolia ETH

对于 Sepolia 测试网络,常见的 RPC 提供商包括:

- Alchemy
- Infura
- QuickNode
- 公共端点

## 撸毛指南

https://www.binance.com/zh-CN/square/post/14998165664721

http://cloud.google.com/application/web3/faucet/ethereum/sepolia

使用步骤：

- 准备好你的钱包地址
- 选择上面任意一个水龙头（建议使用 Alchemy 的）
- 粘贴你的钱包地址
- 完成验证后领取测试币

# alchemy 不支持中国区么

是的，Alchemy 确实不支持中国区。让我们换其他水龙头：

1. Sepolia PoW Pool 水龙头
   访问：https://sepolia-faucet.pk910.de/
   直接输入钱包地址即可
   通过浏览器挖矿获得测试币
   不需要注册，直接使用

2. Chainstack Sepolia 水龙头
   访问：https://faucet.chainstack.com/sepolia-faucet
   只需要完成验证码
   每24小时可以领取一次

3. Sepolia Testnet Faucet
   访问：https://faucet-sepolia.rockx.com/
   直接输入地址领取
   每天每个地址可以领取一次

# 为什么metamask切换网路地址可以保证不变

1. 用户友好性
   不需要记住多个地址
   同一个地址可以在所有兼容网络使用
   就像一个银行卡号可以在不同银行网点使用

2. 技术兼容性
   所有基于以太坊技术的网络使用相同的地址格式
   使用相同的签名算法
   私钥可以在所有网络上证明你的身份

以太坊地址的唯一性是通过密码学来保证的，让我解释这个过程：

私钥 (256位随机数)
↓ (椭圆曲线加密SECP256K1)
公钥 (512位)
↓ (Keccak-256哈希)
地址 (160位，40个十六进制字符)

私钥空间巨大到实际上不可能发生碰撞
即使全人类每秒生成一百万个地址，运行到宇宙毁灭也不会重复
这就是为什么我们说它是"实际唯一"的，虽然理论上可能重复，但概率小到可以忽略不计。

私钥空间
2^256 种可能性
约等于 115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,936
这个数字比可观测宇宙中的原子总数还要大

# ethers.js 是做什么的

```javascript
// 前端 DApp 开发
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(address, abi, signer)

// 后端服务开发
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const wallet = new ethers.Wallet(privateKey, provider)

// 合约部署脚本
const factory = new ethers.ContractFactory(abi, bytecode, signer)
const contract = await factory.deploy()
```

- 前端 DApp 开发
- 后端服务开发
- 合约部署和测试
- 钱包应用开发

## 对比 web3.js

最早的以太坊 JavaScript 库，API 设计相对老旧，主要用于浏览器环境

# etherscan

Etherscan 就像是区块链的"谷歌"
它把区块链上的原始数据转换成人类可读的格式
实时同步和索引区块链上的所有信息

## 不同网络的版本

主网：etherscan.io
Sepolia测试网：sepolia.etherscan.io
Goerli测试网：goerli.etherscan.io

# hardhat 的网络配置

在 Hardhat 中，网络配置是一个很重要的概念，主要有以下几种常见的网络类型：

1. hardhat 网络（默认）：

   - 这是当你不指定 --network 参数时使用的默认网络
   - 它是一个内置的本地以太坊网络模拟器
   - 每次运行任务时都会创建一个新的临时网络实例
   - 运行完成后会自动销毁
   - 适合用于快速测试和开发

2. localhost 网络：

   - 这是通过 hardhat node 命令启动的持久本地网络
   - 网络状态会持续存在，直到你手动关闭节点
   - 交易历史会被保留
   - 更接近真实区块链网络的行为
   - 适合本地开发和调试

3. 其他网络：
   - 这是通过 hardhat network 命令启动的网络
   - 它是一个内置的本地以太坊网络模拟器
   - 每次运行任务时都会创建一个新的临时网络实例
   - 运行完成后会自动销毁

# SafeTransferFrom vs TransferFrom

SafeTransferFrom 和 TransferFrom 是 ERC20 标准中的两个函数，主要区别在于：

1. 主要保护机制：

   - 检查转账返回值
   - 验证接收地址的合法性
   - 确保合约地址实现了接收代币的接口
   - 失败时立即回滚整个交易

2. 额外安全检查：

   - 检查地址是否为零地址
   - 检查合约地址是否能正确处理接收到的代币
   - 防止代币被锁在不能处理ERC20的合约中

比如说执行错误会中断，阻止函数的后续调用

# 交换合约是否需要默认初始流动性？

在部署合约时分配初始流动性是一个常见且推荐的做法，原因如下：

1. 用户体验：

   - 用户可以立即开始交易，不需要等待流动性提供
   - 避免首个用户因为没有流动性而无法进行交易

2. 价格稳定性：

   - 初始流动性可以帮助建立一个合理的初始价格
   - 减少早期价格波动和操纵的风险

3. 安全性：

   - 可以在部署脚本中统一管理初始流动性的分配
   - 避免后期手动操作可能带来的错误

# 关于事件

1. 事件的优点：

   - 节省存储成本（比存储在状态变量中更便宜）
   - 提供交易历史记录
   - 便于链下应用与区块链交互
   - 可以作为链下数据存储的索引

2. 需要注意的是：

   - 事件数据存储在区块链的日志中，智能合约无法访问
   - 事件一旦发出就不可更改
   - indexed 参数会消耗更多的 gas，但便于搜索

# 为什么有的转账需要用 payable，但是有的是 IERC0

ETH是以太坊的原生代币，直接存在于地址的余额中

需要payable来处理ETH的转账

```solidity
contract Example {
    // ETH转账 - 需要payable
    function transferETH(address to) external payable {
        payable(to).transfer(1 ether);
    }

    // ERC20转账 - 不需要payable
    function transferToken(address token, address to) external {
        IERC20(token).transfer(to, 1000);

        IERC20(token).transferFrom(msg.sender, to, 1000);
    }

    // 接收ETH - 需要payable
    receive() external payable {}
}
```

# 常见的转账函数

1. transfer

   IERC20(token).transfer(to, 1000);

2. transferFrom

   IERC20(token).transferFrom(msg.sender, to, 1000);

3. safeTransfer

   IERC20(token).safeTransfer(to, 1000);

4. safeTransferFrom

   IERC20(token).safeTransferFrom(msg.sender, to, 1000);

# 为什么 solidity memory 一定要复制内存，不能共享

内存隔离可以避免复杂的内存引用问题

```C++
// C++ 示例
class Traditional {
    void example() {
        int* ptr1 = new int[2];
        ptr1[0] = 1;

        // 多个指针指向同一块内存
        int* ptr2 = ptr1;

        // 可能的问题：
        delete ptr1;    // 释放内存
        ptr2[0] = 100;  // 悬空指针！访问已释放的内存

        // 或者重复释放
        delete ptr2; // 重复释放同一块内存！
    }
}
```

这种设计避免了：

1. 内存管理问题：

   - 没有悬空指针
   - 不会重复释放内存
   - 不需要手动内存管理

2. 并发问题：

   - 没有共享内存
   - 不需要考虑锁和同步
   - 函数调用结果更可预测

3. 安全隐患：

   - 避免缓冲区溢出
   - 防止内存泄露
   - 降低重入攻击风险

虽然这种方式：

- 消耗更多 gas（因为要复制数据）
- 看起来不够灵活
- 可能需要更多代码

# hardhat compile 是什么

生成abi和bytecode

1. abi(Application Binary Interface)

描述如何与合约交互的接口定义
abi 还会通过 `npx hardhat typechain` 生成 ts 类型

2. 字节码

Solidity 是高级语言，需要编译成 EVM（以太坊虚拟机）能理解的字节码
构建字节码数使用 `npx hardhat compile`
构建产物在 `artifacts` 目录下
如果命中缓存，部署时候 getContractFactory 会直接返回缓存

# 我看到有两种类型得到 abi 区别是什么

ethers.js 风格的人类可读 ABI 格式（Human-Readable ABI）。这种简化的 ABI 格式是 ethers.js 的特色功能之一。

1. ethers.js 的简化格式：

```javascript
const abi = ['function balanceOf(address) view returns (uint256)']
```

2. viem 要求的标准 JSON ABI 格式：

```javascript
const abi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ type: 'address', name: 'account' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
]
```

viem 确实不支持 ethers.js 的简化格式，必须使用完整的 JSON ABI 格式。这是因为：

1. viem 更倾向于使用标准的 Solidity ABI JSON 格式
2. 完整的 JSON ABI 格式包含了更多的类型信息，有利于 TypeScript 类型推导
3. 避免了需要解析人类可读格式的额外开销

# 一个typechain不兼容问题

```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/ethers.js?v=498a2c88' does not provide an export named 'Interface' (at Ownable__factory.ts:5:20)

为什么
```

@nomicfoundation/hardhat-toolbox 默认包含了对 ethers.js 的支持，所以使用 ethers.js 不需要额外安装包

doc: https://hardhat.org/hardhat-runner/docs/advanced/using-viem

# 滑点一般是针对swap代币吗？提取流动性也有滑点吗

关于 Swap 的滑点：
滑点主要是针对 swap 交易的，因为 swap 交易会直接影响池子的价格

当用户发起一笔较大的交易时，由于 AMM 的恒定乘积公式，会导致价格发生显著变化
另外，在用户交易的确认期间，可能有其他用户的交易先被确认，导致实际执行价格与预期不符
所以在 swap 时设置滑点容忍度非常重要，可以保护用户免受过大的价格波动影响

提取流动性通常不会受到明显的滑点影响
因为提取流动性是按照当前池子的比例进行的，计算公式是确定的
不过在高波动期间，LP 可能会因为无常损失（Impermanent Loss）而遭受损失，但这与滑点是不同的概念

# 为什么uniswap的滑点配置是一个正数？

确实存在两种不同的滑点相关概念和计算方式

1. 实际滑点

实际滑点 = 预期价格 - 实际执行价格

2. 滑点容忍度（交易执行前设置）

这是在DEX（如Uniswap）等平台上用户事先设置的参数，表示愿意接受的最大价格偏离范围。

最大接受价格 = 当前价格 × (1 ± 滑点容忍度%)

# 交易所如何处理正向滑点（对用户有利的情况）

Q: 我想知道，一般交易所，举个例子，我一个A可以换100个B，但是实际上只能换90个，我设置了允滑点10%，成功了，但是如果说实际上，可以换110个B
交易所会好心的给我110个，还是进按照我的预期给100个B？

A: 在标准的DEX和大多数交易所中，如果市场条件对您有利（可以获得比预期更多的代币），交易所会将这种优势传递给您，给您实际可获得的全部数量
滑点容忍度主要是为了保护您免受不利价格波动的影响，而不是限制您获得更好的价格。这也符合交易所的利益，因为提供最优执行可以吸引更多用户。
