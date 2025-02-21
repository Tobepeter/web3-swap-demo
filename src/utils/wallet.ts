import type { Address } from 'viem'
import { formatEther } from 'viem'
import { MockERC20__factory, MockUSDC__factory } from '../../contracts/typechain-types'
import { contract } from './contract'
import { store } from '@/store/store'
// import 'viem/window';

class Wallet {
  isMetaMaskValid() {
    return window.ethereum?.isMetaMask
  }

  /** 连接钱包 */
  async connectWallet() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    return accounts[0] as Address
  }

  /** 余额(wei) */
  async getWei(addr: Address) {
    return contract.publicClient.getBalance({ address: addr })
  }

  /** 余额（ETH）*/
  async getETH(addr: Address) {
    const balance = await this.getWei(addr)
    return formatEther(balance)
  }

  /** 余额 */
  async getBalance(token: TokenType, addr: Address) {
    // return this.getBalance2(token, addr)
    const abi = token === mockERC20 ? MockERC20__factory.abi : MockUSDC__factory.abi
    const tokenAddress = tokenConfig[token].address
    const balance = await contract.publicClient.readContract({
      address: tokenAddress,
      abi,
      functionName: 'balanceOf',
      args: [addr],
    })
    return balance
  }

  async getBalance2(token: TokenType, addr: Address) {
    // TODO: 研究了很久很久，这个就是不通
    //  暂时先不用代码生成的方案了
    //  Uncaught (in promise) Error: contract runner does not support calling (operation="call", code=UNSUPPORTED_OPERATION, version=6.13.5)
    const target = token === mockERC20 ? contract.erc20 : contract.usdc
    return await target.balanceOf(addr)
  }

  /** 铸造 */
  async mint(token: TokenType, addr: Address, amount: bigint) {
    // return this.mint2(token, addr, amount)

    const mockERC20Abi = [
      {
        type: 'function',
        name: 'mint',
        inputs: [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'amount' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
    ] as const

    const { request } = await contract.publicClient.simulateContract({
      address: tokenConfig[token].address,
      // abi: mockERC20Abi,
      abi: token === mockERC20 ? MockERC20__factory.abi : MockUSDC__factory.abi,
      functionName: 'mint',
      args: [addr, amount],
    })

    // 发送交易并等待确认
    const hash = await contract.walletClient.writeContract({
      ...request,
      // TODO: rquest上的地址和这个貌似不一样？
      account: store.getState().address,
    })
    const receipt = await contract.publicClient.waitForTransactionReceipt({ hash })

    console.log('铸造成功', hash, receipt)
    return receipt.status === 'success'
  }

  async mint2(token: TokenType, addr: Address, amount: bigint) {
    const target = token === mockERC20 ? contract.erc20 : contract.usdc
    await target.mint(addr, amount)
  }

  /** 精度 */
  async getDecimals(token: TokenType) {
    const target = token === mockERC20 ? contract.erc20 : contract.usdc
    return await target.decimals()
  }

  /**
   * 切换网络
   * @param chainId 目标链 ID
   */
  async switchNetwork(chainId: number) {
    // TODO: 和本地变量同步起来
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('需要添加网络到 MetaMask')
      }
      throw error
    }
  }

  /**
   * 添加代币到 MetaMask
   * @param tokenAddress 代币合约地址
   * @param symbol 代币符号 (如 USDT、LINK 等)
   * @param decimals 代币精度
   */
  async addToken(tokenAddress: string, symbol: string, decimals: number) {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: [
        {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol,
            decimals,
          },
        },
      ],
    })
  }

  on(name: string, cb: (...args: any[]) => void) {
    window.ethereum.on(name, cb)
  }

  off(name: string, cb: (...args: any[]) => void) {
    window.ethereum.removeListener(name, cb)
  }
}

export const wallet = new Wallet()
