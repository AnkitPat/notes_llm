from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional

from backend.app.models.user import User
from backend.app.auth import google_oauth # Import the router

app = FastAPI()

# --- TEMP MOCK DB ---
from backend.app.database.mock_db import mock_db, ADMIN_EMAIL
# --- END TEMP MOCK DB ---

# Include the Google OAuth router
app.include_router(google_oauth.router)

# Existing registration endpoint (can be simplified/removed later as OAuth handles it)
class UserRegistration(BaseModel):
    id: str
    email: str
    name: str
    profile_picture_url: Optional[str] = None

@app.post("/auth/register", response_model=User)
async def register_user(user_data: UserRegistration):
    if user_data.id in mock_db:
        return mock_db[user_data.id]

    new_user = User(_id=user_data.id, email=user_data.email, name=user_data.name, profile_picture_url=user_data.profile_picture_url, is_approved=False)
    mock_db[new_user.id] = new_user
    return new_user

# Placeholder for the auth-status page, will be handled by frontend
@app.get("/auth-status")
async def auth_status():
    return {"message": "Auth status page - awaiting frontend"}

# Basic root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to notes_llm backend!"}

