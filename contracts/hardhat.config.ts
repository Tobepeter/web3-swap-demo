import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'

dotenv.config()

// NOTE: sepolia private key only for test
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY

// @docs: https://infura.io
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL

// @docs: https://docs.etherscan.io/sepolia-etherscan
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
}

// TODO: 有条件本地持有这些信息，方便前端使用

/**
合约部署完成！
-------------------
部署地址汇总：
MockERC20: 0x5FbDB2315678afecb367f032d93F642f64180aa3
MockUSDC: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
MockUniswapV2Pair: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
 */

export default config
