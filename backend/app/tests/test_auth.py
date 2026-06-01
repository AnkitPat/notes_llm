import pytest
from httpx import AsyncClient, ASGITransport
from asgi_lifespan import LifespanManager # You might need to install asgi_lifespan
from backend.app.main import app # Assuming app is imported from main

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

