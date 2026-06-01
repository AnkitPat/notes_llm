# Authentication Module Design

## Date: 2026-06-01

## Objective

To design the initial authentication module for the `notes_llm` application, including the login screen user interface and the user access control flow for new registrations via Google OAuth.

## Design Decisions

### 1. Login Screen (Frontend)

The login screen will feature a two-panel horizontal split layout, designed for a clean and intuitive user experience.

*   **Left Panel (Visuals):**
    *   **Content:** A dedicated area for an image. This will initially be a placeholder, with the design explicitly supporting future configurability for custom images (e.g., via an admin panel or configuration file). This allows for branding and visual appeal without hardcoding.
*   **Right Panel (Login Form):**
    *   **Content:**
        *   **Welcome Message:** A brief, inviting message positioned above the login button: "Your personal knowledge hub. Log in to access your notes."
        *   **Login Button:** A prominent "Login with Google" button, utilizing Google OAuth for user authentication.

### 2. User Authentication Flow (Backend & Frontend)

A controlled access flow will be implemented for new users, requiring manual approval to ensure data security and administrative oversight.

*   **Initial User Authentication:**
    *   Users will initiate login by clicking the "Login with Google" button, which will redirect them to Google for OAuth authentication.
    *   Upon successful authentication with Google, the user's basic profile information will be retrieved.
*   **New User Access Control (Post-Google Login):**
    *   **Pending Access State:** Any user logging in for the first time via Google OAuth will *not* automatically gain access to the `notes_llm` application. Their account will be created or marked with a "pending access" status within the system.
    *   **Administrator Notification:** Immediately upon a new user's successful Google login and entry into the "pending access" state, an automated email notification will be dispatched to a designated administrator email address: `siddeshgandhe@gmail.com`.
    *   **Access Confirmation Link:** The notification email sent to `siddeshgandhe@gmail.com` will contain a secure, unique link. Clicking this link will serve as the explicit approval action, updating the new user's status from "pending access" to "approved" in the system.
    *   **User Experience for Unapproved Users:** After completing the Google OAuth process, if a user's access is still pending, they will be redirected to a dedicated "Waiting for Approval" screen within the `notes_llm` application. This screen will clearly inform them of their pending status and the need for administrative approval.
*   **Approved User Access:**
    *   Once a user is approved by `siddeshgandhe@gmail.com` (via the confirmation link), their status will be updated in the backend.
    *   On their subsequent login attempts or session refreshes, approved users will be granted full access to the `notes_llm` application.

## Spec Self-Review

*   **Placeholder scan:** No placeholders (`TBD`, `TODO`) or incomplete sections.
*   **Internal consistency:** The design clearly outlines the frontend UI elements and their interaction with the backend authentication and authorization flow. The pending access state and email approval process are consistently described.
*   **Scope check:** The design focuses solely on the authentication module, covering the login screen and user access flow, aligning with the initial request to start with Module 1.
*   **Ambiguity check:** The requirements for the welcome message, image placeholder, Google login, email trigger, approval mechanism, and user redirection are explicit.

---
