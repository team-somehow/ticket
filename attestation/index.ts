import { getTrueNetworkInstance } from './true-network/true.config';
import { fanScoreSchema } from './true-network/schemas';

const attestFanScoreToUser = async () => {
  const api = await getTrueNetworkInstance();

  const userWallet = '0x13ac115f3e36D51Fc52Cb63AB5E2bB0930729159';

  const attestationData = {
    topArtistRank: 1.0,
    topTracks: 5.0,
    followsArtist: 1.0,
    songsInPlaylist: 10.0,
    overlappingTracks: 3.0,
    similarGenres: 2.0,
  };

  const output = await fanScoreSchema.attest(api, userWallet, attestationData);

  console.log('Attestation Transaction Hash:', output);

  await api.network.disconnect();
};

attestFanScoreToUser();


