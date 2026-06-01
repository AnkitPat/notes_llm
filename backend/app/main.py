from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional

from backend.app.models.user import User
from backend.app.auth import google_oauth 
from backend.app.database.mock_db import mock_db, ADMIN_EMAIL
from backend.app.utils.email_client import send_approval_notification_email

app = FastAPI()
app.include_router(google_oauth.router)

# Existing registration endpoint
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

# Update the Google OAuth callback to trigger email and redirect to pending page
@google_oauth.router.get('/auth/google/callback', name='auth_google_callback')
async def auth_google_callback(request: Request):
    try:
        token = await google_oauth.oauth.google.authorize_access_token(request)
    except Exception as e:
        return RedirectResponse(url='/error?message=OAuth_failed')

    user_info = await google_oauth.oauth.google.parse_id_token(request, token)
    user_email = user_info['email']
    user_name = user_info.get('name', user_email.split('@')[0])
    user_picture = user_info.get('picture')
    user_google_id = user_info['sub']

    user = mock_db.get(user_google_id)
    if user is None:
        new_user = User(_id=user_google_id, email=user_email, name=user_name, profile_picture_url=user_picture, is_approved=False)
        mock_db[new_user.id] = new_user
        
        # Trigger email notification for new unapproved user
        approval_link = request.url_for('approve_user', user_id=new_user.id)
        await send_approval_notification_email(
            admin_email=ADMIN_EMAIL,
            new_user_email=new_user.email,
            approval_link=str(approval_link)
        )
        return RedirectResponse(url='/auth-status')
    elif not user.is_approved:
        return RedirectResponse(url='/auth-status')

    return RedirectResponse(url='/dashboard')

@app.get("/auth/approve/{user_id}", response_class=JSONResponse)
async def approve_user(user_id: str):
    user = mock_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_approved:
        return {"message": f"User {user.email} is already approved."}

    user.is_approved = True
    mock_db[user_id] = user
    return {"message": f"User {user.email} approved successfully!"}

# Placeholder for the auth-status page
@app.get("/auth-status")
async def auth_status():
    return {"message": "Auth status page - awaiting frontend"}

# Basic root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to notes_llm backend!"}

