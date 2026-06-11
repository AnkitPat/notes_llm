import pytest
from fastapi.testclient import TestClient
from main import app
import os
import json
from unittest.mock import patch, MagicMock

client = TestClient(app)
DATA_FILE = "data/verified_users.json"

def test_verify_user():
    # Clear the data file for testing
    if os.path.exists(DATA_FILE):
        os.remove(DATA_FILE)
        
    response = client.get("/verify?email=test@example.com")
    assert response.status_code == 200
    assert response.json() == {"message": "User verified successfully"}
    
    # Verify it was added
    response = client.get("/check-status/test@example.com")
    assert response.json() == {"verified": True}
    
    # Verify it is not added again (idempotency check)
    response = client.get("/verify?email=test@example.com")
    assert response.status_code == 200
    
    # Verify user list has only one entry
    with open(DATA_FILE, "r") as f:
        data = json.load(f)
    assert len(data["verified_users"]) == 1

@patch("main.drive_helper")
def test_upload_file(mock_helper):
    mock_helper.get_or_create_user_folder.return_value = "folder-123"
    mock_helper.upload_file.return_value = {
        "id": "file-456",
        "webViewLink": "https://drive.google.com/test"
    }

    response = client.post(
        "/upload",
        params={"email": "test@example.com"},
        files={"file": ("test.txt", b"hello world", "text/plain")}
    )
    
    assert response.status_code == 200
    assert response.json()["id"] == "file-456"
    assert response.json()["webViewLink"] == "https://drive.google.com/test"
