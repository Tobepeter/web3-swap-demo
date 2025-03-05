# 项目运行

```bash
npm install
npm run dev
```

# 合约开发

contracts 目录下，使用 solidity 语言 + hardhat 框架

支持一键 deploy 脚本，部署后生成的合约地址，自动复制到前端项目中使用

contracts 使用额外使用 viem 插件，因为客户端用了 viem（代替 ethers.js）

contracts 中 typechain 是类型文件，abi 接口，供前端使用

# 前端开发

使用的 vite + react + react-router + tailwindcss + typescript + prettier + eslint

组件库使用了 antd

使用 vitest 自动化测试框架

使用 zustand 状态管理

钱包协议使用 metaMask

使用 viem 代替 ethers 处理货币运算，client RPC（最大特点用了原生的 bigInt 代替 ethers.BigNumber）

使用 sepolia 测试网络

使用 github action 自动化部署

# 项目结构

- /contracts 合约开发
- /src 前端开发
- /.github 自动化部署
- /docs 文档，以及git提示学习记录

# 预览地址

https://tobepeter.github.io/web3-swap-demo/
