# Create Note Modal Design Specification

## Overview
Implement a custom-built modal to allow users to create a new note with a required name.

## Functional Requirements
- **Trigger**: Opening the modal from the "Create New Note" button in the dashboard.
- **Input**: "Note Name" (required).
- **Actions**:
    - **Submit**: Calls `POST /notes` with the name and email.
    - **Cancel**: Closes the modal.
- **Feedback**:
    - Loader displayed during submission.
    - Error handling for failed requests.

## Technical Design
- **State Management**: React `useState` for `isOpen`, `isLoading`, and `error`.
- **API Integration**: `fetch` API for `POST /notes` endpoint.
- **Styling**: Tailwind CSS, consistent with the existing dashboard styling.
- **Component**: New `CreateNoteModal` component in `frontend/src/components/`.

## Data Flow
1. User clicks "Create New Note".
2. `isOpen` set to `true`.
3. User enters name and clicks "Create".
4. `isLoading` set to `true`.
5. API call to backend.
6. On success: close modal, refresh dashboard.
7. On failure: show error.
