import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

SCOPES = ['https://www.googleapis.com/auth/drive.file']

class GoogleDriveHelper:
    def __init__(self, service_account_info=None):
        if service_account_info:
            self.creds = service_account.Credentials.from_service_account_info(
                service_account_info, scopes=SCOPES)
        else:
            # Fallback to env var or local file for development
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'service-account.json')
            if os.path.exists(credentials_path):
                self.creds = service_account.Credentials.from_service_account_file(
                    credentials_path, scopes=SCOPES)
            else:
                # If no credentials, we can't initialize
                # We'll allow it but raise error on use if needed
                self.creds = None
        
        if self.creds:
            self.service = build('drive', 'v3', credentials=self.creds)
        else:
            self.service = None

    def get_or_create_user_folder(self, email: str) -> str:
        if not self.service:
            raise Exception("Google Drive service not initialized")

        query = f"name = '{email}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        results = self.service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        files = results.get('files', [])

        if files:
            return files[0]['id']

        # Create folder
        file_metadata = {
            'name': email,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        folder = self.service.files().create(body=file_metadata, fields='id').execute()
        return folder.get('id')

    def upload_file(self, filename: str, content: bytes, mimetype: str, folder_id: str):
        if not self.service:
            raise Exception("Google Drive service not initialized")

        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }
        fh = io.BytesIO(content)
        media = MediaIoBaseUpload(fh, mimetype=mimetype, resumable=True)
        file = self.service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
        return file
