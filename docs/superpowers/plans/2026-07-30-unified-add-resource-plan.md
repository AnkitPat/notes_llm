# Unified "Add Resource" Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the resource creation process into a single drawer UI, integrating document uploads directly.

**Architecture:** 
- The `UpsertResourceDrawer` component is extended to handle 'Document' type via local upload state (`idle`|`uploading`|`success`|`error`).
- `ResourceNavigation` trigger button is renamed and simplified.
- Existing `uploadDocument` API helper is utilized within the drawer.

**Tech Stack:** React, Material UI, TypeScript.

---

### Task 1: Update `ResourceNavigation` UI

**Files:**
- Modify: `frontend/src/components/ResourceNavigation.tsx`

- [ ] **Step 1: Rename button and remove dedicated upload button**
    - Find the "Upload PDF/Doc" button and remove it along with its `input` element and `onUploadDocument` prop usage.
    - Rename "Add Note/Link" button to "Add Resource".
    - Update the `onAddResource` function name or usage if necessary, but keep the core logic to open the `upsertDrawer` in 'create' mode.

- [ ] **Step 2: Commit**
```bash
git add frontend/src/components/ResourceNavigation.tsx
git commit -m "refactor: rename add resource button and remove old upload UI"
```

---

### Task 2: Extend `UpsertResourceDrawer` for Uploads

**Files:**
- Modify: `frontend/src/components/UpsertResourceDrawer.tsx`
- New Test: `frontend/src/__tests__/UpsertResourceDrawer.test.tsx` (if not existing)

- [ ] **Step 1: Add upload state variables**
```typescript
const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
const [uploadedFileLink, setUploadedFileLink] = useState<string | null>(null);
const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
```

- [ ] **Step 2: Implement `handleFileUpload`**
```typescript
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploadStatus('uploading');
  try {
    // Assuming email is available in context or passed as prop. 
    // If not, fetch it from session/auth.
    const result = await uploadDocument(file, userEmail); 
    setUploadedFileLink(result.webViewLink);
    setUploadedFileName(file.name);
    setUploadStatus('success');
  } catch (err) {
    setUploadStatus('error');
  }
};
```

- [ ] **Step 3: Update Drawer UI to show upload controls for 'Document' type**
    - When `type === 'Document'`, render:
        - If `idle` or `error`: File input + Upload button.
        - If `uploading`: `<CircularProgress />`
        - If `success`: `<Typography>Uploaded: {uploadedFileName}</Typography>`

- [ ] **Step 4: Update `handleSubmit` to use `uploadedFileLink` as `content`**
    - If `type === 'Document'`, ensure `content` is set to `uploadedFileLink`.

- [ ] **Step 5: Disable "Create" button until upload success for Document**
```typescript
<Button 
  variant="contained" 
  fullWidth 
  onClick={handleSubmit}
  disabled={type === 'Document' && uploadStatus !== 'success'}
>
  Create
</Button>
```

- [ ] **Step 6: Reset states in `handleClose`**

- [ ] **Step 7: Commit**
```bash
git add frontend/src/components/UpsertResourceDrawer.tsx
git commit -m "feat: integrate document upload into UpsertResourceDrawer"
```
