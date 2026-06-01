# User Story: Authentication Module

## User Story: New User Registration & Access Approval

**As a new user,**
I want to easily sign up for `notes_llm` using my Google account,
so that I can quickly get started with the application.

**As an administrator (siddeshgandhe@gmail.com),**
I want to receive notifications for new user sign-ups and have a simple way to approve or deny their access,
so that I can maintain control over who uses the application and ensure data security.

---

## Acceptance Criteria

### For New Users:

1.  **GIVEN** I am a new user
    **WHEN** I navigate to the `notes_llm` login page
    **THEN** I see a clear login screen with an image on the left and a "Login with Google" button on the right, accompanied by the welcome message "Your personal knowledge hub. Log in to access your notes."
2.  **GIVEN** I am a new user
    **WHEN** I click "Login with Google" and successfully authenticate with my Google account
    **THEN** I am redirected to a "Waiting for Approval" screen, informing me that my account is pending administrator review.
3.  **GIVEN** I am an unapproved user
    **WHEN** I attempt to access any protected part of the application
    **THEN** I am redirected back to the "Waiting for Approval" screen.
4.  **GIVEN** I am an approved user
    **WHEN** I log in
    **THEN** I am granted full access to the application.

### For Administrator (siddeshgandhe@gmail.com):

1.  **GIVEN** a new user successfully signs up via Google
    **WHEN** their account is created with a "pending access" status
    **THEN** an email notification is automatically sent to `siddeshgandhe@gmail.com`, containing a unique link to approve the new user's access.
2.  **GIVEN** I receive an email notification for a new user
    **WHEN** I click the approval link in the email
    **THEN** the new user's status is updated to "approved" in the system.
3.  **GIVEN** a user's access has been approved
    **WHEN** that user subsequently logs in
    **THEN** they gain full access to the application.

---

## UI/UX Considerations:

*   **Login Page:** Horizontal split layout, configurable image placeholder on the left, welcome message and "Login with Google" button on the right.
*   **Waiting for Approval Page:** A dedicated, user-friendly page informing the user of their pending status.

## Non-Functional Requirements:

*   **Security:** Google OAuth 2.0 will be used for authentication. Access control based on approval status will be enforced at the backend.
*   **Email System:** A reliable email sending service will be integrated for administrator notifications.
*   **Scalability:** The user and approval management system should be designed to handle a growing number of users.

---
