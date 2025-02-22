import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-viem'

import dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'
import { HttpNetworkUserConfig } from 'hardhat/types'

dotenv.config()

// TODO: 环境变量配置 ts intelisense

// NOTE: sepolia private key only for test
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY

// @docs: https://infura.io
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL

// @docs: https://docs.etherscan.io/sepolia-etherscan
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  // NOTE: 其实 typechain 不需要 sepolia network 配置也可以工作
  //  但是如果传递 有 undefined 内容的 sepolia 字段会导致报错
  networks:
    SEPOLIA_RPC_URL && SEPOLIA_PRIVATE_KEY
      ? {
          sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SEPOLIA_PRIVATE_KEY],
          },
        }
      : {},
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
}

export default config
