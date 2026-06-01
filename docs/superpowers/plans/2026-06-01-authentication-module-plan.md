# Authentication Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** To implement a secure authentication module for the `notes_llm` application, featuring a Google OAuth login, a custom login screen UI, and a new user access approval workflow.

**Architecture:** The module will involve frontend components for the login and waiting screens (Next.js) and backend APIs for handling Google OAuth callbacks, user registration/status management, and email notifications (FastAPI).

**Tech Stack:** Next.js (Frontend), React (Frontend), FastAPI (Backend), Python (Backend), LangChain (Backend - potential for future integrations), ChromaDB (Backend - potential for future integrations), Google OAuth 2.0, SMTP client for email.

---

### Task 1: Backend - Google OAuth Setup and User Model

**Files:**
- Create: `backend/app/models/user.py`
- Create: `backend/app/auth/google_oauth.py`
- Modify: `backend/app/main.py` (for routes)
- Test: `backend/app/tests/test_auth.py`

- [ ] **Step 1: Define User Model (backend/app/models/user.py)**

    Create a Pydantic model for the User, including fields for `id`, `email`, `name`, `profile_picture_url`, `is_approved`, and `created_at`.

    ```python
    from datetime import datetime
    from typing import Optional
    from pydantic import BaseModel, Field

    class User(BaseModel):
        id: str = Field(..., alias="_id") # Use _id for MongoDB compatibility if needed
        email: str
        name: str
        profile_picture_url: Optional[str] = None
        is_approved: bool = False
        created_at: datetime = Field(default_factory=datetime.utcnow)

    # Example for database model if using a non-Pydantic ORM
    # class DBUser(User):
    #     class Config:
    #         arbitrary_types_allowed = True
    ```

- [ ] **Step 2: Write a failing test for user creation (backend/app/tests/test_auth.py)**

    ```python
    import pytest
    from httpx import AsyncClient # Assuming async client for FastAPI tests
    from backend.app.main import app # Assuming app is imported from main

    @pytest.mark.asyncio
    async def test_create_unapproved_user():
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post(
                "/auth/register",
                json={
                    "id": "google_user_123",
                    "email": "test@example.com",
                    "name": "Test User",
                    "profile_picture_url": "http://example.com/pic.jpg"
                }
            )
        assert response.status_code == 201
        user_data = response.json()
        assert user_data["email"] == "test@example.com"
        assert user_data["is_approved"] is False
    ```

- [ ] **Step 3: Run test to verify it fails**

    Run: `pytest backend/app/tests/test_auth.py::test_create_unapproved_user -v`
    Expected: FAIL (e.g., 404 Not Found or function not defined)

- [ ] **Step 4: Implement minimal user registration endpoint (backend/app/main.py)**

    Add a basic endpoint to `/auth/register` that creates an unapproved user. (Note: database integration will come in a later task, for now, just simulate creation or use a mock db).

    ```python
    # backend/app/main.py
    from fastapi import FastAPI, Depends, HTTPException
    from pydantic import BaseModel
    from typing import Dict, Any

    from backend.app.models.user import User

    app = FastAPI()

    # --- TEMP MOCK DB ---
    mock_db = {} # In-memory mock database
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

        new_user = User(**user_data.dict(), is_approved=False)
        mock_db[new_user.id] = new_user
        return new_user
    ```

- [ ] **Step 5: Run test to verify it passes**

    Run: `pytest backend/app/tests/test_auth.py::test_create_unapproved_user -v`
    Expected: PASS

- [ ] **Step 6: Commit**

    ```bash
    git add backend/app/models/user.py backend/app/main.py backend/app/tests/test_auth.py
    git commit -m "feat: Add basic user model and registration endpoint"
    ```

### Task 2: Backend - Google OAuth Integration

**Files:**
- Create: `backend/app/auth/google_oauth.py`
- Modify: `backend/app/main.py`
- Test: `backend/app/tests/test_auth.py`

