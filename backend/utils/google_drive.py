import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

SCOPES = ['https://www.googleapis.com/auth/drive.file']

class GoogleDriveHelper:
    def __init__(self, service_account_info=None):
        self.root_folder_name = 'NotesLLM'
        self.root_folder_id = None
        
        if service_account_info:
            self.creds = service_account.Credentials.from_service_account_info(
                service_account_info, scopes=SCOPES)
        else:
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'service-account.json')
            if not os.path.exists(credentials_path):
                script_dir = os.path.dirname(os.path.dirname(__file__))
                alt_path = os.path.join(script_dir, 'service-account.json')
                if os.path.exists(alt_path):
                    credentials_path = alt_path

            if os.path.exists(credentials_path):
                self.creds = service_account.Credentials.from_service_account_file(
                    credentials_path, scopes=SCOPES)
            else:
                self.creds = None
        
        if self.creds:
            self.service = build('drive', 'v3', credentials=self.creds)
            self._initialize_root_folder()
        else:
            self.service = None

    def _initialize_root_folder(self):
        """Find or create the master NotesLLM folder."""
        query = f"name = '{self.root_folder_name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        results = self.service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        files = results.get('files', [])

        if files:
            self.root_folder_id = files[0]['id']
            print(f"DEBUG: Found root folder '{self.root_folder_name}' with ID: {self.root_folder_id}")
        else:
            # Fallback: Create it if not found (though user said it exists and is shared)
            file_metadata = {
                'name': self.root_folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            folder = self.service.files().create(body=file_metadata, fields='id').execute()
            self.root_folder_id = folder.get('id')
            print(f"DEBUG: Created root folder '{self.root_folder_name}' with ID: {self.root_folder_id}")

    def get_or_create_user_folder(self, email: str) -> str:
        if not self.service:
            raise Exception("Google Drive service not initialized - check service-account.json")

        # Search for user folder INSIDE the root folder
        query = f"name = '{email}' and '{self.root_folder_id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        results = self.service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        files = results.get('files', [])

        if files:
            return files[0]['id']

        # Create user folder inside NotesLLM
        file_metadata = {
            'name': email,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [self.root_folder_id]
        }
        folder = self.service.files().create(body=file_metadata, fields='id').execute()
        return folder.get('id')

    def upload_file(self, filename: str, content: bytes, mimetype: str, folder_id: str):
        if not self.service:
            raise Exception("Google Drive service not initialized - check service-account.json")

        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }
        fh = io.BytesIO(content)
        media = MediaIoBaseUpload(fh, mimetype=mimetype, resumable=True)
        file = self.service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
        return file
