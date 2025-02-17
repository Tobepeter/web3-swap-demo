import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

// dotenv.config();

// const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
// const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  // networks: {
  //   sepolia: {
  //     url: SEPOLIA_RPC_URL,
  //     accounts: [SEPOLIA_PRIVATE_KEY],
  //   },
  // },
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY,
  // },
};

export default config;
