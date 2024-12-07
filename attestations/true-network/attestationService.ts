import { getTrueNetworkInstance } from './trueNetwork';
import { fanScoreSchema } from './schemas';

export const attestFanScoreToUser = async (userAddress: string, score: number) => {
  const trueApi = await getTrueNetworkInstance();
  const output = await fanScoreSchema.attest(trueApi, userAddress, {
    fanScore: score,
  });
  console.log('Attestation output:', output);
  await trueApi.network.disconnect();
  return output;
};
