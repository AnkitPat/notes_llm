# Design Spec: Refined Auth & Email Flow

## Overview
1. Update admin notification email to a branded, visual template.
2. The approval link in the email should point to a frontend route (e.g., `/api/admin/approve?email=...`) rather than a direct backend URL.
3. Restrict user landing pages to only: `/login`, `/waiting-verification`, or `/dashboard`.

## Proposed Architecture

### 1. Email Template
- Use a HTML-based template (as previewed) in `frontend/src/lib/email-templates.ts`.
- Link: `http://localhost:3000/api/admin/approve?email=${user.email}`.
- This endpoint will perform the approval and then redirect to a confirmation page.

### 2. Route Restriction (Middleware)
- Create `frontend/src/middleware.ts`.
- Define protected routes: `/dashboard`, `/waiting-verification`, `/api/...`.
- If unauthenticated: redirect to `/login`.
- If authenticated and unverified: allow `/waiting-verification`, redirect everything else to it.
- If authenticated and verified: allow `/dashboard`, redirect `/waiting-verification` to `/dashboard`.

## Testing Strategy
- **Email:** Manually verify email content and link structure.
- **Route Restriction:**
    - Test unauthenticated access (redirect to login).
    - Test authenticated, unverified access (redirect to waiting).
    - Test authenticated, verified access (redirect to dashboard).
