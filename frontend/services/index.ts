// Import all services
import rewardsService from './rewards';

// Re-export services from other files that might exist in the services directory
// These are common services that might exist in a Next.js project
import { client as publicClient, walletClient } from './client';
import * as astrService from './astr';
import * as platoCoinService from './platoCoin';
import * as stakingPoolService from './stakingPool';

// Export all services
export {
  rewardsService,
  publicClient,
  walletClient,
  astrService,
  platoCoinService,
  stakingPoolService
};
