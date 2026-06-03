# Design Spec: NextAuth.js Configuration

## Overview
Configure NextAuth.js on the frontend to enable Google-based authentication.

## Technical Details
- Dependency: `next-auth`
- Route Handler: `frontend/src/app/api/auth/[...nextauth]/route.ts`
- Provider: `GoogleProvider`
- Configuration: Use `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from environment variables.
- Callback: Implement `signIn` callback for logging.

## Success Criteria
- Authentication routes are functional.
- Environment variables are utilized correctly.
- Sign-in callback logs event.
