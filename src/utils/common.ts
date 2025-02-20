import { Address } from 'viem'

export const isEmptyAddress = (address: Address): boolean => {
  return address === '0x0' || !address
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const nextFrame = () => {
  return new Promise(resolve => requestAnimationFrame(resolve))
}
