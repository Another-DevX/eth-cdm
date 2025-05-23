import { erc20Abi, WalletClient } from 'viem'
import { soneium_scs } from '@/config'
import { PLATOCOIN_ADDRESS, STAKING_POOL_ADDRESS } from '@/constants'
import { publicClient } from '@/services/client'

// Export the public client for backward compatibility
export const client = publicClient
export async function getPlatoCoinBalance(address: `0x${string}`) {
  try {
    const balance = await client.readContract({
      address: PLATOCOIN_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    })
    console.debug({ balance })
    return balance
  } catch (error) {
    console.error('Error while getting plato coin balance', error)
    throw error
  }
}

export async function approvePlatoCoin(
  amount: bigint,
  account: `0x${string}`,
  walletClient: WalletClient
) {
  try {
    const hash = await walletClient.writeContract({
      chain: soneium_scs,
      address: PLATOCOIN_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [STAKING_POOL_ADDRESS, amount],
      account,
    });
    return hash;
  } catch (error) {
    console.error('Error approving PlatoCoins:', error);
    throw error;
  }
}
