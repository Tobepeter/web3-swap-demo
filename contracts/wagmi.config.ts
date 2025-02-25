import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { hardhat } from '@wagmi/cli/plugins'
import path from 'path'

export default defineConfig({
  out: path.resolve(__dirname, '../src/generated.ts'),
  plugins: [
    // 使用 React 插件生成 hooks
    react(),

    // 从本地 Hardhat 项目生成
    hardhat({
      project: './',

      // TODO: 貌似还可以帮忙部署合约
    }),

    // 或从 Foundry 项目生成
    // foundry({
    //   project: './path-to-foundry-project',
    // }),

    // 或从 Etherscan 获取 ABI
    // etherscan({
    //   apiKey: process.env.ETHERSCAN_API_KEY,
    //   chainId: mainnet.id,
    //   contracts: [
    //     {
    //       name: 'ERC20',
    //       address: '0x...',
    //     },
    //   ],
    // }),

    // 也可以直接使用 ABI
    // {
    //   name: 'erc20',
    //   artifacts: [
    //     {
    //       name: 'ERC20',
    //       abi: erc20Abi,
    //     },
    //   ],
    // },
  ],
})
