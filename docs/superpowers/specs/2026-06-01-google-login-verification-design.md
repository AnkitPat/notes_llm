# Design Spec: US3 - Google Login & Owner Verification

**Date:** 2026-06-01
**Status:** Approved

## 1. Overview
Implement real Google authentication via NextAuth.js, automated notification emails via Resend, and a user verification workflow managed by a new FastAPI backend.

## 2. Architecture
- **Auth:** NextAuth.js with Google provider.
- **Email:** Resend API.
- **Backend:** FastAPI for verification logic and data storage.
- **Verification Storage:** `backend/data/verified_users.json`.

## 3. Workflow
1. **Login:** NextAuth redirects to Google. Upon success, the user is authenticated in the frontend.
2. **Notification:** NextAuth `signIn` event triggers a server action that sends an email via Resend to the owner (`siddeshgandhe@gmail.com`).
3. **Verification:**
   - Email contains a link to `http://localhost:8000/verify?email=...`.
   - Backend endpoint `/verify` updates `verified_users.json`.
4. **App Access:** Frontend polls/checks `GET /check-status/{email}` to enable full dashboard access.

## 4. Technical Requirements
- **Frontend:** Install `next-auth`, `resend`, configure Auth routes.
- **Backend:** FastAPI setup, endpoint implementation, JSON file storage.
- **Env:** Credentials needed (GOOGLE_CLIENT_ID, SECRET, RESEND_API_KEY).

## 5. Success Criteria
- [ ] User can log in with Google.
- [ ] Email sent to owner upon successful login.
- [ ] Owner can verify user via backend link.
- [ ] Frontend verifies user status and unlocks dashboard.
