# Signed URL Endpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `GET /resources/{resource_id}/signed-url`.

**Architecture:** FastAPI route calling DB and B2Helper.

**Tech Stack:** FastAPI, Python, MongoDB, B2 SDK.

---

### Task 1: Create failing test
**Files:**
- Create: `backend/tests/test_pdf_signed_url.py`

- [ ] **Step 1: Write the failing test**

```python
import pytest
from httpx import AsyncClient
from backend.main import app
from bson import ObjectId

@pytest.mark.asyncio
async def test_get_signed_url_not_found():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"/resources/{str(ObjectId())}/signed-url")
    assert response.status_code == 404
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_pdf_signed_url.py -v`
Expected: FAIL (probably 404 because route not implemented, or 405)

### Task 2: Implement route
**Files:**
- Modify: `backend/routes/resources.py`

- [ ] **Step 1: Implement GET endpoint**

```python
@router.get("/resources/{resource_id}/signed-url")
async def get_signed_url(resource_id: str):
    try:
        oid = ObjectId(resource_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid resource ID format")
    
    resource = await db.resources.find_one({"_id": oid})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    from utils.backblaze_b2 import BackblazeB2Helper
    helper = BackblazeB2Helper()
    url = helper.get_presigned_url(file_path=resource['content'])
    
    return {"url": url}
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pytest backend/tests/test_pdf_signed_url.py -v`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add backend/tests/test_pdf_signed_url.py backend/routes/resources.py
git commit -m "feat: implement GET /resources/{resource_id}/signed-url"
```
