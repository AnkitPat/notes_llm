# Edit & Delete Resource Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement edit and delete functionality for resources, reusing the `AddResourceDrawer` as an "Upsert" drawer and adding deletion confirmation.

**Architecture:** 
- Extend `backend/routes/resources.py` with `DELETE` endpoint.
- Refactor `AddResourceDrawer` to `UpsertResourceDrawer` to handle both create and edit modes.
- Implement deletion confirmation logic in `NoteDetailPage` using a Dialog.

**Tech Stack:** FastAPI, Next.js, Material UI.

---

### Task 1: Backend Implementation & Testing

**Files:**
- Modify: `backend/routes/resources.py`
- Modify: `backend/tests/test_mongodb_routes.py`

- [ ] **Step 1: Implement `DELETE /resources/{resource_id}`**

Modify `backend/routes/resources.py`:

```python
@router.delete("/resources/{resource_id}", status_code=204)
async def delete_resource(resource_id: str):
    result = await db.resources.delete_one({"_id": ObjectId(resource_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    return None
```

- [ ] **Step 2: Add tests for delete functionality**

Modify `backend/tests/test_mongodb_routes.py`:

```python
def test_delete_resource():
    with patch("routes.resources.db.resources.delete_one", new_callable=AsyncMock) as mock_delete:
        mock_delete.return_value = MagicMock(deleted_count=1)
        response = client.delete(f"/resources/{VALID_RES_ID}")
        assert response.status_code == 204

def test_delete_resource_nonexistent():
    with patch("routes.resources.db.resources.delete_one", new_callable=AsyncMock) as mock_delete:
        mock_delete.return_value = MagicMock(deleted_count=0)
        response = client.delete(f"/resources/{VALID_RES_ID}")
        assert response.status_code == 404
```

- [ ] **Step 3: Verify backend tests pass**

Run: `PYTHONPATH=. pytest tests/test_mongodb_routes.py`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add backend/routes/resources.py backend/tests/test_mongodb_routes.py
git commit -m "feat(backend): add delete resource endpoint and tests"
```

---

### Task 2: Refactor `AddResourceDrawer` to `UpsertResourceDrawer`

**Files:**
- Modify: `frontend/src/components/AddResourceDrawer.tsx`
- Modify: `frontend/src/components/ResourceNavigation.tsx` (Update usage)

- [ ] **Step 1: Update Drawer to support Edit mode**

Modify `frontend/src/components/AddResourceDrawer.tsx`:

```tsx
// Rename component to UpsertResourceDrawer and update props
interface Props {
  open: boolean;
  onClose: () => void;
  onUpsert: (type: ResourceType, title: string, content: string, link?: string, id?: string) => void;
  noteId: string;
  initialData?: Resource;
  mode: 'create' | 'edit';
}

export const UpsertResourceDrawer: React.FC<Props> = ({ open, onClose, onUpsert, noteId, initialData, mode }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState<ResourceType>(initialData?.type || 'Note');
  const [content, setContent] = useState(initialData?.content || '');
  const [link, setLink] = useState(initialData?.type === 'Link' ? initialData.content : '');
  // ... rest of state and submit logic to handle PATCH vs POST
  
  // Inside handleSubmit:
  // const method = mode === 'edit' ? 'PATCH' : 'POST';
  // const url = mode === 'edit' ? `http://localhost:8000/resources/${initialData?.id}` : 'http://localhost:8000/resources';
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/AddResourceDrawer.tsx
git commit -m "feat(frontend): refactor AddResourceDrawer to UpsertResourceDrawer"
```

---

### Task 3: Resource Deletion & Integration

**Files:**
- Create: `frontend/src/components/DeleteResourceConfirmationDialog.tsx`
- Modify: `frontend/src/app/notes/[note_id]/page.tsx`
- Modify: `frontend/src/components/ResourceNavigationItem.tsx`

- [ ] **Step 1: Create Delete Confirmation Dialog**

Create `frontend/src/components/DeleteResourceConfirmationDialog.tsx`:

```tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteResourceConfirmationDialog: React.FC<Props> = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete Resource</DialogTitle>
    <DialogContent>
      <DialogContentText>Are you sure you want to delete this resource?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error">Delete</Button>
    </DialogActions>
  </Dialog>
);
```

- [ ] **Step 2: Update `NoteDetailPage` and `ResourceNavigation` logic**

Modify `frontend/src/app/notes/[note_id]/page.tsx` to handle state for edit/delete, pass callbacks to `ResourceNavigation`, and handle the modal/dialog.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/DeleteResourceConfirmationDialog.tsx frontend/src/app/notes/[note_id]/page.tsx frontend/src/components/ResourceNavigationItem.tsx
git commit -m "feat(frontend): implement resource edit and delete flow"
```
