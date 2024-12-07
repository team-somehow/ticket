import { F32, Schema, U32 } from '@truenetworkio/sdk';

export const fanScoreSchema = Schema.create({
  topArtistRank: F32,
  topTracks: F32,
  followsArtist: F32,
  songsInPlaylist: F32,
  overlappingTracks: F32,
  similarGenres: F32
});
