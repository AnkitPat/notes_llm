# Edit Note Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `EditNoteModal` component with TDD.

**Architecture:** Create a functional React modal component mimicking `CreateNoteModal`, but with `initialName` prop and `onSave` callback.

**Tech Stack:** Next.js, React, Material UI, Vitest, React Testing Library.

---

### Task 1: Create Test Suite for EditNoteModal

**Files:**
- Create: `frontend/src/__tests__/EditNoteModal.test.tsx`

- [ ] **Step 1: Write test for rendering and initial value**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EditNoteModal } from '../components/EditNoteModal';
import { vi } from 'vitest';

describe('EditNoteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  test('renders with initial name', () => {
    render(
      <EditNoteModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialName="My Note"
      />
    );
    const input = screen.getByLabelText(/Note Name/i) as HTMLInputElement;
    expect(input.value).toBe('My Note');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test frontend/src/__tests__/EditNoteModal.test.tsx`
Expected: FAIL ("EditNoteModal is not defined")

- [ ] **Step 3: Commit**

```bash
git add frontend/src/__tests__/EditNoteModal.test.tsx
git commit -m "test: create initial test for EditNoteModal"
```

### Task 2: Implement Basic EditNoteModal

**Files:**
- Create: `frontend/src/components/EditNoteModal.tsx`

- [ ] **Step 1: Write minimal implementation**

```tsx
'use client';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  initialName: string;
}

export function EditNoteModal({ isOpen, onClose, onSave, initialName }: EditNoteModalProps) {
  const [name, setName] = useState(initialName);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box>
        <Typography>Edit Note</Typography>
        <TextField
          label="Note Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={onClose}>Cancel</Button>
      </Box>
    </Modal>
  );
}
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm test frontend/src/__tests__/EditNoteModal.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/EditNoteModal.tsx
git commit -m "feat: implement EditNoteModal basic structure"
```

### Task 3: Implement Save functionality

**Files:**
- Modify: `frontend/src/__tests__/EditNoteModal.test.tsx`
- Modify: `frontend/src/components/EditNoteModal.tsx`

- [ ] **Step 1: Add test for save functionality**

```tsx
  test('calls onSave with updated name', async () => {
    render(
      <EditNoteModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialName="My Note"
      />
    );
    const input = screen.getByLabelText(/Note Name/i);
    fireEvent.change(input, { target: { value: 'Updated Note' } });
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith('Updated Note');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test frontend/src/__tests__/EditNoteModal.test.tsx`
Expected: FAIL (Save button not found)

- [ ] **Step 3: Update implementation**

```tsx
// frontend/src/components/EditNoteModal.tsx
// Add loading and error state similar to CreateNoteModal
// Add form submit handler calling onSave
// Add Save button
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test frontend/src/__tests__/EditNoteModal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/EditNoteModal.tsx frontend/src/__tests__/EditNoteModal.test.tsx
git commit -m "feat: implement save functionality"
```
