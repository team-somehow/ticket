
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv'
dotenv.config()

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret)

  await trueApi.setIssuer(config.issuer.hash)

  return trueApi;
}

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: 'jNpbch5QFSPLMJrwmpkiGxTtvLegA1gJHWYrN8xkSVv8B24',
    secret: process.env.TRUE_NETWORK_SECRET_KEY ?? ''
  },
  issuer: {
    name: 'tn-attestations',
    hash: '0x82de693986dc461caf6d9af0d1981a0cba335116e11232cd82501e56f1a1a02d'
  },
  algorithm: {
    id: undefined,
    path: undefined,
    schemas: []
  },
}
  