import pytest
from httpx import AsyncClient, ASGITransport
from asgi_lifespan import LifespanManager
from unittest.mock import AsyncMock, patch
from backend.app.main import app
from backend.app.database.mock_db import mock_db
from backend.app.models.user import User
from backend.app.auth.google_oauth import oauth # Import oauth object

@pytest.fixture(autouse=True)
def clear_mock_db_for_all_tests():
    mock_db.clear()
    yield

@pytest.mark.asyncio
async def test_create_unapproved_user():
    async with LifespanManager(app):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post(
                "/auth/register",
                json={
                    "id": "google_user_123",
                    "email": "test@example.com",
                    "name": "Test User",
                    "profile_picture_url": "http://example.com/pic.jpg"
                }
            )
        assert response.status_code == 200 # Expect 200 OK for successful creation or existing user
        user_data = response.json()
        assert user_data["email"] == "test@example.com"
        assert user_data["is_approved"] is False


@pytest.mark.asyncio
@patch.object(oauth.google, 'authorize_access_token', new_callable=AsyncMock)
@patch.object(oauth.google, 'parse_id_token', new_callable=AsyncMock)
async def test_google_login_new_user_redirects_to_auth_status(
    mock_parse_id_token, mock_authorize_access_token
):
    mock_authorize_access_token.return_value = {"access_token": "mock_token"}
    mock_parse_id_token.return_value = {
        'email': 'newuser@example.com',
        'name': 'New User',
        'picture': 'http://example.com/new_pic.jpg',
        'sub': 'new_google_id_123'
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/auth/google/callback")

    assert response.status_code == 307 # Redirect
    assert response.headers['location'] == '/auth-status'
    
    # Verify user is in mock_db as unapproved
    new_user = mock_db.get("new_google_id_123")
    assert new_user is not None
    assert new_user.email == "newuser@example.com"
    assert new_user.is_approved is False

@pytest.mark.asyncio
@patch.object(oauth.google, 'authorize_access_token', new_callable=AsyncMock)
@patch.object(oauth.google, 'parse_id_token', new_callable=AsyncMock)
async def test_google_login_existing_unapproved_user_redirects_to_auth_status(
    mock_parse_id_token, mock_authorize_access_token
):
    # Pre-populate mock_db with an unapproved user
    existing_unapproved_user = User(
        _id="existing_google_id_456",
        email="existing@example.com",
        name="Existing User",
        is_approved=False
    )
    mock_db[existing_unapproved_user.id] = existing_unapproved_user

    mock_authorize_access_token.return_value = {"access_token": "mock_token"}
    mock_parse_id_token.return_value = {
        'email': 'existing@example.com',
        'name': 'Existing User',
        'picture': 'http://example.com/existing_pic.jpg',
        'sub': 'existing_google_id_456'
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/auth/google/callback")

    assert response.status_code == 307 # Redirect
    assert response.headers['location'] == '/auth-status'
    
    # Verify user is still in mock_db and remains unapproved
    user = mock_db.get("existing_google_id_456")
    assert user is not None
    assert user.is_approved is False
