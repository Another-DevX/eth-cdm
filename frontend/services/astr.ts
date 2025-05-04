import { createPublicClient, erc20Abi, http, WalletClient } from 'viem'
import { soneium_scs } from '@/config'
import { ASTR_ADDRESS, STAKING_POOL_ADDRESS } from '@/constants'

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

export async function getASTRAllowance(address: `0x${string}`) {
  try {
    const allowance = await client.readContract({
      address: ASTR_ADDRESS,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, STAKING_POOL_ADDRESS],
    })
    return allowance
  } catch (error) {
    console.error('Error al obtener el allowance de ASTR:', error)
    throw error
  }
}

export async function approveASTR(
  amount: bigint,
  account: `0x${string}`,
  walletClient: WalletClient
) {
  try {
    const hash = await walletClient.writeContract({
      chain: soneium_scs,
      address: ASTR_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [STAKING_POOL_ADDRESS, amount],
      account,
    })
    return hash
  } catch (error) {
    console.error('Error al aprobar ASTR:', error)
    throw error
  }
}

export async function approveSpender(
  spender: `0x${string}`,
  amount: bigint,
  account: `0x${string}`,
  walletClient: any
) {
  try {
    const hash = await walletClient.writeContract({
      chain: soneium_scs,
      address: ASTR_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
      account,
    })
    return hash
  } catch (error) {
    console.error('Error al aprobar el gasto de ASTR:', error)
    throw error
  }
}

export async function getAllowance(
  owner: `0x${string}`,
  spender: `0x${string}`
) {
  try {
    const allowance = await client.readContract({
      address: ASTR_ADDRESS,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [owner, spender],
    })
    return allowance
  } catch (error) {
    console.error('Error al obtener la asignación de ASTR:', error)
    throw error
  }
} 