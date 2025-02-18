import { ethers, network, run } from 'hardhat'

async function deployMockERC20() {
  const MockERC20 = await ethers.getContractFactory('MockERC20')
  const mockERC20 = await MockERC20.deploy()
  await mockERC20.waitForDeployment()
  return mockERC20
}

async function deployMockUSDC() {
  const MockUSDC = await ethers.getContractFactory('MockUSDC')
  const mockUSDC = await MockUSDC.deploy()
  await mockUSDC.waitForDeployment()
  return mockUSDC
}

async function deployMockUniswapV2Pair(mockERC20: any, mockUSDC: any) {
  const MockUniswapV2Pair = await ethers.getContractFactory('MockUniswapV2Pair')
  const mockUniswapV2Pair = await MockUniswapV2Pair.deploy(await mockERC20.getAddress(), await mockUSDC.getAddress())
  await mockUniswapV2Pair.waitForDeployment()
  return mockUniswapV2Pair
}

async function main() {
  console.log('开始部署合约...')
  console.log(`当前网络: ${network.name}`)

  // 部署 MockERC20
  const mockERC20 = await deployMockERC20()

  // 部署 MockUSDC
  const mockUSDC = await deployMockUSDC()

  // 部署 MockUniswapV2Pair
  const mockUniswapV2Pair = await deployMockUniswapV2Pair(mockERC20, mockUSDC)

  console.log('\n合约部署完成！')
  console.log('-------------------')
  console.log('部署地址汇总：')
  console.log(`MockERC20: ${await mockERC20.getAddress()}`)
  console.log(`MockUSDC: ${await mockUSDC.getAddress()}`)
  console.log(`MockUniswapV2Pair: ${await mockUniswapV2Pair.getAddress()}`)

  // 只在非本地网络（如 sepolia）上等待确认和验证合约
  if (network.name !== 'hardhat' && network.name !== 'localhost') {
    // 等待区块确认
    console.log('\n等待区块确认...')
    await mockERC20.deploymentTransaction()?.wait(5)
    await mockUSDC.deploymentTransaction()?.wait(5)
    await mockUniswapV2Pair.deploymentTransaction()?.wait(5)

    // 验证合约
    console.log('\n开始验证合约...')
    try {
      await run('verify:verify', {
        address: await mockERC20.getAddress(),
        constructorArguments: [],
      })

      await run('verify:verify', {
        address: await mockUSDC.getAddress(),
        constructorArguments: [],
      })

      await run('verify:verify', {
        address: await mockUniswapV2Pair.getAddress(),
        constructorArguments: [await mockERC20.getAddress(), await mockUSDC.getAddress()],
      })

      console.log('合约验证完成！')
    } catch (error) {
      console.error('合约验证失败:', error)
    }
  }
}

main()