- [ ] **Step 1: Add OAuth configuration and router (backend/app/auth/google_oauth.py)**

    Create `google_oauth.py` to handle Google OAuth settings and the login/callback routes. (Note: You'll need to set up Google OAuth credentials and environment variables for this. For testing, we will mock external calls.)

    ```python
    # backend/app/auth/google_oauth.py
    from starlette.config import Config
    from authlib.integrations.starlette_client import OAuth
    from fastapi import APIRouter, Request, Depends
    from fastapi.responses import RedirectResponse

    from backend.app.models.user import User # Assuming User model is defined

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
            new_user = User(
                id=user_google_id,
                email=user_email,
                name=user_name,
                profile_picture_url=user_picture,
                is_approved=False # Default to false for new users
            )
            mock_db[new_user.id] = new_user
        
        # Redirect to a status page or directly to the app if already approved
        # For this task, we redirect to a placeholder.
        return RedirectResponse(url='/auth-status')

    ```

- [ ] **Step 2: Write a failing test for Google OAuth login (backend/app/tests/test_auth.py)**

    This test should mock the Google OAuth process to verify that the callback route processes user info and redirects.

    ```python
    # backend/app/tests/test_auth.py
    import pytest
    from httpx import AsyncClient
    from unittest.mock import AsyncMock, patch
    from backend.app.main import app, mock_db # Assuming mock_db is accessible
    from backend.app.models.user import User
    from backend.app.auth.google_oauth import oauth # Import oauth object

    @pytest.fixture(autouse=True)
    def clear_mock_db():
        mock_db.clear()
        yield

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

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/auth/google/callback")

        assert response.status_code == 302 # Redirect
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
            id="existing_google_id_456",
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

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/auth/google/callback")

        assert response.status_code == 302 # Redirect
        assert response.headers['location'] == '/auth-status'
        
        # Verify user is still in mock_db and remains unapproved
        user = mock_db.get("existing_google_id_456")
        assert user is not None
        assert user.is_approved is False

    ```

- [ ] **Step 3: Run test to verify it fails**

    Run: `pytest backend/app/tests/test_auth.py::test_google_login_new_user_redirects_to_auth_status -v`
    Run: `pytest backend/app/tests/test_auth.py::test_google_login_existing_unapproved_user_redirects_to_auth_status -v`
    Expected: FAIL (e.g., ModuleNotFoundError for authlib, or route not found)

- [ ] **Step 4: Integrate Google OAuth router into main.py**

    Modify `backend/app/main.py` to include the new OAuth router.

    ```python
    # backend/app/main.py
    from fastapi import FastAPI, Depends, HTTPException, Request
    from fastapi.responses import RedirectResponse
    from pydantic import BaseModel
    from typing import Dict, Any, Optional

    from backend.app.models.user import User
    from backend.app.auth import google_oauth # Import the router

    app = FastAPI()

    # --- TEMP MOCK DB ---
    mock_db: Dict[str, User] = {} # In-memory mock database
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

        new_user = User(**user_data.dict(), is_approved=False)
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
    ```

- [ ] **Step 5: Run tests to verify they pass**

    Run: `pytest backend/app/tests/test_auth.py -v`
    Expected: PASS for `test_google_login_new_user_redirects_to_auth_status` and `test_google_login_existing_unapproved_user_redirects_to_auth_status`.

- [ ] **Step 6: Commit**

    ```bash
    git add backend/app/models/user.py backend/app/main.py backend/app/tests/test_auth.py
    git commit -m "feat: Add basic user model and registration endpoint"
    ```

### Task 3: Backend - User Approval Mechanism

**Files:**
- Modify: `backend/app/main.py`
- Create: `backend/app/utils/email_client.py`
- Test: `backend/app/tests/test_auth.py`

- [ ] **Step 1: Write a failing test for user approval (backend/app/tests/test_auth.py)**

    This test should verify that an admin can approve a user via a unique token/link, and the user's `is_approved` status changes. It also needs to test the email sending (mocked).

    ```python
    # backend/app/tests/test_auth.py
    import pytest
    from httpx import AsyncClient
    from unittest.mock import AsyncMock, patch
    from backend.app.main import app, mock_db
    from backend.app.models.user import User
    from backend.app.utils.email_client import send_approval_email # Assuming this will exist

    @pytest.mark.asyncio
    @patch("backend.app.utils.email_client.send_approval_email", new_callable=AsyncMock)
    async def test_approve_user_via_link(mock_send_email):
        # Pre-populate mock_db with an unapproved user
        unapproved_user = User(
            id="user_to_approve_123",
            email="approveme@example.com",
            name="Approve Me",
            is_approved=False
        )
        mock_db[unapproved_user.id] = unapproved_user

        # Simulate the approval link click
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/auth/approve/{unapproved_user.id}") # Use user ID for simplicity in mock

        assert response.status_code == 200
        assert "User approved" in response.json()["message"]

        # Verify user is now approved in mock_db
        approved_user = mock_db.get(unapproved_user.id)
        assert approved_user is not None
        assert approved_user.is_approved is True

        # Check if email was sent (though not directly part of approval endpoint)
        # This part will be more relevant for testing the _trigger_ of the email.
        # For now, just test the approval logic.
    ```
    And a test for triggering email on new user signup:
    ```python
    # backend/app/tests/test_auth.py
    import pytest
    from httpx import AsyncClient
    from unittest.mock import AsyncMock, patch
    from backend.app.main import app, mock_db
    from backend.app.models.user import User
    from backend.app.auth.google_oauth import oauth # Import oauth object
    from backend.app.utils.email_client import send_approval_notification_email # New function to notify admin

    @pytest.fixture(autouse=True)
    def clear_mock_db_for_email_tests():
        mock_db.clear()
        yield

    @pytest.mark.asyncio
    @patch.object(oauth.google, 'authorize_access_token', new_callable=AsyncMock)
    @patch.object(oauth.google, 'parse_id_token', new_callable=AsyncMock)
    @patch("backend.app.utils.email_client.send_approval_notification_email", new_callable=AsyncMock)
    async def test_new_user_signup_triggers_admin_email(
        mock_send_notification_email, mock_parse_id_token, mock_authorize_access_token
    ):
        mock_authorize_access_token.return_value = {"access_token": "mock_token"}
        mock_parse_id_token.return_value = {
            'email': 'newuser_email@example.com',
            'name': 'New User Email',
            'picture': 'http://example.com/email_pic.jpg',
            'sub': 'new_google_id_email_123'
        }

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/auth/google/callback")

        assert response.status_code == 302 # Redirect
        assert mock_send_notification_email.called # Verify email function was called
        mock_send_notification_email.assert_called_once_with(
            admin_email="siddeshgandhe@gmail.com",
            new_user_email="newuser_email@example.com",
            approval_link=f"http://test/auth/approve/new_google_id_email_123" # Adjust if token logic changes
        )

    ```


- [ ] **Step 2: Run test to verify it fails**

    Run: `pytest backend/app/tests/test_auth.py::test_approve_user_via_link -v`
    Run: `pytest backend/app/tests/test_auth.py::test_new_user_signup_triggers_admin_email -v`
    Expected: FAIL (e.g., route not found, `send_approval_email` not defined)

- [ ] **Step 3: Implement email utility (backend/app/utils/email_client.py)**

    Create a simple email client for sending approval notifications. For now, it can just print to console or mock an actual send.

    ```python
    # backend/app/utils/email_client.py
    from starlette.config import Config
    import smtplib
    from email.mime.text import MIMEText
    import os

    config = Config(".env")

    # For now, just a print statement to simulate email sending
    async def send_approval_notification_email(admin_email: str, new_user_email: str, approval_link: str):
        print(f"--- Simulating Email Send ---")
        print(f"To: {admin_email}")
        print(f"Subject: New User Approval Required for {new_user_email}")
        print(f"Body: A new user ({new_user_email}) has logged in. Please approve their access: {approval_link}")
        print(f"--- End Simulating Email Send ---")

        # In a real application, you'd use a library like 'python-multipart' for actual SMTP
        # and configure credentials in .env (e.g., SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD)
        # try:
        #     sender_email = config('SMTP_USERNAME')
        #     smtp_server = config('SMTP_SERVER')
        #     smtp_port = config('SMTP_PORT', cast=int)
        #     smtp_password = config('SMTP_PASSWORD')

        #     msg = MIMEText(f"A new user ({new_user_email}) has logged in. Please approve their access: {approval_link}")
        #     msg['Subject'] = f"New User Approval Required for {new_user_email}"
        #     msg['From'] = sender_email
        #     msg['To'] = admin_email

        #     with smtplib.SMTP(smtp_server, smtp_port) as server:
        #         server.starttls()
        #         server.login(sender_email, smtp_password)
        #         server.send_message(msg)
        #     print(f"Approval email sent to {admin_email}")
        # except Exception as e:
        #     print(f"Failed to send email: {e}")
    ```

- [ ] **Step 4: Implement user approval endpoint and email trigger (backend/app/main.py)**

    Add an endpoint `/auth/approve/{user_id}` and integrate email triggering into the Google OAuth callback.

    ```python
    # backend/app/main.py (continued from previous task)
    from fastapi import FastAPI, Depends, HTTPException, Request
    from fastapi.responses import RedirectResponse, JSONResponse
    from pydantic import BaseModel
    from typing import Dict, Any, Optional

    from backend.app.models.user import User
    from backend.app.auth import google_oauth
    from backend.app.utils.email_client import send_approval_notification_email # Import email client

    app = FastAPI()
    app.include_router(google_oauth.router) # Ensure this is included

    # --- TEMP MOCK DB ---
    mock_db: Dict[str, User] = {}
    ADMIN_EMAIL = "siddeshgandhe@gmail.com" # Define admin email here
    # --- END TEMP MOCK DB ---

    # Modify the Google OAuth callback to trigger email and redirect to pending page
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
            new_user = User(
                id=user_google_id,
                email=user_email,
                name=user_name,
                profile_picture_url=user_picture,
                is_approved=False
            )
            mock_db[new_user.id] = new_user
            
            # Trigger email notification for new unapproved user
            approval_link = request.url_for('approve_user', user_id=new_user.id) # Use named route
            await send_approval_notification_email(
                admin_email=ADMIN_EMAIL,
                new_user_email=new_user.email,
                approval_link=str(approval_link) # Convert URL to string
            )
            return RedirectResponse(url='/auth-status') # Redirect to pending status page
        elif not user.is_approved:
            return RedirectResponse(url='/auth-status') # Redirect unapproved existing users

        # If user is approved, redirect to main app or dashboard
        return RedirectResponse(url='/dashboard') # Assuming a /dashboard route for approved users

    @app.get("/auth/approve/{user_id}", response_class=JSONResponse)
    async def approve_user(user_id: str):
        user = mock_db.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.is_approved:
            return {"message": f"User {user.email} is already approved."}

        user.is_approved = True
        mock_db[user_id] = user # Update in mock db
        return {"message": f"User {user.email} approved successfully!"}
    ```

- [ ] **Step 5: Run tests to verify they pass**

    Run: `pytest backend/app/tests/test_auth.py -v`
    Expected: All tests pass.

- [ ] **Step 6: Commit**

    ```bash
    git add backend/app/main.py backend/app/utils/email_client.py backend/app/tests/test_auth.py
    git commit -m "feat: Implement user approval mechanism and email notification"
    ```

### Task 4: Frontend - Login Screen UI

**Files:**
- Create: `frontend/pages/login.tsx` (or `frontend/app/login/page.tsx` for App Router)
- Create: `frontend/components/AuthLayout.tsx`
- Modify: `frontend/pages/_app.tsx` (or `frontend/app/layout.tsx`)
- Modify: `frontend/next.config.js` (for Google OAuth redirect setup)
- Test: `frontend/tests/login.test.tsx` (or `login.spec.tsx`)

- [ ] **Step 1: Write a failing test for the Login screen (frontend/tests/login.test.tsx)**

    This test should verify that the login page renders with the correct layout, welcome message, and Google login button. It will mock the Google OAuth initiation.

    ```typescript
    // frontend/tests/login.test.tsx
    import React from 'react';
    import { render, screen, fireEvent } from '@testing-library/react';
    import Login from '../pages/login'; // Adjust path as per your Next.js setup

    // Mock Next.js router
    jest.mock('next/router', () => ({
      useRouter: () => ({
        push: jest.fn(),
      }),
    }));

    describe('Login Page', () => {
      test('renders login screen with correct elements', () => {
        render(<Login />);
        
        // Verify welcome message
        expect(screen.getByText(/Your personal knowledge hub/i)).toBeInTheDocument();
        
        // Verify Google login button
        expect(screen.getByRole('button', { name: /Login with Google/i })).toBeInTheDocument();
        
        // Verify placeholder for image (this might need to be more specific based on implementation)
        // For now, let's assume there's an accessible element for the image area
        expect(screen.getByTestId('login-image-area')).toBeInTheDocument(); 
      });

      test('clicking Google login button initiates OAuth flow', () => {
        render(<Login />);
        const googleLoginButton = screen.getByRole('button', { name: /Login with Google/i });
        fireEvent.click(googleLoginButton);

        // Expect a redirection to the backend OAuth endpoint
        // This will depend on how you trigger the OAuth in React
        // For now, let's check if window.location.href changes or a specific function is called
        // For the purpose of this plan, we'll assume a direct link to the backend OAuth endpoint.
        expect(window.location.href).toContain('/api/auth/google'); // Example
      });
    });
    ```
    (Note: You'll need to set up `@testing-library/react` and Jest for frontend testing).

- [ ] **Step 2: Run test to verify it fails**

    Run: `jest frontend/tests/login.test.tsx` (or `npm test` if configured)
    Expected: FAIL (e.g., page not found, elements not found)

- [ ] **Step 3: Implement Login Screen UI (frontend/pages/login.tsx & frontend/components/AuthLayout.tsx)**

    Create the login page and a reusable layout component that handles the horizontal split.

    ```typescript
    // frontend/components/AuthLayout.tsx
    import React from 'react';

    interface AuthLayoutProps {
      imageComponent: React.ReactNode;
      formComponent: React.ReactNode;
    }

    const AuthLayout: React.FC<AuthLayoutProps> = ({ imageComponent, formComponent }) => {
      return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <div data-testid="login-image-area" style={{ flex: 1, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imageComponent}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {formComponent}
          </div>
        </div>
      );
    };

    export default AuthLayout;
    ```
    ```typescript
    // frontend/pages/login.tsx (or app/login/page.tsx)
    import React from 'react';
    import { useRouter } from 'next/router'; // Or 'next/navigation' for App Router
    import AuthLayout from '../components/AuthLayout'; // Adjust path

    const LoginPage: React.FC = () => {
      const router = useRouter();

      const handleGoogleLogin = () => {
        // Redirect to FastAPI backend's Google OAuth initiation endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/google`;
      };

      const ImageArea: React.FC = () => (
        // Placeholder for custom image - can be an actual image, a component, or just a div
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          {/* Example: <img src="/path/to/default-login-image.png" alt="Login Visual" style={{ maxWidth: '100%' }} /> */}
          <h2>Welcome to notes_llm</h2>
          <p>Your personal knowledge hub</p>
        </div>
      );

      const LoginForm: React.FC = () => (
        <div style={{ textAlign: 'center' }}>
          <h1>Your personal knowledge hub.</h1>
          <p>Log in to access your notes.</p>
          <button 
            onClick={handleGoogleLogin} 
            style={{ 
              marginTop: '1rem', 
              padding: '0.8rem 1.5rem', 
              fontSize: '1rem', 
              backgroundColor: '#4285F4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Login with Google
          </button>
        </div>
      );

      return (
        <AuthLayout imageComponent={<ImageArea />} formComponent={<LoginForm />} />
      );
    };

    export default LoginPage;
    ```
    (You will also need to add `NEXT_PUBLIC_BACKEND_URL` to your `.env.local` file in the frontend, pointing to your FastAPI backend URL.)

- [ ] **Step 4: Run test to verify it passes**

    Run: `jest frontend/tests/login.test.tsx`
    Expected: PASS

- [ ] **Step 5: Commit**

    ```bash
    git add frontend/pages/login.tsx frontend/components/AuthLayout.tsx frontend/tests/login.test.tsx
    git commit -m "feat: Implement login screen UI with Google login button"
    ```

### Task 5: Frontend - Waiting for Approval Screen UI

**Files:**
- Create: `frontend/pages/auth-status.tsx` (or `frontend/app/auth-status/page.tsx`)
- Test: `frontend/tests/auth-status.test.tsx`

- [ ] **Step 1: Write a failing test for the Waiting for Approval screen (frontend/tests/auth-status.test.tsx)**

    This test should verify that the waiting page renders correctly with the appropriate message.

    ```typescript
    // frontend/tests/auth-status.test.tsx
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import AuthStatusPage from '../pages/auth-status'; // Adjust path

    describe('Auth Status Page', () => {
      test('renders waiting for approval message', () => {
        render(<AuthStatusPage />);
        expect(screen.getByText(/Your account is pending approval/i)).toBeInTheDocument();
        expect(screen.getByText(/Please check your email/i)).toBeInTheDocument(); // If admin email included
      });
    });
    ```

- [ ] **Step 2: Run test to verify it fails**

    Run: `jest frontend/tests/auth-status.test.tsx`
    Expected: FAIL

- [ ] **Step 3: Implement Waiting for Approval Screen UI (frontend/pages/auth-status.tsx)**

    Create a simple page that informs the user their account is pending approval.

    ```typescript
    // frontend/pages/auth-status.tsx (or app/auth-status/page.tsx)
    import React from 'react';

    const AuthStatusPage: React.FC = () => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
          <h1>Account Pending Approval</h1>
          <p>Your account is currently pending approval by the administrator.</p>
          <p>An email has been sent to the administrator (`siddeshgandhe@gmail.com`) for review.</p>
          <p>You will be notified once your access has been granted.</p>
          <p style={{ marginTop: '2rem' }}>Thank you for your patience!</p>
        </div>
      );
    };

    export default AuthStatusPage;
    ```

- [ ] **Step 4: Run test to verify it passes**

    Run: `jest frontend/tests/auth-status.test.tsx`
    Expected: PASS

- [ ] **Step 5: Commit**

    ```bash
    git add frontend/pages/auth-status.tsx frontend/tests/auth-status.test.tsx
    git commit -m "feat: Implement waiting for approval screen"
    ```

### Task 6: Frontend - Protected Routes and Session Management

**Files:**
- Create: `frontend/utils/auth.ts`
- Modify: `frontend/pages/_app.tsx` (or `frontend/middleware.ts`)
- Modify: `frontend/pages/dashboard.tsx` (example protected route)
- Test: `frontend/tests/auth_middleware.test.tsx` (or similar)

- [ ] **Step 1: Write a failing test for protected route redirection (frontend/tests/auth_middleware.test.tsx)**

    This test should verify that unauthenticated or unapproved users are redirected from protected routes.

    ```typescript
    // frontend/tests/auth_middleware.test.tsx
    import { renderHook } from '@testing-library/react-hooks'; // For testing hooks
    import { useRouter } from 'next/router';
    import { useEffect } from 'react';

    // Mock Next.js router
    jest.mock('next/router', () => ({
      useRouter: () => ({
        push: jest.fn(),
        pathname: '/dashboard', // Simulate being on a protected route
      }),
    }));

    // Mock an auth service that provides user approval status
    const mockAuthService = {
      isAuthenticated: () => false, // Simulate unauthenticated
      isApproved: () => false,      // Simulate unapproved
    };

    // A dummy hook to represent our auth check logic
    const useAuthCheck = () => {
      const router = useRouter();
      useEffect(() => {
        if (!mockAuthService.isAuthenticated()) {
          router.push('/login');
        } else if (!mockAuthService.isApproved()) {
          router.push('/auth-status');
        }
      }, [router]);
    };

    describe('Auth Middleware', () => {
      test('redirects unauthenticated users to login page', () => {
        const { result } = renderHook(() => useAuthCheck());
        const { push } = useRouter();
        expect(push).toHaveBeenCalledWith('/login');
      });

      test('redirects unapproved users to auth-status page', () => {
        // Override mock auth service for this test
        mockAuthService.isAuthenticated = () => true;
        mockAuthService.isApproved = () => false;

        const { result } = renderHook(() => useAuthCheck());
        const { push } = useRouter();
        expect(push).toHaveBeenCalledWith('/auth-status');
      });
    });
    ```

- [ ] **Step 2: Run test to verify it fails**

    Run: `jest frontend/tests/auth_middleware.test.tsx`
    Expected: FAIL

- [ ] **Step 3: Implement Protected Routes and Session Management (frontend/utils/auth.ts, frontend/pages/_app.tsx)**

    Create an authentication utility and integrate it into the app's root component or use Next.js Middleware to protect routes.

    ```typescript
    // frontend/utils/auth.ts
    // This file will contain functions to manage user sessions and check approval status.
    // For simplicity, we'll use local storage or a context API for session.
    // In a real app, this would involve JWT tokens and server-side session validation.

    interface UserSession {
      id: string;
      email: string;
      name: string;
      isApproved: boolean;
    }

    export const getUserSession = (): UserSession | null => {
      if (typeof window === 'undefined') {
        return null; // Server-side rendering
      }
      const sessionStr = localStorage.getItem('userSession');
      return sessionStr ? JSON.parse(sessionStr) : null;
    };

    export const setUserSession = (session: UserSession): void => {
      localStorage.setItem('userSession', JSON.stringify(session));
    };

    export const clearUserSession = (): void => {
      localStorage.removeItem('userSession');
    };

    export const isAuthenticated = (): boolean => {
      return !!getUserSession();
    };

    export const isUserApproved = (): boolean => {
      const session = getUserSession();
      return session ? session.isApproved : false;
    };
    ```

    ```typescript
    // frontend/pages/_app.tsx (for Pages Router)
    // Or for App Router, you'd typically use Middleware or a Context Provider
    import type { AppProps } from 'next/app';
    import { useRouter } from 'next/router';
    import { useEffect } from 'react';
    import { isAuthenticated, isUserApproved } from '../utils/auth'; // Adjust path

    function MyApp({ Component, pageProps }: AppProps) {
      const router = useRouter();

      useEffect(() => {
        const publicPaths = ['/login', '/auth-status']; // Paths accessible without full approval

        if (!publicPaths.includes(router.pathname)) {
          if (!isAuthenticated()) {
            router.push('/login');
          } else if (!isUserApproved()) {
            router.push('/auth-status');
          }
        }
      }, [router.pathname]);

      return <Component {...pageProps} />;
    }

    export default MyApp;
    ```
    (Note: For App Router, `middleware.ts` is the preferred way to handle global authentication checks.)

- [ ] **Step 4: Create a dummy dashboard page (frontend/pages/dashboard.tsx)**

    ```typescript
    // frontend/pages/dashboard.tsx
    import React from 'react';

    const DashboardPage: React.FC = () => {
      return (
        <div style={{ padding: '2rem' }}>
          <h1>Welcome to your Dashboard!</h1>
          <p>You have successfully logged in and are approved.</p>
        </div>
      );
    };

    export default DashboardPage;
    ```

- [ ] **Step 5: Update backend Google OAuth callback to set user session (backend/app/auth/google_oauth.py)**

    The backend needs to return user session info, including `is_approved`, for the frontend to store.

    ```python
    # backend/app/auth/google_oauth.py
    # ... (imports and config remain the same)
    from fastapi.responses import JSONResponse # For returning session info
    from backend.app.main import mock_db # Access mock db
    from backend.app.models.user import User

    @router.get('/auth/google/callback', name='auth_google_callback')
    async def auth_google_callback(request: Request):
        try:
            token = await oauth.google.authorize_access_token(request)
        except Exception as e:
            return RedirectResponse(url='/error?message=OAuth_failed')

        user_info = await oauth.google.parse_id_token(request, token)
        user_email = user_info['email']
        user_name = user_info.get('name', user_email.split('@')[0])
        user_picture = user_info.get('picture')
        user_google_id = user_info['sub']

        user = mock_db.get(user_google_id)
        if user is None:
            new_user = User(
                id=user_google_id,
                email=user_email,
                name=user_name,
                profile_picture_url=user_picture,
                is_approved=False
            )
            mock_db[new_user.id] = new_user
            
            # Trigger email notification
            approval_link = request.url_for('approve_user', user_id=new_user.id)
            await send_approval_notification_email(
                admin_email=google_oauth.ADMIN_EMAIL, # Use ADMIN_EMAIL from main
                new_user_email=new_user.email,
                approval_link=str(approval_link)
            )
            # Redirect to auth-status but also provide session data if possible (e.g. via cookie or query param)
            # For this mock, we'll just redirect. Real app would handle JWT/session.
            return RedirectResponse(url=f'/auth-status?userId={new_user.id}&isApproved=false')
        
        # If user exists, update session info and redirect
        # For simplicity, returning a JSON response that frontend would handle.
        # In real app, this would set a JWT token or session cookie
        if user.is_approved:
            # Set a mock session for approved users
            session_data = {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "isApproved": user.is_approved
            }
            # For demonstration, we'll redirect and pass data in query params
            return RedirectResponse(url=f'/dashboard?userId={user.id}&isApproved=true')
        else:
            return RedirectResponse(url=f'/auth-status?userId={user.id}&isApproved=false')
    ```


- [ ] **Step 6: Run tests to verify they pass**

    Run: `jest frontend/tests/auth_middleware.test.tsx`
    Expected: PASS

- [ ] **Step 7: Commit**

    ```bash
    git add frontend/utils/auth.ts frontend/pages/_app.tsx frontend/pages/dashboard.tsx frontend/tests/auth_middleware.test.tsx backend/app/auth/google_oauth.py
    git commit -m "feat: Implement protected routes and session management"
    ```
