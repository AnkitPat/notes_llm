import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive.file']

def test_auth():
    credentials_path = 'service-account.json'
    if not os.path.exists(credentials_path):
        print(f"Error: {credentials_path} not found")
        return

    try:
        with open(credentials_path) as f:
            info = json.load(f)
        
        print(f"Project ID: {info.get('project_id')}")
        print(f"Client Email: {info.get('client_email')}")
        
        creds = service_account.Credentials.from_service_account_info(
            info, scopes=SCOPES)
        
        print("Credentials object created. Attempting to refresh token...")
        
        import google.auth.transport.requests
        request = google.auth.transport.requests.Request()
        creds.refresh(request)
        
        print("Token refreshed successfully!")
        print(f"Token: {creds.token[:10]}...")
        
        service = build('drive', 'v3', credentials=creds)
        results = service.files().list(pageSize=1, fields="files(id, name)").execute()
        print("Successfully listed files!")
        
    except Exception as e:
        print(f"Authentication failed: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.content}")

if __name__ == "__main__":
    test_auth()
