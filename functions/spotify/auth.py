import os
import urllib.parse
import base64
import requests
import json

from google.cloud import firestore
from functions_framework import http
from firebase_functions import https_fn
from dotenv import load_dotenv
from .secret import secrets

load_dotenv()


# Load environment variables
CLIENT_ID = secrets["SPOTIFY_CLIENT_ID"]
CLIENT_SECRET = secrets["SPOTIFY_CLIENT_SECRET"]
REDIRECT_URI = secrets["SPOTIFY_REDIRECT_URI"]
SCOPES = secrets.get("SCOPES", "user-top-read playlist-read-private user-follow-read")


@http
def spotify_login(request):
    # print(f"CLIENT_ID: {CLIENT_ID}")
    # print(f"CLIENT_SECRET: {CLIENT_SECRET}")
    # print(f"REDIRECT_URI: {REDIRECT_URI}")

    auth_url = 'https://accounts.spotify.com/authorize'
    params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI,
        'scope': SCOPES,
    }
    url = f"{auth_url}?{urllib.parse.urlencode(params)}"
    print(f"Redirecting to: {url}")
    response = https_fn.Response(
        status=302,
        headers={
            'Location': url,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    )

    return response


@http
def spotify_callback(request):
    try:
        code = request.args.get('code')
        if not code:
            print("Authorization code is missing.")
            return ('Authorization code is missing', 400)

        print(f"Received authorization code")

        token_url = 'https://accounts.spotify.com/api/token'
        auth_header = base64.urlsafe_b64encode(
            f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
        headers = {
            'Authorization': f'Basic {auth_header}',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
        }

        # Exchange authorization code for access token
        response = requests.post(token_url, headers=headers, data=data)


        response_data = response.json()

        if 'access_token' not in response_data or 'refresh_token' not in response_data:
            print("Error obtaining tokens.")
            return ('Error obtaining tokens', 400)

        access_token = response_data['access_token']
        refresh_token = response_data['refresh_token']

        print('Tokens saved successfully')
        return json.dumps({'access_token': access_token, 'refresh_token': refresh_token})

    except Exception as e:
        print(f"Internal server error: {e}")
        return ('Internal server error', 500)
