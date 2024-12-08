import { fanScoreSchema } from "./schema";
import { getTrueNetworkInstance } from "./true-network/true.config";

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
  followsArtist: 0.2,
  songsInPlaylist: 0.05,
  overlappingTracks: 0.2,
  similarGenres: 0.15,
};

const calc = async () => {
  const api = await getTrueNetworkInstance();
  console.log("API Instance:", api);

  const ethereumUserWallet = "0x13ac115f3e36D51Fc52Cb63AB5E2bB0930729159";
  console.log("Factor Scores:", factorScores);

  const output = await fanScoreSchema.attest(
    api,
    ethereumUserWallet,
    factorScores
  );

  console.log("Attestation Output:", output);

  const totalWeight = Object.values(factorScores).reduce(
    (acc, score) => acc + score,
    0
  );

  const normalizedWeights = Object.fromEntries(
    Object.entries(factorScores).map(([key, value]) => [
      key,
      value / totalWeight,
    ])
  );

  const fanScore = Object.keys(factorScores).reduce((acc, factor) => {
    return (
      acc +
      factorScores[factor as keyof FactorScores] *
        (normalizedWeights[factor] as number)
    );
  }, 0);

  const fanScorePercentage = fanScore * 100;

  console.log(`Normalized Weights: ${JSON.stringify(normalizedWeights)}`);
  console.log(`Fan Score: ${fanScore}`);
  console.log(`Fan Score Percentage: ${fanScorePercentage}%`);

  await api.network.disconnect();

  return fanScorePercentage;
};

export default calc;
