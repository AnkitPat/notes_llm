# Design Spec: Note Card Management (Edit/Delete)

## Overview
This feature adds the ability for users to edit and delete note cards directly from the dashboard navigation panel.

## Architecture

### Frontend
- **Component Modifications**:
  - `ResourceNavigationItem`: Add a 3-dot menu (`MoreVertIcon`) as a child element of the `ListItemButton`.
  - `Menu`: Use `@mui/material/Menu` to show "Edit" and "Delete" options.
- **New Components**:
  - `EditNoteModal`: A dialog to edit note title.
  - `DeleteNoteConfirmationDialog`: A dialog to confirm note deletion.

### Backend
- **API Endpoints**:
  - `PUT /notes/{noteId}`: Update note metadata (e.g., `title`).
  - `DELETE /notes/{noteId}`: Delete the note by ID.

## Data Flow
1. User clicks 3-dot menu.
2. User selects action (Edit or Delete).
3. If Edit: Open `EditNoteModal`, user inputs new title, calls `PUT /notes/{id}`.
4. If Delete: Open `DeleteNoteConfirmationDialog`, user confirms, calls `DELETE /notes/{id}`.
5. On success, refresh the dashboard resource list.

## Testing
- **Backend**: Add tests for new routes in `backend/tests/test_notes_routes.py`.
- **Frontend**: Add tests for `ResourceNavigationItem` (menu opening, dialog triggering) in `frontend/src/__tests__/ResourceNavigationItem.test.tsx`.
