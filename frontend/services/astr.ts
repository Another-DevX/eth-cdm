import { createPublicClient, erc20Abi, http } from 'viem'
import { soneium_scs } from '@/config'
import { ASTR_ADDRESS } from '@/constants'

// Crear cliente público
const client = createPublicClient({
  chain: soneium_scs,
  transport: http(),
})

export async function getASTRBalance(address: `0x${string}`) {
  try {
    const balance = await client.readContract({
      address: ASTR_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    })
    return balance
  } catch (error) {
    console.error('Error al obtener el balance de ASTR:', error)
    throw error
  }
} 