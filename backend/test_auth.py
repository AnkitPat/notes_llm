import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive.file']

def test_auth():
    credentials_path = 'service-account.json'
    if not os.path.exists(credentials_path):
        print(f"Error: {credentials_path} not found")
        return

    try:
        creds = service_account.Credentials.from_service_account_file(
            credentials_path, scopes=SCOPES)
        service = build('drive', 'v3', credentials=creds)
        # Try a simple call
        results = service.files().list(pageSize=1, fields="nextPageToken, files(id, name)").execute()
        print("Successfully authenticated and listed files!")
    except Exception as e:
        print(f"Authentication failed: {e}")

if __name__ == "__main__":
    test_auth()
