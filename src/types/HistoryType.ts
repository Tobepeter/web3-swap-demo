export enum TransactionEvent {
  Swap = 'Swap',
  AddLiquidity = 'AddLiquidity',
  RemoveLiquidity = 'RemoveLiquidity',
}

export interface TransactionHistory {
  txHash: string
  timestamp?: number
  sender: string
  eventName: TransactionEvent

  swap?: {
    amount0In: bigint
    amount1In: bigint
    amount0Out: bigint
    amount1Out: bigint
    to: string
  }

  liquidity?: {
    isAdd: boolean
    amount0: bigint
    amount1: bigint
    liquidity: bigint
  }
}
