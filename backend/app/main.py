from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional

from backend.app.models.user import User # Assuming User model is defined

app = FastAPI()

# --- TEMP MOCK DB ---
mock_db: Dict[str, User] = {} # In-memory mock database
# --- END TEMP MOCK DB ---

class UserRegistration(BaseModel):
    id: str
    email: str
    name: str
    profile_picture_url: Optional[str] = None

@app.post("/auth/register", response_model=User)
async def register_user(user_data: UserRegistration):
    if user_data.id in mock_db:
        return mock_db[user_data.id] # Return existing user if already there

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
