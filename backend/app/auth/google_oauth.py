# backend/app/auth/google_oauth.py
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse

from backend.app.models.user import User # Assuming User model is defined
from backend.app.database.mock_db import mock_db
from typing import Dict

router = APIRouter()

# Configuration for OAuth
# Read .env file
config = Config(".env")
oauth = OAuth(config)

CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth.register(
    name='google',
    client_id=config('GOOGLE_CLIENT_ID'),
    client_secret=config('GOOGLE_CLIENT_SECRET'),
    server_metadata_url=CONF_URL,
    client_kwargs={'scope': 'openid email profile'},
)

@router.get('/login/google')
async def login_google(request: Request):
    redirect_uri = request.url_for('auth_google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/auth/google/callback', name='auth_google_callback')
async def auth_google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        # Handle error, e.g., show error page or retry login
        return RedirectResponse(url='/error?message=OAuth_failed')

    user_info = await oauth.google.parse_id_token(request, token)
    user_email = user_info['email']
    user_name = user_info.get('name', user_email.split('@')[0])
    user_picture = user_info.get('picture')
    user_google_id = user_info['sub'] # Google user ID

    # Simulate user registration/lookup (will replace with actual DB logic later)
    # For now, just store in mock_db if not exists
    if user_google_id not in mock_db: # mock_db from main.py
        new_user = User(_id=user_google_id, email=user_email, name=user_name, profile_picture_url=user_picture, is_approved=False)
        mock_db[new_user.id] = new_user
    
    # Redirect to a status page or directly to the app if already approved
    # For this task, we redirect to a placeholder.
    return RedirectResponse(url='/auth-status')
