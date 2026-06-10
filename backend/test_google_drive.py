import pytest
from unittest.mock import MagicMock, patch
from utils.google_drive import GoogleDriveHelper

@patch("utils.google_drive.build")
@patch("utils.google_drive.service_account.Credentials.from_service_account_info")
def test_get_or_create_user_folder(mock_creds, mock_build):
    mock_drive = MagicMock()
    mock_build.return_value = mock_drive
    mock_creds.return_value = MagicMock()
    
    # Mock search for folder
    mock_drive.files().list().execute.return_value = {"files": [{"id": "folder-123"}]}
    
    helper = GoogleDriveHelper(service_account_info={"project_id": "test"})
    folder_id = helper.get_or_create_user_folder("test@example.com")
    
    assert folder_id == "folder-123"
