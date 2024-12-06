import requests

def calculate_fan_score_algorithm(user_data):
    factor_scores = {}
    weights = {
        'top_artist_rank': 0.25,
        'top_tracks': 0.15,
        'follows_artist': 0.20,
        'songs_in_playlists': 0.15,
        'overlapping_tracks': 0.15,
        'similar_genres': 0.10
    }

    # Top Artist Rank Score
    top_artists = user_data['top_artists']
    artist_id = user_data['artist_id']
    artist_ids = [artist['id'] for artist in top_artists]
    if artist_id in artist_ids[:5]:
        rank = artist_ids.index(artist_id) + 1
        factor_scores['top_artist_rank'] = (6 - rank) / 5
    else:
        factor_scores['top_artist_rank'] = 0.0

    top_tracks = user_data['top_tracks'][:10]
    total_top_tracks = len(top_tracks)
    artist_tracks_in_top = [
        track for track in top_tracks if artist_id in track['artist_ids']
    ]
    factor_scores['top_tracks'] = (
        len(artist_tracks_in_top) / total_top_tracks
        if total_top_tracks > 0 else 0.0
    )

    factor_scores['follows_artist'] = (
        1.0 if user_data['follows_artist'] else 0.0
    )

    artist_songs_in_playlists = [
        track for track in user_data['playlist_tracks']
        if artist_id in track['artist_ids']
    ]
    num_songs_in_playlists = len(artist_songs_in_playlists)
    factor_scores['songs_in_playlists'] = min(
        num_songs_in_playlists / 20.0, 1.0
    )

    artist_top_track_ids = get_artist_top_tracks(
        artist_id, user_data['access_token']
    )
    user_top_track_ids = [track['id'] for track in top_tracks]
    overlapping_tracks = set(user_top_track_ids).intersection(
        set(artist_top_track_ids)
    )
    factor_scores['overlapping_tracks'] = min(
        len(overlapping_tracks) / 10.0, 1.0
    )

    factor_scores['similar_genres'] = (
        1.0 if user_data['listens_to_similar_genres'] else 0.0
    )

    total_weight = sum(weights.values())
    normalized_weights = {
        k: v / total_weight for k, v in weights.items()
    }

    fan_score = sum(
        factor_scores[factor] * normalized_weights[factor]
        for factor in factor_scores
    )
    fan_score_percentage = fan_score * 100

    factor_scores_percentage = {
        factor: score * 100 for factor, score in factor_scores.items()
    }

    return fan_score_percentage, factor_scores_percentage

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
