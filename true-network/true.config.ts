import { TrueApi, testnet } from "@truenetworkio/sdk";
import { TrueConfig } from "@truenetworkio/sdk/dist/utils/cli-config";

// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from "dotenv";
import { fanScoreSchema } from "./schema";
dotenv.config();

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret);

  await trueApi.setIssuer(config.issuer.hash);

  return trueApi;
};

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: "jNpbch5QFSPLMJrwmpkiGxTtvLegA1gJHWYrN8xkSVv8B24",
    secret: process.env.TRUE_NETWORK_SECRET_KEY ?? "",
  },
  issuer: {
    name: "hussain",
    hash: "0xfa368cf2f63f0626c582816b7fc6eab5616069e04980bec4995c340fa2e3c117",
  },
  algorithm: {
    id: undefined,
    path: "acm",
    schemas: [fanScoreSchema],
  },
};
