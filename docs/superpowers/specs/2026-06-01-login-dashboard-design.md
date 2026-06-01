# Design Spec: US2 - Login & Dashboard UI

**Date:** 2026-06-01
**Status:** In Progress (Pending User Review)

## 1. Overview
The goal of this task is to implement the UI for the Login and Dashboard pages. The login screen will feature a split-screen layout with an illustration on the left and branding/Google login on the right. The dashboard will be a simple protected screen.

## 2. Architecture & Routing
- **Routes:**
  - `/login`: Public login page.
  - `/dashboard`: Protected dashboard page.
- **Authentication Flow (UI Simulation):**
  - Use a simulated `AuthContext` to manage `isAuthenticated` state.
  - Implement basic redirect logic:
    - Unauthenticated -> `/dashboard` redirects to `/login`.
    - Authenticated -> `/login` redirects to `/dashboard`.

## 3. UI/UX Design
### Login Page (`/login`)
- **Split-Screen Layout:**
  - **Left Panel:** Illustration/image placeholder.
  - **Right Panel:** Branding-heavy layout:
    - "Notes LLM" Logo.
    - "Welcome back" heading.
    - "Sign in to continue" sub-headline.
    - "Login with Google" button (with Google icon).
### Dashboard Page (`/dashboard`)
- Simple, clean layout.
- "Welcome to your dashboard" message.
- "Logout" button (for testing redirect logic).

## 4. Components
- `LoginPage` (src/app/login/page.tsx)
- `DashboardPage` (src/app/dashboard/page.tsx)
- `AuthContext` (src/context/AuthContext.tsx)
- `ProtectedRoute` (src/components/ProtectedRoute.tsx)

## 5. Technical Specifications
- **Styling:** Tailwind CSS.
- **Icons:** Lucide-react for the Google icon.

## 6. Success Criteria
- [ ] Login page UI matches the Branding-Heavy design.
- [ ] Dashboard page UI is implemented.
- [ ] Redirect logic works:
    - Non-logged-in user on /dashboard -> redirects to /login.
    - Logged-in user on /login -> redirects to /dashboard.
- [ ] Logout functionality is available on the dashboard for testing.
