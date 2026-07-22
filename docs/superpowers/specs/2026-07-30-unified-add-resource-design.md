# Design: Unified "Add Resource" Workflow

## Overview
Unify the resource creation process into a single drawer UI. Instead of separate workflows for notes/links and documents, all resource types will be created through the `UpsertResourceDrawer`. Document uploads will be integrated directly into the drawer to streamline the experience.

## Objectives
- Improve UX by providing a single point of entry for adding any resource type.
- Maintain existing file upload functionality while simplifying the workflow for the user.
- Provide clear visual feedback during the file upload process within the same UI.

## Components & UI Changes

### 1. `ResourceNavigation` Component
- **Trigger:** Rename "Add Note/Link" button to "Add Resource".
- **Logic:**
    - The button will continue to open the `UpsertResourceDrawer` in 'create' mode.
    - Remove the separate "Upload PDF/Doc" button.

### 2. `UpsertResourceDrawer` Component
- **Enhanced State:**
    - Add state to track file upload status: `idle` | `uploading` | `success` | `error`.
    - Add state to store the uploaded file information (e.g., URL/link, filename).
- **Document Selection:**
    - When `type` is set to 'Document', render a file input and an "Upload" button.
- **Workflow:**
    1. User selects "Document" type.
    2. Input field for file selection appears.
    3. User selects file and clicks "Upload".
    4. Drawer displays upload progress/status.
    5. On success: Store the returned `webViewLink` (or similar) from the backend as the `content` field.
    6. Disable the "Create" button until upload succeeds (if it's a Document type).
    7. User clicks "Create" to submit final resource metadata.

## Data Flow
1. **Frontend Request:** `frontend/src/lib/api.ts` `uploadDocument(file, email)` is called.
2. **Backend Proxy:** `POST /upload` (existing endpoint) handles the request, interacts with the B2 helper, and returns the file metadata.
3. **Frontend Response:** Upon success, the drawer updates the resource state with the file link.
4. **Final Submit:** When the user clicks "Create", a `POST /resources` request is sent with the consolidated resource data (Type, Title, Link).

## Testing Strategy
- **Unit/Integration:**
    - Verify drawer correctly handles the "Document" type selection.
    - Verify file upload state transitions (idle -> uploading -> success).
    - Verify "Create" button availability based on upload success status.
    - Validate API calls (mocking the `upload` and `resources` endpoints).
