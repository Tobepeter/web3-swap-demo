# 钱包中，获取网络id是什么意思？

在以太坊区块链中，网络ID（Network ID）或链ID（Chain ID）是用来区分不同以太坊网络的唯一标识符。让我为您解释一下：

主要的以太坊网络ID包括：

- Mainnet（主网）: 1
- Goerli（测试网）: 5
- Sepolia（测试网）: 11155111
- 本地开发网络（如 Hardhat）: 31337

在以太坊钱包中，获取网络ID通常是为了确定当前连接的区块链网络类型。例如，在MetaMask钱包中，您可以切换不同的网络，如主网、测试网或本地开发网络。获取网络ID可以帮助您确认当前连接的网络类型，以便进行正确的交易或操作。

# 钱包中，提供商和签名者是什么意思

## 提供商（Provider）:

- 是连接以太坊网络的桥梁
- 负责读取区块链数据，如：
  - 查询账户余额
  - 获取交易信息
  - 读取智能合约状态
  - 不能签名或发送交易
  - 类似于一个"只读"接口

## 签名者（Signer）:

- 代表一个以太坊账户
- 具有私钥，可以：
  - 签名交易和消息
  - 发送交易（转账、调用合约等）
- 通常通过钱包（如 MetaMask）提供
- 类似于一个"可写"接口

# 浏览器装了metamask插件后，会在window上增加一个，ethereum吗？为什么不直接叫做metaMask呢

安装 MetaMask 后会在 window 对象上注入 ethereum 对象

1. 标准化考虑

- window.ethereum 是 EIP-1193 规范定义的标准接口
- 这个规范统一了不同钱包提供商与 DApp 交互的方式
- 不仅是 MetaMask，其他钱包（如 Coinbase Wallet、Trust Wallet）也都遵循这个规范

2. 兼容性和互操作性

- 如果每个钱包都用自己的专有名称（如 window.metaMask），那么 DApp 就需要为每个钱包写不同的代码
- 统一使用 window.ethereum 接口，使得 DApp 可以无缝支持不同的钱包

3. 历史原因

- 早期 Web3 生态中，MetaMask 是第一个广泛使用的浏览器钱包
- 它设立了很多事实标准，包括使用 window.ethereum 这个注入点
- 后来这个做法被标准化为 EIP-1193

# 处理web3余额数据，建议bigint还是有什么库？

viem 和 ethers.js 都是用于与以太坊区块链交互的 JavaScript 库，但它们的设计理念、特性和使用场景有所不同。以下是它们的对比和推荐：

viem 是一个较新的库，专注于提供更简洁、现代化的 API，并且对 TypeScript 有很好的支持。它的设计目标是减少开发者在使用以太坊时的复杂性。

ethers.js 是一个成熟的以太坊库，广泛用于各种以太坊项目中。它提供了丰富的功能，包括与智能合约交互、钱包管理、签名等。

## 推荐

- 新项目: 如果你正在启动一个新项目，并且对代码的简洁性和类型安全有较高的要求，推荐使用 viem。它的现代化设计和 TypeScript 支持会让开发体验更好。
- 现有项目: 如果你已经有一个基于 ethers.js 的项目，或者需要依赖于 ethers.js 的丰富功能和社区资源，继续使用 ethers.js 是一个稳妥的选择。
- 个人偏好: 如果你更喜欢简洁的 API 和现代化的开发体验，viem 可能更适合你。如果你更看重功能全面性和社区支持，ethers.js 是更好的选择。

# WalletConnect 使用指南

WalletConnect 是一个开放协议，允许您的钱包应用与去中心化应用（DApps）进行安全连接和交互

通常通过扫码的方式连接DAPP

## 连接方式？

使用 WebSocket 进行实时双向通信

通信流程：

- 初始配对：通过扫描二维码建立连接
- 建立 WebSocket 连接，保持设备间的实时通信
- 当 DApp 需要签名等操作时，通过 WebSocket 发送请求到手机
- 用户在手机上确认后，通过 WebSocket 返回结果

