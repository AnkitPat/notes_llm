# User Stories

## US1: Initial Frontend Setup
**Status:** Done
**Description:** As a user, I want to see a functional home page when I navigate to the application URL, so I know the system is up and running.

**Acceptance Criteria:**
- Next.js project is initialized.
- A basic home page is rendered at `/`.
- The home page displays a welcome message (e.g., "Welcome to Notes LLM").
- The project follows the established technical conventions (ESLint, Prettier, TypeScript).
- Unit tests for the home page are implemented and passing.

## US2: NextAuth.js Configuration
**Status:** Not Started
**Description:** As a user, I want to be able to sign in using Google, so that I can access secure areas of the application.

**Acceptance Criteria:**
- `next-auth` dependency is installed.
- NextAuth API route is configured at `app/api/auth/[...nextauth]/route.ts`.
- Google Provider is configured using environment variables.
- A basic sign-in callback is implemented.

## US3: Backend Initialization
**Status:** In Progress
**Description:** As a user, I want a functional FastAPI backend so that I can check if users are verified.

**Acceptance Criteria:**
- FastAPI backend project structure initialized in `backend/`.
- `requirements.txt` with `fastapi`, `uvicorn`, `resend` created.
- `backend/data/verified_users.json` initialized with `{"verified_users": []}`.
- `backend/main.py` implemented with FastAPI initialization.
- GET `/check-status/{email}` endpoint implemented.
- Logic to read `verified_users.json` and return `{"verified": bool}` implemented.

## US4: Verification Email via Resend
**Status:** Not Started
**Description:** As a user, I want to receive a verification email upon signing in, so that I can confirm my account.

**Acceptance Criteria:**
- `resend` dependency is installed.
- NextAuth `events.signIn` callback is updated to trigger verification email.
- Email is sent to `siddeshgandhe@gmail.com`.
- Email includes verification link `http://localhost:8000/verify?email=${user.email}`.
- Environment variable `RESEND_API_KEY` is utilized.

