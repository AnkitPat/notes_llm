# Design Spec: Integrate AddResourceDrawer into ResourceNavigation

## Overview
This design replaces the existing inline form in `ResourceNavigation` for adding resources with the `AddResourceDrawer` component.

## Architecture
- `ResourceNavigation` component will be updated to:
  - Remove inline form state (`showAddForm`, `newResourceTitle`, etc.).
  - Add state for drawer visibility (`isAddDrawerOpen`).
  - Import and render `AddResourceDrawer` component.
  - Bind "Add Note/Link" button to open the drawer.

## Components
- `ResourceNavigation`:
  - New state: `isAddDrawerOpen` (boolean).
  - Updated "Add Note/Link" button: `onClick={() => setIsAddDrawerOpen(true)}`.
  - Rendered component: `<AddResourceDrawer open={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} onAdd={onAddResource} />`.
- `AddResourceDrawer`:
  - Remains unchanged, consumed by `ResourceNavigation`.

## Data Flow
- `ResourceNavigation` triggers `AddResourceDrawer` open.
- `AddResourceDrawer` calls `onAdd` (passed from props) to handle submission.
- `ResourceNavigation` handles `onAdd` logic as it did before.

## Testing
- Update `ResourceNavigation.test.tsx` to:
  - Check for drawer open behavior.
  - Verify `onAddResource` is called when adding a resource via the drawer.
