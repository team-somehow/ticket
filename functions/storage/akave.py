import requests

API_BASE_URL = "http://localhost:8000"  # If not using dotenv

def api_request(method, endpoint, data=None, files=None):
    url = f"{API_BASE_URL}{endpoint}"
    try:
        response = requests.request(method, url, json=data, files=files)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as http_err:
        # If the response has an error, the API should return JSON with "error" field
        try:
            err_data = response.json()
            print(f"HTTP error occurred: {err_data.get('error', str(http_err))}")
        except ValueError:
            # If non-JSON error response
            print(f"HTTP error occurred: {str(http_err)}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")