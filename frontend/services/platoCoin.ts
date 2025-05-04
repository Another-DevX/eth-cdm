import { createPublicClient, erc20Abi, http } from 'viem'
import { soneium_scs } from '@/config'
import { PLATOCOIN_ADDRESS } from '@/constants'

const client = createPublicClient({
  chain: soneium_scs,
  transport: http(),
})

export async function getPlatoCoinBalance(address: `0x${string}`) {
  try {
    const balance = await client.readContract({
      address: PLATOCOIN_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    })
    return balance
  } catch (error) {
    console.error('Error while getting plato coin balance', error)
    throw error
  }
} 