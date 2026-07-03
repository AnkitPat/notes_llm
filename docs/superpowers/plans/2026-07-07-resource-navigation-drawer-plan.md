# Implementation Plan: Integrate AddResourceDrawer into ResourceNavigation

## Goal
Replace the inline resource addition form in `ResourceNavigation` with `AddResourceDrawer`.

## Steps
1. **Prepare**: Create a backup of `ResourceNavigation.tsx` and `ResourceNavigation.test.tsx` (not strictly required if using git, but good practice).
2. **Update Tests**:
    - Update `ResourceNavigation.test.tsx` to reflect the removal of the inline form and introduction of the drawer.
    - Test that "Add Note/Link" button opens the drawer.
    - Test that submitting in the drawer calls `onAddResource`.
3. **Implementation**:
    - Modify `ResourceNavigation.tsx`:
        - Remove state variables for inline form.
        - Add state for drawer open/close.
        - Import `AddResourceDrawer`.
        - Replace inline form with `<AddResourceDrawer />`.
4. **Validation**:
    - Run `npm test` to ensure tests pass.
    - Manually verify UI (if possible).
5. **Finalization**:
    - Clean up code.
    - Commit.
