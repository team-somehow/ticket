import os
import requests
from firebase_functions import https_fn
from google.cloud import firestore
from spotify.auth import spotify_login, spotify_callback
from spotify.utils import get_spotify_data, calculate_fan_score_algorithm
from storage.akave import api_request
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

load_dotenv()

db = firestore.Client()

cred = credentials.Certificate("./personal-projects-e8a07-firebase-adminsdk-njygj-2bd32f3018.json")
firebase_admin.initialize_app(cred)

AGGREGATOR_URL = os.getenv("WALRUS_AGGREGATOR_URL")  
PUBLISHER_URL = os.getenv("WALRUS_PUBLISHER_URL") 

FIREBASE_FUNCTIONS_BASE_URL = os.getenv("FIREBASE_FUNCTIONS_BASE_URL")
FRONTEND = os.getenv("FRONTEND")
API_BASE_URL=os.getenv("AKAVE_BASE_URL")


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


@https_fn.on_request()
def event_status(request: https_fn.Request) -> https_fn.Response:
    user_id = request.args.get('user_id')
    event_name = request.args.get('event_name')
    if not user_id:
        return https_fn.Response("User ID not provided.", status=400)
    if not event_name:
        return https_fn.Response("Event name not provided.", status=400)
    
    try:
        # Placeholder logic for event status
        placeholder_status = "Result Pending"  # Replace with Firestore logic later
        
        response_data = {
            "user_id": user_id,
            "event_name": event_name,
            "status": placeholder_status
        }
        return https_fn.Response(
            json.dumps(response_data),
            status=200,
            headers={
                'Access-Control-Allow-Origin': '*',  # Allow all origins for testing
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )
    except Exception as e:
        return https_fn.Response(f"Failed to retrieve event status: {e}", status=500)
    
@https_fn.on_request()
def get_ticket(request: https_fn.Request) -> https_fn.Response:
    """
    Retrieves the ticket for a specific event as a QR code.
    """
    user_id = request.args.get('user_id')
    event_name = request.args.get('event_name')
    if not user_id:
        return https_fn.Response("User ID not provided.", status=400)
    if not event_name:
        return https_fn.Response("Event name not provided.", status=400)

    try:
        # Placeholder QR code URL from your repository
        qr_code_url = "https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png"

        response_data = {
            "user_id": user_id,
            "event_name": event_name,
            "ticket_url": qr_code_url,
            "message": f"Here is your ticket for {event_name}."
        }
        return https_fn.Response(
            json.dumps(response_data),
            status=200,
            headers={
                'Access-Control-Allow-Origin': '*',  # Allow all origins for testing
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )
    except Exception as e:
        return https_fn.Response(f"Failed to retrieve ticket: {e}", status=500)

@https_fn.on_request()
def create_bucket_akave(request):
    """Create a bucket in Akave storage."""
    bucket_name = request.get_json()    
    print("bucket: ",bucket_name)
    url = f"{API_BASE_URL}/buckets"
    payload = {"bucketName": bucket_name}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    return response.json()


@https_fn.on_request()
def list_buckets_akave(request: https_fn.Request) -> https_fn.Response:
    """List all buckets in Akave storage."""
    url = f"{API_BASE_URL}/buckets"
    api_response = requests.get(url)
    data = api_response.json()

    return https_fn.Response(
        json.dumps(data),
        status=200,
        headers={
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    )

@https_fn.on_request()
def upload_file_akave(bucket_name, file_path):
    """Upload a file to Akave storage."""
    url = f"{API_BASE_URL}/buckets/{bucket_name}/files"
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files)
    return response.json()



@https_fn.on_request()
def upload_file_walrus(request: https_fn.Request) -> https_fn.Response:
    """
    Upload a file to the decentralized storage using the PUBLISHER endpoint.
    Expects:
    - Optional query param: epochs (int)
    - Form-data with a 'file' field.

    Returns: JSON response from the publisher endpoint.
    """
    # Get the epochs parameter from query params, default to 1 if not provided
    epochs = request.args.get('epochs', '1')

    # Check that a file has been uploaded
    if 'file' not in request.files:
        return https_fn.Response("No file uploaded.", status=400)
    
    file = request.files['file']

    # Construct the publisher URL with epochs
    url = f"{PUBLISHER_URL}/v1/store?epochs={epochs}"

    # Use a PUT request with file's binary content
    # Note: requests allows `data=` for small files or `files=` for multipart/form-data.
    # The docs show `-d` and `--upload-file` usage with curl.
    # For PUT, we can pass file.read() in `data`.
    response = requests.put(url, data=file.read())

    if response.status_code != 200:
        return https_fn.Response(f"Failed to store file: {response.text}", status=500)

    # Return the JSON response from the publisher
    return https_fn.Response(
        response.text,
        status=200,
        headers={
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    )

@https_fn.on_request()
def get_file_walrus(request: https_fn.Request) -> https_fn.Response:
    """
    Retrieve a blob from the aggregator given a blobId.
    Expects:
    - Query param: blobId

    Returns: The raw file content stored under that blobId.
    """
    blob_id = request.args.get('blobId')
    if not blob_id:
        return https_fn.Response("blobId query parameter is required.", status=400)

    url = f"{AGGREGATOR_URL}/v1/{blob_id}"
    # We'll stream the file from the aggregator
    aggregator_response = requests.get(url, stream=True)

    if aggregator_response.status_code != 200:
        return https_fn.Response(f"Failed to retrieve file: {aggregator_response.text}", status=404)

    # The aggregator returns raw data (the blob's content).
    # We can forward this raw data directly.
    # We'll return it as an octet-stream to let the client handle it.
    return https_fn.Response(
        aggregator_response.content,
        status=200,
        headers={
            "Content-Type": "application/octet-stream",
            "Access-Control-Allow-Origin": "*"
        }
    )