
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { soneium } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = '86e50dcaacf00969397544935c21968d'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Get API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_SCS_API_KEY

export const soneium_scs = {
  ...soneium,
  rpcUrls: {
    default: {
      http: [`https://soneium.rpc.scs.startale.com?apikey=${API_KEY}`]
    }
  }
}

export const networks = [soneium_scs]

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
