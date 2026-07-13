# Note Update and Delete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `PUT /notes/{noteId}` to update note title, and `DELETE /notes/{noteId}` to remove notes.

**Architecture:** Add two new endpoints to `backend/routes/notes.py` that use MongoDB `update_one` and `delete_one`. Add corresponding unit tests to `backend/tests/test_mongodb_routes.py`.

**Tech Stack:** FastAPI, MongoDB, PyTest.

---

### Task 1: Write test for updating note

**Files:**
- Modify: `backend/tests/test_mongodb_routes.py`

- [ ] **Step 1: Add update note test**

```python
def test_update_note_name():
    response = client.put(f"/notes/{VALID_ID}", json={"name": "Updated Note Name"})
    assert response.status_code == 200
    assert response.json() == {"message": "Note updated"}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_mongodb_routes.py::test_update_note_name -v`
Expected: FAIL (404 Not Found, as endpoint does not exist)

- [ ] **Step 3: Commit**

```bash
git add backend/tests/test_mongodb_routes.py
git commit -m "test: add update note test"
```

### Task 2: Implement `PUT /notes/{noteId}`

**Files:**
- Modify: `backend/routes/notes.py`

- [ ] **Step 1: Implement `PUT /notes/{noteId}`**

```python
@router.put("/notes/{note_id}")
async def update_note_name(note_id: str, note_update: NoteCreate):
    result = await db.notes.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"name": note_update.name}}
    )
    if result.modified_count == 0:
        return {"error": "Note not found or no change"}, 404
    return {"message": "Note updated"}
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pytest backend/tests/test_mongodb_routes.py::test_update_note_name -v`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add backend/routes/notes.py
git commit -m "feat: implement PUT /notes/{noteId}"
```

### Task 3: Write test for deleting note

**Files:**
- Modify: `backend/tests/test_mongodb_routes.py`

- [ ] **Step 1: Add delete note test**

```python
def test_delete_note():
    response = client.delete(f"/notes/{VALID_ID}")
    assert response.status_code == 204
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_mongodb_routes.py::test_delete_note -v`
Expected: FAIL (404 Not Found)

- [ ] **Step 3: Commit**

```bash
git add backend/tests/test_mongodb_routes.py
git commit -m "test: add delete note test"
```

### Task 4: Implement `DELETE /notes/{noteId}`

**Files:**
- Modify: `backend/routes/notes.py`

- [ ] **Step 1: Implement `DELETE /notes/{noteId}`**

```python
@router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    result = await db.notes.delete_one({"_id": ObjectId(note_id)})
    if result.deleted_count == 0:
        return {"error": "Note not found"}, 404
    return None, 204
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pytest backend/tests/test_mongodb_routes.py::test_delete_note -v`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add backend/routes/notes.py
git commit -m "feat: implement DELETE /notes/{noteId}"
```
