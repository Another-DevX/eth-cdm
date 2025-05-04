import { createPublicClient, createWalletClient, erc20Abi, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { soneium_scs } from '@/config'
import { PLATOCOIN_ADDRESS } from '@/constants'

// Get private key from environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

// Create account from private key
export const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)

// Create public client
export const client = createPublicClient({
  chain: soneium_scs,
  transport: http(),
})

// Create wallet client with the account
export const walletClient = createWalletClient({
  account,
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
