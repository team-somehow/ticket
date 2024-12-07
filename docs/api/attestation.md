# Attestation System Documentation

The attestation system uses True Network to verify and record fan scores on-chain. This documentation covers the setup, configuration, and usage of the attestation service.

## Configuration Setup

### Environment Variables

```basg
typescript
// Required in attestation/.env
TRUE_NETWORK_SECRET_KEY=your_true_network_key
```
### Base Configuration

```typescript
typescript
// attestation/true-network/true.config.ts
export const config: TrueConfig = {
network: testnet,
account: {
address: 'jNpbch5QFSPLMJrwmpkiGxTtvLegA1gJHWYrN8xkSVv8B24',
secret: process.env.TRUE_NETWORK_SECRET_KEY ?? ''
},
issuer: {
name: 'tn-attestations',
hash: '0x82de693986dc461caf6d9af0d1981a0cba335116e11232cd82501e56f1a1a02d'
}
}
```

## Fan Score Schema
The schema defines the structure of fan score attestations:

```typescript
/ attestation/true-network/schemas.ts
import { F64, Schema } from '@truenetworkio/sdk';
export const fanScoreSchema = Schema.create({
topArtistRank: F64, // Artist ranking in user's top artists
topTracks: F64, // Number of artist's tracks in user's top tracks
followsArtist: F64, // Whether user follows the artist (0 or 1)
songsInPlaylist: F64, // Number of artist's songs in user's playlists
overlappingTracks: F64, // Tracks overlapping with artist's popular tracks
similarGenres: F64 // Number of matching genre preferences
});
```
