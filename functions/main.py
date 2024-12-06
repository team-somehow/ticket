import os
import requests
from firebase_functions import https_fn
from google.cloud import firestore
from spotify.auth import spotify_login, spotify_callback
from spotify.utils import get_spotify_data, calculate_fan_score_algorithm
import json
from dotenv import load_dotenv

load_dotenv()

db = firestore.Client()

FIREBASE_FUNCTIONS_BASE_URL = os.getenv("FIREBASE_FUNCTIONS_BASE_URL")
FRONTEND = os.getenv("FRONTEND")


@https_fn.on_request()
def login(request: https_fn.Request) -> https_fn.Response:
    response = spotify_login(
        request) 
    return response


@https_fn.on_request()
def callback(request: https_fn.Request) -> https_fn.Response:
    tokens_response = spotify_callback(request)
    print(tokens_response)
    tokens = json.loads(tokens_response)
    access_token = tokens.get('access_token')
    refresh_token = tokens.get('refresh_token')

    # Retrieve user's Spotify profile to get user ID
    user_profile_response = requests.get(
        'https://api.spotify.com/v1/me',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if user_profile_response.status_code != 200:
        return https_fn.Response("Failed to retrieve user profile.", status=500)

    user_profile = user_profile_response.json()
    user_id = user_profile.get('id')

    # Store tokens and user profile in Firestore
    data_to_store = {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user_profile': user_profile,
    }

    try:
        doc_ref = db.collection('spotify_users').document(user_id)
        doc_ref.set(data_to_store)
    except Exception as e:
        return https_fn.Response(f"Failed to store data in Firestore: {e}", status=500)

    # Redirect to the third function for fan score calculation, passing user_id and artist_name as params
    return https_fn.Response(
        status=302,
        headers={
            "Location": f"{FRONTEND}/redirect?spotify_user_id={user_id}"
        }
    )


@https_fn.on_request()
def calculate_fan_score(request: https_fn.Request) -> https_fn.Response:
    """
    Retrieves data from Firestore, calculates the fan score, stores results, and returns the score.
    """
    user_id = request.args.get('user_id')
    artist_name = request.args.get('artist_name', 'Karan Aujla')
    print(user_id)
    if not user_id:
        return https_fn.Response("User ID not provided.", status=400)
    if not artist_name:
        return https_fn.Response("Artist name not provided.", status=400)

    try:
        doc_ref = db.collection('spotify_users').document(user_id)
        user_data = doc_ref.get().to_dict()
        if not user_data:
            return https_fn.Response("User data not found.", status=404)
    except Exception as e:
        return https_fn.Response(f"Failed to retrieve user data from Firestore: {e}", status=500)

    # Use the access token from Firestore
    access_token = user_data.get('access_token')
    if not access_token:
        return https_fn.Response("Access token not found.", status=500)

    # Retrieve Spotify data for the given artist
    spotify_data = get_spotify_data(access_token, artist_name)
    if not spotify_data:
        return https_fn.Response("Failed to retrieve Spotify data.", status=500)

    # Calculate fan score
    fan_score, factor_scores = calculate_fan_score_algorithm(spotify_data)
    print(f"{artist_name} : {fan_score}")

    # Store fan score and factor scores in Firestore
    try:
        doc_ref.update({
            'artist_name': artist_name,
            'spotify_data': spotify_data,
            'fan_score': fan_score,
            'factor_scores': factor_scores,
        })
    except Exception as e:
        return https_fn.Response(f"Failed to store fan score in Firestore: {e}", status=500)

    # Return the fan score and factor scores as a JSON response
    return https_fn.Response(
        json.dumps({
            'artist_name': artist_name,
            'fan_score': fan_score,
            'factor_scores': factor_scores,
        }),
        status=200,
        headers={
            'Access-Control-Allow-Origin': '*',  # Allow all origins for testing
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    )


