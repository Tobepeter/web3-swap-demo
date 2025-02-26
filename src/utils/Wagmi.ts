import { createWeb3Modal, defaultWagmiConfig, useWeb3Modal } from '@web3modal/wagmi/react'
import { mainnet, sepolia } from 'wagmi/chains'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { Address } from 'viem'
import Mitt from 'mitt'
import { metaMask, walletConnect } from 'wagmi/connectors'

export class Wagmi {
  // https://cloud.reown.com/app/account
  projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
  onConnect?: (address: string) => void
  onDisconnect?: () => void
  mitt = Mitt<WagmiEventMap>()

  enable = true

  config = defaultWagmiConfig({
    chains: [sepolia],
    projectId: this.projectId,
    metadata: {
      name: 'Web3 Swap Demo', // TODO: add env
      description: 'Web3 Swap Demo Application',
      url: 'https://tobepeter.github.io/web3-swap-demo/', // 你的网站 URL
      icons: ['https://avatars.githubusercontent.com/u/34265941?v=4'],
    },
  })

  initWeb3Modal() {
    if (!this.projectId) {
      console.error('wallet connect projectId is not set')
      return
    }

    createWeb3Modal({
      wagmiConfig: this.config,
      projectId: this.projectId,
      themeMode: 'dark',
      chainImages: {},
    })
  }

  open: ReturnType<typeof useWeb3Modal>['open']

  useAccountListener() {
    const { address, isConnected } = useAccount()

    useEffect(() => {
      if (isConnected && address) {
        this.mitt.emit(WagmiEvent.Connect, address)
      } else {
        this.mitt.emit(WagmiEvent.Disconnect)
      }
    }, [address, isConnected])
  }
}

export enum WagmiEvent {
  Connect = 'connect',
  Disconnect = 'disconnect',
}

export type WagmiEventMap = {
  [WagmiEvent.Connect]: Address
  [WagmiEvent.Disconnect]: undefined
}
