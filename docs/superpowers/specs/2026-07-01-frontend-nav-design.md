# Design Spec: Frontend Navigation Refactoring

## Problem
The current application structure uses a `/dashboard` route for all interactions, and `/` is a public marketing page that is no longer needed. The user experience needs to be streamlined into a "list of notes" (home page) and "note detail" (dashboard) pattern.

## Solution
1. **Authenticated Home Page (`/`)**:
    - Replaces the public landing page with an authenticated view.
    - Displays a grid/list of note cards.
    - Includes a "Create New Note" action.
2. **Note Detail Page (`/notes/[note_id]`)**:
    - Replaces the `/dashboard` route.
    - Migrates all functionality from the current dashboard (resource management, content display, chat).
3. **Authentication & Redirection**:
    - All routes (except `/login`) will be protected.
    - Unauthenticated users will be redirected to `/login`.

## Implementation Details
- Update `frontend/src/middleware.ts` to protect `/` and `/notes/:path*`.
- Move `frontend/src/app/dashboard/page.tsx` content to `frontend/src/app/notes/[note_id]/page.tsx`.
- Create a new `frontend/src/app/page.tsx` that fetches/displays dummy note cards and includes a "Create New Note" link.

## Success Criteria
- Accessing `/` while unauthenticated redirects to `/login`.
- Authenticated users land on `/` and see a list of notes.
- Clicking a note redirects to `/notes/{note_id}`.
- All dashboard functionality persists in the note detail view.
