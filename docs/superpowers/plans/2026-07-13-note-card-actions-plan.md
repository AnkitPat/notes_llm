# Note Card Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Edit (title update) and Delete functionality for note cards in the dashboard.

**Architecture:**
- Backend: FastAPI route handlers for `PUT /notes/{id}` and `DELETE /notes/{id}`.
- Frontend: `ResourceNavigationItem` integration with MUI `Menu` for options. `EditNoteModal` and `DeleteNoteConfirmationDialog` components.

**Tech Stack:**
- Backend: FastAPI
- Frontend: Next.js, Material UI

---

### Task 1: Backend API for Note Update/Delete

**Files:**
- Modify: `backend/routes/notes.py`
- Modify: `backend/tests/test_mongodb_routes.py` (or create `backend/tests/test_notes.py`)

- [ ] **Step 1: Write test for updating note**
- [ ] **Step 2: Implement `PUT /notes/{noteId}`**
- [ ] **Step 3: Write test for deleting note**
- [ ] **Step 4: Implement `DELETE /notes/{noteId}`**
- [ ] **Step 5: Run tests and verify they pass**
- [ ] **Step 6: Commit**

### Task 2: Frontend EditNoteModal Component

**Files:**
- Create: `frontend/src/components/EditNoteModal.tsx`

- [ ] **Step 1: Create `EditNoteModal` boilerplate**
- [ ] **Step 2: Implement modal UI (title input, Cancel/Save buttons)**
- [ ] **Step 3: Add logic to call API**
- [ ] **Step 4: Commit**

### Task 3: Frontend DeleteNoteConfirmationDialog Component

**Files:**
- Create: `frontend/src/components/DeleteNoteConfirmationDialog.tsx`

- [ ] **Step 1: Create `DeleteNoteConfirmationDialog` boilerplate**
- [ ] **Step 2: Implement confirmation UI**
- [ ] **Step 3: Add logic to call API**
- [ ] **Step 4: Commit**

### Task 4: Frontend ResourceNavigationItem Integration

**Files:**
- Modify: `frontend/src/components/ResourceNavigationItem.tsx`

- [ ] **Step 1: Add `MoreVertIcon` and `Menu` to `ResourceNavigationItem`**
- [ ] **Step 2: Implement "Edit" and "Delete" menu item handlers**
- [ ] **Step 3: Integrate `EditNoteModal` and `DeleteNoteConfirmationDialog`**
- [ ] **Step 4: Add tests in `frontend/src/__tests__/ResourceNavigationItem.test.tsx`**
- [ ] **Step 5: Verify integration and Commit**
