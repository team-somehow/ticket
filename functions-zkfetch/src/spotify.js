// src/spotify.js
const { ReclaimClient } = require("@reclaimprotocol/zk-fetch");

const client = new ReclaimClient(
  "0x38E594b01D27F833A66b6F9120A86e98b99e11d4",
  "0xafcba4c97766556e55abcc7a3d77bab9f64a94e352200da8c1b96ce731d60b04"
);

async function getSpotifyData(accessToken, artistName) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
  };

  // Function to perform zkFetch and parse JSON response
  async function zkFetchJson(url, options) {
    const proof = await client.zkFetch(url, options);
    return JSON.parse(proof.response);
  }

  // Search for the artist
  const searchParams = new URLSearchParams({
    q: artistName,
    type: "artist",
    limit: 1,
  });
  const searchUrl = `https://api.spotify.com/v1/search?${searchParams.toString()}`;
  const searchResults = await zkFetchJson(searchUrl, {
    method: "GET",
    headers,
  });

  if (!searchResults.artists || !searchResults.artists.items.length) {
    return null;
  }

  const artistInfo = searchResults.artists.items[0];
  const artistId = artistInfo.id;
  const artistGenres = artistInfo.genres || [];

  // Get user's top artists
  const topArtistsUrl = "https://api.spotify.com/v1/me/top/artists?limit=50";
  const topArtistsItems =
    (await zkFetchJson(topArtistsUrl, { method: "GET", headers })).items || [];
  const topArtists = topArtistsItems.map((artist) => ({
    name: artist.name,
    id: artist.id,
    genres: artist.genres || [],
  }));

  // Get user's top tracks
  const topTracksUrl = "https://api.spotify.com/v1/me/top/tracks?limit=50";
  const topTracksItems =
    (await zkFetchJson(topTracksUrl, { method: "GET", headers })).items || [];
  const topTracks = topTracksItems.map((track) => ({
    name: track.name,
    id: track.id,
    artist_names: track.artists.map((artist) => artist.name),
    artist_ids: track.artists.map((artist) => artist.id),
  }));

  // Check if user follows the artist
  const followsParams = new URLSearchParams({ type: "artist", ids: artistId });
  const followsUrl = `https://api.spotify.com/v1/me/following/contains?${followsParams.toString()}`;
  const followsArtist = (
    await zkFetchJson(followsUrl, { method: "GET", headers })
  )[0];

  // Get user's playlists and their tracks
  let playlists = [];
  let nextUrl = "https://api.spotify.com/v1/me/playlists?limit=20";
  while (nextUrl) {
    const playlistsResponse = await zkFetchJson(nextUrl, {
      method: "GET",
      headers,
    });
    playlists = playlists.concat(playlistsResponse.items || []);
    nextUrl = playlistsResponse.next;
    if (playlists.length >= 30) {
      playlists = playlists.slice(0, 30);
      break;
    }
  }

  let playlistTracks = [];
  for (const playlist of playlists) {
    try {
      let tracksUrl = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100`;
      while (tracksUrl) {
        const tracksResponse = await zkFetchJson(tracksUrl, {
          method: "GET",
          headers,
        });
        const items = tracksResponse.items || [];
        for (const item of items) {
          const track = item.track;
          if (track && track.id) {
            playlistTracks.push({
              name: track.name,
              id: track.id,
              artist_names: track.artists.map((artist) => artist.name),
              artist_ids: track.artists.map((artist) => artist.id),
            });
          }
        }
        tracksUrl = tracksResponse.next;
      }
    } catch (e) {
      // Handle errors if necessary
    }
  }

  // Determine if user listens to similar genres
  const userGenres = new Set();
  for (const artist of topArtists) {
    artist.genres.forEach((genre) => userGenres.add(genre));
  }
  const listensToSimilarGenres = artistGenres.some((genre) =>
    userGenres.has(genre)
  );

  return {
    artist_id: artistId,
    top_artists: topArtists,
    top_tracks: topTracks,
    follows_artist: followsArtist,
    playlist_tracks: playlistTracks,
    listens_to_similar_genres: listensToSimilarGenres,
  };
}

module.exports = { getSpotifyData };
