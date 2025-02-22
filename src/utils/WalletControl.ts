import { store } from '@/store/store'
import { Address, formatEther } from 'viem'
import { MockERC20__factory, MockUSDC__factory } from '../../contracts/typechain-types'
import { contract } from './contract'

class WalletControl {
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
  async getWei(address: Address) {
    return contract.publicClient.getBalance({ address })
  }

  /** 余额（ETH）*/
  async getETH(address: Address) {
    const balance = await this.getWei(address)
    return formatEther(balance)
  }

  /** 余额 */
  async getBalance(token: TokenType, address: Address) {
    // return this.getBalanceV2(token, address)
    const abi = token === TK_ERC20 ? MockERC20__factory.abi : MockUSDC__factory.abi
    const tokenAddress = tokenConfig[token].address
    const balance = await contract.publicClient.readContract({
      address: tokenAddress,
      abi,
      functionName: 'balanceOf',
      args: [address],
    })
    return balance
  }

  async getBalanceV2(token: TokenType, address: Address) {
    // TODO: 研究了很久很久，这个就是不通
    //  暂时先不用代码生成的方案了
    //  Uncaught (in promise) Error: contract runner does not support calling (operation="call", code=UNSUPPORTED_OPERATION, version=6.13.5)
    //  不知道，升级到 ethers v6，可不可行
    const target = token === TK_ERC20 ? contract.erc20 : contract.usdc
    return await target.balanceOf(address)
  }

  /** 铸造 */
  async mint(token: TokenType, address: Address, amount: bigint) {
    // return this.mintV2(token, address, amount)

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
      abi: token === TK_ERC20 ? MockERC20__factory.abi : MockUSDC__factory.abi,
      functionName: 'mint',
      args: [address, amount],
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

  async mintV2(token: TokenType, address: Address, amount: bigint) {
    const target = token === TK_ERC20 ? contract.erc20 : contract.usdc
    await target.mint(address, amount)
  }

  /** 精度 */
  async getDecimals(token: TokenType) {
    const target = token === TK_ERC20 ? contract.erc20 : contract.usdc
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

export const walletControl = new WalletControl()
