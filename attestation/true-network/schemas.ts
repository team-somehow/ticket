import { F64, Schema } from '@truenetworkio/sdk';

export const fanScoreSchema = Schema.create({
  topArtistRank: F64,
  topTracks: F64,
  followsArtist: F64,
  songsInPlaylist: F64,
  overlappingTracks: F64,
  similarGenres: F64,
});