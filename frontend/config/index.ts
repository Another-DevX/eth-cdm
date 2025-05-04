
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {soneium} from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = '86e50dcaacf00969397544935c21968d'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [soneium]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
