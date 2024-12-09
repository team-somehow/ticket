import { fanScoreSchema } from "./true-network/schema";
import { getTrueNetworkInstance } from "./true-network/true.config";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";

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

const calc = async (
  ethereumUserWallet: string,
  userFactorScores: FactorScores = factorScores
) => {
  const api = await getTrueNetworkInstance();
  console.log("API Instance:", api);
  console.log("Factor Scores:", userFactorScores);

  const output = await fanScoreSchema.attest(
    api,
    ethereumUserWallet,
    userFactorScores
  );

  console.log("Attestation Output:", output);

  const totalWeight = Object.values(userFactorScores).reduce(
    (acc, score) => acc + score,
    0
  );

  const normalizedWeights = Object.fromEntries(
    Object.entries(userFactorScores).map(([key, value]) => [
      key,
      value / totalWeight,
    ])
  );

  const fanScore = Object.keys(userFactorScores).reduce((acc, factor) => {
    return (
      acc +
      userFactorScores[factor as keyof FactorScores] *
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

const app = express();
app.use(express.json());
app.use(cors());

app.post("/calculate-fan-score", async (req: Request, res: Response) => {
  try {
    const { ethereumUserWallet, factorScores: userFactorScores } = req.body;

    // Validate required parameters
    if (!ethereumUserWallet) {
      return res.status(400).json({ error: "ethereumUserWallet is required" });
    }

    // Validate factor scores if provided
    if (userFactorScores) {
      const requiredFactors = [
        "topArtistRank",
        "topTracks",
        "followsArtist",
        "songsInPlaylist",
        "overlappingTracks",
        "similarGenres",
      ];

      const missingFactors = requiredFactors.filter(
        (factor) => !(factor in userFactorScores)
      );
      if (missingFactors.length > 0) {
        return res.status(400).json({
          error: "Invalid factorScores object",
          missingFactors,
        });
      }
    }

    const result = await calc(ethereumUserWallet, userFactorScores);
    res.json({ fanScorePercentage: result });
  } catch (error) {
    console.error("Error calculating fan score:", error);
    res.status(500).json({
      error: "Failed to calculate fan score",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default calc;
