import requests


def get_spotify_data(access_token, artist_name):
    headers = {"Authorization": f"Bearer {access_token}"}

    search_response = requests.get(
        "https://api.spotify.com/v1/search",
        headers=headers,
        params={'q': artist_name, 'type': 'artist', 'limit': 1}
    )
    search_results = search_response.json()
    if not search_results.get('artists', {}).get('items'):
        return None 
    artist_info = search_results['artists']['items'][0]
    artist_id = artist_info['id']
    artist_genres = artist_info.get('genres', [])

    top_artists_response = requests.get(
        "https://api.spotify.com/v1/me/top/artists?limit=50",
        headers=headers
    )
    top_artists_items = top_artists_response.json().get('items', [])
    top_artists = [
        {
            'name': artist['name'],
            'id': artist['id'],
            'genres': artist.get('genres', [])
        }
        for artist in top_artists_items
    ]

    top_tracks_response = requests.get(
        "https://api.spotify.com/v1/me/top/tracks?limit=50",
        headers=headers
    )
    top_tracks_items = top_tracks_response.json().get('items', [])
    top_tracks = []
    for track in top_tracks_items:
        artist_ids = [artist['id'] for artist in track['artists']]
        top_tracks.append({
            'name': track['name'],
            'id': track['id'],
            'artist_names': [artist['name'] for artist in track['artists']],
            'artist_ids': artist_ids
        })

    follows_response = requests.get(
        "https://api.spotify.com/v1/me/following/contains",
        headers=headers,
        params={'type': 'artist', 'ids': artist_id}
    )
    follows_artist = follows_response.json()[0]

    playlists = []
    next_url = "https://api.spotify.com/v1/me/playlists?limit=20"
    while next_url:
        playlists_response = requests.get(next_url, headers=headers).json()
        playlists.extend(playlists_response.get('items', []))
        next_url = playlists_response.get('next')
        if len(playlists) >= 30:
            playlists = playlists[:30]
            break
    # print("PLAYLISTS:",playlists[:2])
    playlist_tracks = []
    for playlist in playlists:
        # print(playlist)
        try:
            playlist_id = playlist['id']
            tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=100"
            while tracks_url:
                tracks_response = requests.get(tracks_url, headers=headers).json()
                items = tracks_response.get('items', [])
                for item in items:
                    track = item.get('track')
                    if track and track.get('id'):
                        artist_ids = [artist['id'] for artist in track['artists']]
                        playlist_tracks.append({
                            'name': track['name'],
                            'id': track['id'],
                            'artist_names': [artist['name'] for artist in track['artists']],
                            'artist_ids': artist_ids
                        })
                tracks_url = tracks_response.get('next')
        except Exception as e:
            pass

    user_genres = set()
    for artist in top_artists:
        user_genres.update(artist.get('genres', []))
    listens_to_similar_genres = bool(
        user_genres.intersection(artist_genres)
    )

    return {
        'access_token': access_token,
        'artist_id': artist_id,
        'top_artists': top_artists,
        'top_tracks': top_tracks,
        'follows_artist': follows_artist,
        'playlist_tracks': playlist_tracks,
        'listens_to_similar_genres': listens_to_similar_genres
    }

def get_artist_top_tracks(artist_id, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(
        f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks",
        headers=headers,
        params={'market': 'from_token'}
    )
    tracks = response.json().get('tracks', [])
    track_ids = [track['id'] for track in tracks]
    return track_ids
