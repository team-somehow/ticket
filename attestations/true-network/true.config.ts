
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv'
import { fanScoreSchema } from './schemas'
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
    name: 'true-network-attestations',
    hash: '0xaefb4f5ffd126ef103711880b3c097a561519dedfbdd1012e3ae82fc06c6f151'
  },
  algorithm: {
    id: 116,
    path: 'acm',
    schemas: [fanScoreSchema]
  },
}
  