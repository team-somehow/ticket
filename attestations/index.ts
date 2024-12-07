import { attestFanScoreToUser } from './true-network/attestationService';
import { F32, F64 } from '@truenetworkio/sdk';
import { getTrueNetworkInstance } from './true-network/true.config';
import { fanScoreSchema } from './true-network/schemas';

type FactorScores = {
  topArtistRank: number;
  topTracks: number;
  followsArtist: number;
  songsInPlaylist: number;
  overlappingTracks: number;
  similarGenres: number;
};

const factorScores: FactorScores = {
  topArtistRank: 0.25,
  topTracks: 0.15,
  followsArtist: 0.20,
  songsInPlaylist: 0.05,
  overlappingTracks: 0.20,
  similarGenres: 0.15,
};

export async function calc(): Promise<number> {
  const api = await getTrueNetworkInstance();
  const ethereumUserWallet = '0x13ac115f3e36D51Fc52Cb63AB5E2bB0930729159';

  await fanScoreSchema.attest(api, ethereumUserWallet, factorScores);

  const totalWeight = Object.values(factorScores).reduce((acc, score) => acc + score, 0);

  const normalizedWeights = Object.fromEntries(
    Object.entries(factorScores).map(([key, value]) => [key, value / totalWeight])
  );

  const fanScore = Object.keys(factorScores).reduce((acc, factor) => {
    return acc + factorScores[factor as keyof FactorScores] * (normalizedWeights[factor] as number);
  }, 0);

  const fanScorePercentage = fanScore * 100;

  console.log(`Normalized Weights: ${JSON.stringify(normalizedWeights)}`);
  console.log(`Fan Score: ${fanScore}`);
  console.log(`Fan Score Percentage: ${fanScorePercentage}`);

  return fanScorePercentage;
}

calc();