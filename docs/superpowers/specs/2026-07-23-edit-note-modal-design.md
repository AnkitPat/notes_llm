# Edit Note Modal Design Spec

## Goal
Implement `EditNoteModal.tsx` to allow users to update the name of an existing note.

## UI/UX
- Similar design to `CreateNoteModal`.
- Modal titled "Edit Note".
- `TextField` pre-filled with the current note name.
- "Save" button to submit changes.
- "Cancel" button to dismiss.

## Architecture
- React component using `@mui/material` components.
- Props: `isOpen`, `onClose`, `initialName`, `onSave: (newName: string) => Promise<void>`.
- Internal state for `name`, `isLoading`, `error`.

## Data Flow
- `initialName` is passed as a prop and used to initialize the `name` state.
- `onSave` is called with the updated name.
- Modal closes on successful save or cancel.
- Errors are displayed in an `Alert`.

## Testing
- Use Vitest and React Testing Library (following established patterns in `frontend/src/__tests__`).
- Tests:
    - Renders with pre-filled name.
    - Updates name state when typing.
    - Calls `onSave` with new name on submit.
    - Displays error if `onSave` fails.
    - Closes on cancel.
