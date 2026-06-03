# Design Spec: Waiting for Verification Flow

## Overview
Implement a redirection flow that intercepts unverified users after Google login and directs them to a "Waiting for Verification" page until an administrator (owner) approves their account.

## Architecture
- **Frontend (Next.js):**
    - New Page: `/src/app/waiting-verification/page.tsx`
    - Component Update: `/src/components/ProtectedRoute.tsx`
- **Backend (FastAPI):**
    - Existing endpoint `GET /check-status/{email}` will be used by the frontend to verify status.

## Data Flow
1. User logs in via Google (NextAuth).
2. User is redirected to `/dashboard` (default behavior).
3. `ProtectedRoute` (wrapping `/dashboard`) executes:
    - Checks if `session` exists.
    - If logged in, calls `http://localhost:8000/check-status/{email}`.
    - If `verified: false`, redirects to `/waiting-verification`.
4. `/waiting-verification` page:
    - Displays a "Verification Pending" message.
    - Provides a "Refresh Status" button (calls backend and redirects to `/dashboard` if verified).
    - Provides a "Logout" button (calls `signOut()`).

## Components

### 1. `ProtectedRoute` Update
- Add state `isVerified` (initially `null` or `loading`).
- Use `useEffect` to fetch status from backend when `session` is available.
- If unverified, `router.push('/waiting-verification')`.

### 2. `WaitingVerificationPage`
- UI matching the approved mockup.
- Uses `useSession` to get user info.
- Uses `signOut` from `next-auth/react`.
- "Refresh Status" logic:
    ```typescript
    const checkStatus = async () => {
      const res = await fetch(`http://localhost:8000/check-status/${session.user.email}`);
      const data = await res.json();
      if (data.verified) {
        router.push('/dashboard');
      }
    };
    ```

## Error Handling
- If backend is down, `ProtectedRoute` should ideally show an error or retry, but for now, we'll assume it's available or handle it with a basic try-catch that keeps the user on a loading state or the waiting page.

## Testing Strategy
- **Unit Tests:**
    - Test `ProtectedRoute` with mocked backend responses (verified/unverified).
    - Test `WaitingVerificationPage` buttons (Logout, Refresh).
- **Manual Verification:**
    - Log in with a new email.
    - Verify redirection to `/waiting-verification`.
    - Manually add email to `backend/data/verified_users.json`.
    - Click "Refresh Status" and verify redirection to `/dashboard`.
