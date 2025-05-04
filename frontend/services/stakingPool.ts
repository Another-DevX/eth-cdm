import { createPublicClient, WalletClient, http } from 'viem'
import { soneium_scs } from '@/config'
import { STAKING_POOL_ADDRESS, STAKING_POOL_ABI } from '@/constants'

// Crear cliente público
const publicClient = createPublicClient({
  chain: soneium_scs,
  transport: http(),
})

export async function stake(amount: bigint, account: `0x${string}`, walletClient: WalletClient) {
  try {
    const hash = await walletClient.writeContract({
      chain: soneium_scs,
      address: STAKING_POOL_ADDRESS,
      abi: STAKING_POOL_ABI,
      functionName: 'stake',
      args: [amount],
      account,
    })
    return hash
  } catch (error) {
    console.error('Error al hacer stake:', error)
    throw error
  }
}

export async function givePlatoCoinsToBenefactor(
  coins: bigint, 
  benefactor: `0x${string}`, 
  account: `0x${string}`,
  walletClient: WalletClient
) {
  try {
    const hash = await walletClient.writeContract({
      chain: soneium_scs,
      address: STAKING_POOL_ADDRESS,
      abi: STAKING_POOL_ABI,
      functionName: 'givePlatoCoinsToBenefactor',
      args: [coins, benefactor],
      account,
    })
    return hash
  } catch (error) {
    console.error('Error al dar PlatoCoins al benefactor:', error)
    throw error
  }
}

export async function redeemPlatoCoins(amount: bigint, account: `0x${string}`, walletClient: WalletClient) {
  try {
    const hash = await walletClient.writeContract({
      chain: soneium_scs,
      address: STAKING_POOL_ADDRESS,
      abi: STAKING_POOL_ABI,
      functionName: 'redeemPlatoCoins',
      args: [amount],
      account,
    })
    return hash
  } catch (error) {
    console.error('Error al redimir PlatoCoins:', error)
    throw error
  }
}

export async function getStakedAmount(address: `0x${string}`) {
  try {
    const amount = await publicClient.readContract({
      address: STAKING_POOL_ADDRESS,
      abi: STAKING_POOL_ABI,
      functionName: 'stakedAmount',
      args: [address],
    })
    return amount
  } catch (error) {
    console.error('Error al obtener el monto staked:', error)
    throw error
  }
} 