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

## US5: Waiting for Verification Flow
**Status:** Not Started
**Description:** As a new user, I want to be redirected to a "Waiting for Verification" page after my first Google login, so I understand why I can't access the dashboard yet.

**Acceptance Criteria:**
- New page `/waiting-verification` is created with branding-consistent UI.
- `ProtectedRoute` is updated to check backend verification status.
- Unverified users are redirected to `/waiting-verification` when trying to access protected routes.
- "Logout" button on `/waiting-verification` works correctly.
- "Refresh Status" button on `/waiting-verification` checks status again.

## US6: Dashboard UI (Frontend Only)
**Status:** Not Started
**Description:** As a user, I want to view a dashboard with a list of my resources (Documents, Links, Notes) and the ability to add new ones, so that I can easily manage and interact with my content. I also want to view the content of selected resources and ask questions about them.

**Acceptance Criteria:**
- The dashboard page is accessible (e.g., at `/dashboard`).
- A left panel displays a list of resource types: "Documents", "Links", and "Notes".
- An "Add Resource" option is present at the bottom of the left panel.
- A right panel (occupying approximately 70% of the screen) displays the content of the currently selected resource.
- The right panel includes a section for asking questions and viewing answers (chat/Q&A).
- The UI uses dummy sample data for resources and content.
- No backend logic is modified for this user story.

## US7: Refactor Dashboard Resource Navigation
**Status:** In Progress
**Description:** As a user, I want a modern sidebar for navigation, so that I can easily distinguish between resources and navigate comfortably.

**Acceptance Criteria:**
- `ResourceNavigationItem` component created.
- `ResourceNavigation` refactored to use `ResourceNavigationItem`.
- Tests pass.

## US8: Real-time Resource Creation Preview
**Status:** In Progress
**Description:** As a user, when I am adding a new resource (Note or Link) in the dashboard, I want to see a real-time preview of the title and typed content/link below the Create button before I click Create, so that I can verify its styling and content without having to save first.

**Acceptance Criteria:**
- A dynamic live preview section is added below the "Create" button inside the form view of `AddResourceDrawer`.
- The live preview displays the resource title (defaults to "Untitled" if empty).
- For a "Note" resource type, the content is rendered live as rich HTML using `dangerouslySetInnerHTML`.
- For a "Link" resource type, a styled button is shown that serves as a live link preview (`target="_blank"`), displaying the input URL.
- The live preview section only appears when at least one field (Title, Content, or Link URL) is non-empty.
- Unit/integration tests are added/updated to verify the preview block behavior.

