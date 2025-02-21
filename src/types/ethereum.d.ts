// import type { EIP1193Provider } from 'viem'
import type { MetaMaskInpageProvider } from '@metamask/providers'

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider
  }
}
