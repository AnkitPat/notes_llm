# Verification Email via Resend Design

**Goal:** Send a verification email to `siddeshgandhe@gmail.com` when a user signs in.

**Architecture:**
- Leverage the `signIn` event in the NextAuth configuration.
- Integrate the Resend Node.js SDK to trigger email dispatch.
- Verification link points to a frontend URL for verification (`http://localhost:8000/verify?email=${user.email}`).

**Components:**
- `frontend/src/app/api/auth/[...nextauth]/route.ts`: Updated to include `events.signIn` callback.

**Data Flow:**
- User signs in via Google.
- NextAuth `signIn` event triggers.
- `signIn` callback invokes Resend SDK.
- Resend sends email.

**Error Handling:**
- Log error if email fails to send.
- Do not block user sign-in if email fails (it is an event).
