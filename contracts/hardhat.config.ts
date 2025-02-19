import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'

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

export default config
