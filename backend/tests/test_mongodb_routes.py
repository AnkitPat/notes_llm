import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import MagicMock, patch, AsyncMock

# Valid 24-character hex string for ObjectId
VALID_ID = "507f1f77bcf86cd799439011"
VALID_RES_ID = "507f1f77bcf86cd799439012"

@pytest.fixture(autouse=True)
def mock_db():
    # Mocking motor's structure: db.collection.find_one(...)
    mock_db = MagicMock()
    
    # Mocking db.users
    mock_db.users = MagicMock()
    mock_db.users.find_one = AsyncMock(return_value=None)
    mock_db.users.update_one = AsyncMock(return_value=MagicMock())
    
    # Mocking db.notes
    mock_db.notes = MagicMock()
    mock_db.notes.insert_one = AsyncMock(return_value=MagicMock(inserted_id=VALID_ID))
    mock_db.notes.update_one = AsyncMock(return_value=MagicMock())
    mock_db.notes.delete_one = AsyncMock(return_value=MagicMock(deleted_count=1))
    mock_db.notes.find = MagicMock()
    
    # Mocking db.resources
    mock_db.resources = MagicMock()
    mock_db.resources.insert_one = AsyncMock(return_value=MagicMock(inserted_id=VALID_RES_ID))
    mock_db.resources.update_one = AsyncMock(return_value=MagicMock())
    mock_db.resources.find = MagicMock()
    
    # Mocking the cursor's to_list method
    mock_cursor = MagicMock()
    mock_cursor.to_list = AsyncMock(return_value=[])
    mock_db.notes.find.return_value = mock_cursor
    mock_db.resources.find.return_value = mock_cursor

    # Patch the db object in routes (since they import it from utils.db)
    with patch("routes.users.db", mock_db), \
         patch("routes.notes.db", mock_db), \
         patch("routes.resources.db", mock_db):
        yield mock_db

client = TestClient(app)

def test_check_user_status_not_verified():
    response = client.get("/check-status/test@example.com")
    assert response.status_code == 200
    assert response.json() == {"verified": False}

def test_verify_user():
    response = client.post("/admin/verify-user", json={"email": "test@example.com"})
    assert response.status_code == 200
    assert response.json() == {"message": "User verified"}

def test_create_and_get_note():
    # Create note
    response = client.post("/notes", json={"email": "test@example.com", "name": "Test Note"})
    assert response.status_code == 200
    assert response.json()["id"] == VALID_ID
    
    # Get notes
    response = client.get("/notes?email=test@example.com")
    assert response.status_code == 200
    assert response.json() == []

def test_update_note_name():
    response = client.put(f"/notes/{VALID_ID}", json={"name": "Updated Note Name"})
    assert response.status_code == 200
    assert response.json() == {"message": "Note updated"}

def test_delete_note():
    response = client.delete(f"/notes/{VALID_ID}")
    assert response.status_code == 204

def test_create_resource():
    response = client.post("/resources", json={
        "noteId": VALID_ID,
        "type": "text",
        "name": "Resource Name",
        "content": "Resource Content"
    })
    assert response.status_code == 200
    assert response.json()["id"] == VALID_RES_ID

def test_update_resource():
    response = client.patch(f"/resources/{VALID_RES_ID}", json={"name": "New Name"})
    assert response.status_code == 200
    assert response.json() == {"message": "Resource updated"}
