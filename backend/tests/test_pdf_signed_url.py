import pytest
import httpx
from main import app
from bson import ObjectId

@pytest.mark.anyio
async def test_get_signed_url_not_found():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get(f"/resources/{str(ObjectId())}/signed-url")
    assert response.status_code == 404
