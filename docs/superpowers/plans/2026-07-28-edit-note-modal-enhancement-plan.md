# EditNoteModal Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect Save button, add loading state, and add error handling to EditNoteModal.

**Architecture:**
- Use `useState` for `isLoading` and `error` states.
- Update `handleSave` to use these states.
- Disable button when `isLoading` is true.
- Render an error message if `error` is truthy.

**Tech Stack:** React, Material UI, Vitest

---

### Task 1: Update EditNoteModal component

**Files:**
- Modify: `frontend/src/components/EditNoteModal.tsx`

- [ ] **Step 1: Add loading and error state**

```tsx
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
```

- [ ] **Step 2: Create handleSave function**

```tsx
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onSave(name);
      onClose();
    } catch (e) {
      setError('Failed to save note');
      setIsLoading(false);
    }
  };
```

- [ ] **Step 3: Update UI**

```tsx
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/EditNoteModal.tsx
git commit -m "feat: add loading and error state to EditNoteModal"
```

### Task 2: Update tests for EditNoteModal

**Files:**
- Modify: `frontend/src/__tests__/EditNoteModal.test.tsx`

- [ ] **Step 1: Add test for loading state**

```tsx
  test('disables save button while loading', async () => {
    const mockOnSave = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(
      <EditNoteModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialName="My Note"
      />
    );
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    expect(saveButton).toBeDisabled();
    expect(screen.getByText(/Saving.../i)).toBeDefined();
  });
```

- [ ] **Step 2: Add test for error state**

```tsx
  test('displays error message on save failure', async () => {
    const mockOnSave = vi.fn().mockRejectedValue(new Error('Save failed'));
    render(
      <EditNoteModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialName="My Note"
      />
    );
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    const errorMessage = await screen.findByText(/Failed to save note/i);
    expect(errorMessage).toBeDefined();
  });
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/__tests__/EditNoteModal.test.tsx
git commit -m "test: update EditNoteModal tests with loading and error states"
```
