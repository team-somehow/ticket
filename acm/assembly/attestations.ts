
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class FANSCORESCHEMA {
  topTracks: f64;
  topArtistRank: f64;
  songsInPlaylist: f64;
  similarGenres: f64;
  overlappingTracks: f64;
  followsArtist: f64;

  constructor() {
    this.topTracks = readMemory<f64>(0);
    this.topArtistRank = readMemory<f64>(8);
    this.songsInPlaylist = readMemory<f64>(16);
    this.similarGenres = readMemory<f64>(24);
    this.overlappingTracks = readMemory<f64>(32);
    this.followsArtist = readMemory<f64>(40);
  }
}


export class Attestations {
  static fanScoreSchema: FANSCORESCHEMA = new FANSCORESCHEMA();
}
