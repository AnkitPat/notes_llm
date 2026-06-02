# Verification Email Implementation Plan

**Goal:** Implement verification email using Resend on user sign-in.

**Architecture:** Update NextAuth config's events to use Resend.

**Tech Stack:** Next.js, NextAuth, Resend.

---

### Task 1: Install Dependencies
- Install `resend`.
- Run: `npm install resend` in `frontend/`.

### Task 2: Configure Resend in NextAuth
- Modify: `frontend/src/app/api/auth/[...nextauth]/route.ts`.
- Add Resend initialization and `events.signIn` callback.

### Task 3: Test Implementation
- Verify `resend` integration (mocking or dry run).
- Verify email content.
