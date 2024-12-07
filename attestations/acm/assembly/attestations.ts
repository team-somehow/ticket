
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class FANSCORESCHEMA {
  topTracks: f32;
  topArtistRank: f32;
  songsInPlaylist: f32;
  similarGenres: f32;
  overlappingTracks: f32;
  followsArtist: f32;

  constructor() {
    this.topTracks = readMemory<f32>(0);
    this.topArtistRank = readMemory<f32>(4);
    this.songsInPlaylist = readMemory<f32>(8);
    this.similarGenres = readMemory<f32>(12);
    this.overlappingTracks = readMemory<f32>(16);
    this.followsArtist = readMemory<f32>(20);
  }
}


export class Attestations {
  static fanScoreSchema: FANSCORESCHEMA = new FANSCORESCHEMA();
}
