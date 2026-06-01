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

## US2: Login & Dashboard UI
**Status:** In Progress
**Description:** As a user, I want a secure-looking login page with Google authentication and a dashboard, so that I can access my notes.

**Acceptance Criteria:**
- Login page UI features a split-screen layout (left: illustration, right: branding + "Login with Google" button).
- Dashboard page UI is simple and clean.
- Simulated authentication flow:
    - Unauthenticated user on `/dashboard` redirects to `/login`.
    - Authenticated user on `/login` redirects to `/dashboard`.
- Logout functionality available on the dashboard for testing.
