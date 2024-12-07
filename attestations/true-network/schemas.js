"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fanScoreSchema = void 0;
var sdk_1 = require("@truenetworkio/sdk");
exports.fanScoreSchema = sdk_1.Schema.create({
    topArtistRank: sdk_1.F32,
    topTracks: sdk_1.F32,
    followsArtist: sdk_1.F32,
    songsInPlaylist: sdk_1.F32,
    overlappingTracks: sdk_1.F32,
    similarGenres: sdk_1.F32
});