在 WalletConnect 的场景中，有几种需要关闭连接的情况：

- 主动断开：
  - 用户点击断开连接
  - DApp 主动调用断开
  - 手机端钱包主动断开
- 异常断开：
  - 网络问题导致 WebSocket 连接断开
  - 手机端退出应用
  - 浏览器关闭/刷新页面

# 安装钱包要我安装的包

@web3modal/wagmi、wagmi、viem 和 @web3modal/ethereum 包解析

## wagmi

wagmi 是一个 React Hooks 库，专为以太坊开发设计，使前端开发人员能够轻松地与以太坊区块链和智能合约进行交互。

- 提供了一系列 React Hooks，如 useConnect、useAccount、useBalance 等
- 自动处理钱包连接、网络切换、交易发送等复杂操作

## viem

viem 是一个低级别的以太坊交互库，专注于类型安全和高效率。它是 wagmi 的底层依赖。

- 提供与以太坊节点和智能合约交互的 API
- 支持 JSON-RPC 请求和响应处理
- 比 ethers.js 或 web3.js 更轻量级和更现代化

## @web3modal/wagmi

@web3modal/wagmi 是 Web3Modal 的 wagmi 适配器，它将 Web3Modal 的界面与 wagmi 的功能结合起来。

- 将 Web3Modal 的 UI 组件与 wagmi 的钱包连接功能无缝集成
- 简化了 wagmi 和 Web3Modal 之间的配置

## @web3modal/ethereum

@web3modal/ethereum 是 Web3Modal 的以太坊提供者，专门用于连接以太坊网络和钱包。

# web3modal 是什么

Web3Modal 是一个流行的开源库，为去中心化应用（DApps）提供了一个简单、直观且用户友好的界面
Web3Modal 是一个连接界面，它提供 UI 界面让用户选择要使用的钱包，支持多个钱包，不仅仅是 metamask

Web3Modal 更像是：

- 电视遥控器上的"输入源选择按钮"（让您选择要连接的设备）
- 网站上的"使用...登录"按钮面板（Google、Facebook、Twitter 等选项）
- 支付页面上的支付方式选择界面（信用卡、PayPal、Apple Pay 等）

# walletconnect相关信息

## 安装包

npm install @walletconnect/web3-provider @walletconnect/client

## WalletConnect v2.0

- 支持多链连接（一次连接可用于多个区块链）
- 改进的会话管理
- 更好的性能和可靠性
- 支持更多的链和功能

## 安装包

npm install @walletconnect/web3-provider @walletconnect/client

Web3Provider 是一个完整的 Web3 提供者实现，它将 WalletConnect 功能包装成与 Web3.js 或 ethers.js 兼容的形式。
直接与 Web3.js 或 ethers.js 库集成

Client 是 WalletConnect 协议的核心实现，提供了更底层、更灵活的 API，用于建立和管理 WalletConnect 会话。

## Web3Modal 与 WalletConnect 的关系

WalletConnect 是一个底层协议，而 Web3Modal (特别是 v2 版本) 是由 WalletConnect 团队开发的一个更易用的界面层，它简化了 DApp 与各种钱包的连接过程。

使用 Web3Modal v2 时，您不需要单独安装 WalletConnect，因为它已经被集成在这些包中了。

# wagami提供了什么API

- 配置相关：defaultWagmiConfig，WagmiProvider，wagmiConfig
- 连接相关：useConnect，useAccount，useDisconnect
- 交易相关：useSendTransaction，usePrepareContractWrite
- 事件相关：useAccountListener
- 工具相关：useSwitchNetwork

# 为什么不用指定网络 wagami 也可以知道

Wagmi 使用你在配置中设置的默认网络，或者用户钱包当前连接的网络

当你调用 useReadErc20Name 等 hooks 时，它们会在当前连接的网络上执行查询

当然也可以显示指定

```javascript
const { data: name } = useReadErc20Name({
  address: usdtAddress,
  chainId: 1, // 1 = Ethereum mainnet
})
```
