import { createPublicClient, createWalletClient, http } from 'viem';
import { soneium_scs } from '@/config';

// Create and export public client
export const publicClient = createPublicClient({
  chain: soneium_scs,
  transport: http(),
});

// Create and export wallet client
export const walletClient = createWalletClient({
  chain: soneium_scs,
  transport: http(),
});
