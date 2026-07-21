# Design Spec: Enable Edit & Delete for Link Resources

## Overview
This spec outlines the extension of edit and delete functionality to "Link" resources in the notebook application. Currently, these actions are only available for "Note" resources.

## 1. Scope
The scope is limited to enabling the existing action menu (`MoreVertIcon`) for `Link` resource types in the `ResourceNavigationItem` component.

## 2. Frontend Changes
- **`frontend/src/components/ResourceNavigationItem.tsx`**:
    - Update the condition `resource.type === 'Note'` to include `resource.type === 'Link'`.
    - This will enable the `MoreVertIcon` and the associated `Menu` (Edit/Delete) for links.
- **Integration**:
    - The `onEdit` and `onDelete` handlers are already passed as props and handled in the `NoteDetailPage`. No changes are required in those handlers to support links.

## 3. Data Flow
- **Edit/Delete (Links)**:
    - User clicks the menu icon for a Link.
    - Edit/Delete actions trigger the same `handleEditResource` and `handleDeleteResource` functions as Note resources.
    - `UpsertResourceDrawer` and the backend `PATCH`/`DELETE` endpoints are already capable of handling Link types.

## 4. Testing Plan
- **UI**: Verify the action menu appears on Link items in the resource list.
- **Functional**: Verify Edit functionality works for a Link (opens drawer, updates correctly).
- **Functional**: Verify Delete functionality works for a Link (triggers confirmation, deletes correctly).
