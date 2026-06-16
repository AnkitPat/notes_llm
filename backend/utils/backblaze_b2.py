import os
from b2sdk.v2 import B2Api, InMemoryAccountInfo

class BackblazeB2Helper:
    def __init__(self):
        self.application_key_id = os.getenv('B2_APPLICATION_KEY_ID')
        self.application_key = os.getenv('B2_APPLICATION_KEY')
        self.bucket_name = os.getenv('B2_BUCKET_NAME')
        
        if not self.application_key_id or not self.application_key or not self.bucket_name:
            raise Exception("Backblaze B2 credentials not fully configured")

        self.info = InMemoryAccountInfo()
        self.b2_api = B2Api(self.info)
        self.b2_api.authorize_account("production", self.application_key_id, self.application_key)
        self.bucket = self.b2_api.get_bucket_by_name(self.bucket_name)

    def get_or_create_user_folder(self, email: str) -> str:
        # B2 uses flat file system structure. Folders are just file path prefixes.
        # Returning folder-like prefix for file organization.
        return f"{email}/"

    def get_presigned_url(self, file_path: str, duration_seconds: int = 3600) -> str:
        # Generate a download URL with authorization token for the specific file
        
        file_name = file_path # Assuming file_path is the full path in the bucket
        
        # Correctly call get_download_authorization on the bucket object
        download_auth_token = self.bucket.get_download_authorization(
            file_name_prefix=file_name,
            valid_duration_in_seconds=duration_seconds
        )
        
        # Construct the download URL using the B2 API's base download URL
        base_url = self.b2_api.account_info.get_download_url()
        return f"{base_url}/file/{self.bucket_name}/{file_name}?Authorization={download_auth_token}"

    def upload_file(self, filename: str, content: bytes, mimetype: str, folder_id: str):
        # folder_id acts as file path prefix in B2
        file_path = f"{folder_id}{filename}"
        
        # B2 upload_bytes expects a file name and content
        file_version = self.bucket.upload_bytes(
            data_bytes=content,
            file_name=file_path,
            content_type=mimetype
        )
        
        # B2 doesn't return webViewLink directly like Drive.
        # Constructing a simulated response for compatibility.
        return {
            "id": file_version.id_,
            "webViewLink": f"https://f003.backblazeb2.com/file/{self.bucket_name}/{file_path}"
        }
