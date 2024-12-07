import { TrueApi } from '@truenetworkio/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const privateKey = process.env.TRUE_NETWORK_PRIVATE_KEY;
  const issuerHash = process.env.TRUE_NETWORK_ISSUER_HASH;

  if (!privateKey || !issuerHash) {
    throw new Error('Missing True Network configuration in environment variables.');
  }

  const trueApi = await TrueApi.create(privateKey);
  trueApi.setIssuer(issuerHash);
  return trueApi;
};
