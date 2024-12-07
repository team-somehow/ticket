
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv'
import { fanScoreSchema } from './schema'
dotenv.config()

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret)
  console.log("TrueApi Instance Created");

  await trueApi.setIssuer(config.issuer.hash)
  console.log("TrueApi Issuer Set");

  return trueApi;
}

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: 'jNpbch5QFSPLMJrwmpkiGxTtvLegA1gJHWYrN8xkSVv8B24',
    secret: process.env.NEXT_PUBLIC_TRUE_NETWORK_SECRET_KEY ?? ''
  },
  issuer: {
    name: 'fanscore',
    hash: '0x681582c4e5bdaf342dcc5cf200d1aa78d46e30c86e96688032149fa87b6ec9b0'
  },
  algorithm: {
    id: 122,
    path: 'acm',
    schemas: [fanScoreSchema]
  },
}
  