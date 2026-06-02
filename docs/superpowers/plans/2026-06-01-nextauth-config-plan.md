# Implementation Plan: NextAuth.js Configuration

## Steps
1. Install `next-auth` in `frontend/`.
2. Create `frontend/src/app/api/auth/[...nextauth]/route.ts`.
3. Configure `GoogleProvider`.
4. Add `signIn` callback.
5. Verify setup.
6. Commit changes.

## Verification
- Run `npm run dev` to ensure no build errors.
- (Manual) Attempt to navigate to `/api/auth/signin` to confirm the route handler is loaded (will fail without credentials, but validates route existence).
