# PDF Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement secure PDF viewing within the dashboard by proxying Backblaze B2 requests through the FastAPI backend and rendering with `react-pdf`.

**Architecture:** Frontend requests a signed URL from the backend; backend validates and returns a short-lived URL via `BackblazeB2Helper`; frontend uses `react-pdf` to render the PDF.

**Tech Stack:** FastAPI (backend), Next.js (frontend), `react-pdf` (frontend library).

---

## File Structure

- **Backend:** `backend/routes/resources.py` (add endpoint), `backend/utils/backblaze_b2.py` (ensure utility is ready).
- **Frontend:** `frontend/src/components/ResourceContentDisplay.tsx` (add viewer logic).

---

### Task 1: Backend API - Get Signed URL

**Files:**
- Modify: `backend/routes/resources.py`
- Test: `backend/tests/test_mongodb_routes.py` (or create new)

- [ ] **Step 1: Write failing test**
Create `backend/tests/test_pdf_signed_url.py`:
```python
import pytest
from fastapi.testclient import TestClient
from main import app # Assuming main.py exposes 'app'

client = TestClient(app)

def test_get_signed_url_resource_not_found():
    response = client.get("/resources/non-existent-id/signed-url")
    assert response.status_code == 404

# Assuming you have a way to mock or have a test resource
def test_get_signed_url_success():
    # Setup: insert a test resource
    # Action: call /resources/<id>/signed-url
    # Assert: response 200 and return a URL
    pass 
```

- [ ] **Step 2: Run test to verify it fails**
Run: `pytest backend/tests/test_pdf_signed_url.py`
Expected: FAIL (404 for route not found)

- [ ] **Step 3: Implement route**
In `backend/routes/resources.py`:
```python
from utils.backblaze_b2 import BackblazeB2Helper

b2_helper = BackblazeB2Helper()

@router.get("/resources/{resource_id}/signed-url")
async def get_resource_signed_url(resource_id: str):
    # 1. Lookup resource
    resource = await db.resources.find_one({"_id": ObjectId(resource_id)})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # 2. Assume 'content' stores the filename/path in B2 for PDF type resources
    file_path = resource.get('content')
    
    # 3. Get signed URL
    signed_url = b2_helper.get_presigned_url(file_path)
    return {"url": signed_url}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `pytest backend/tests/test_pdf_signed_url.py`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add backend/routes/resources.py backend/tests/test_pdf_signed_url.py
git commit -m "feat: add endpoint to get signed PDF URL"
```

### Task 2: Frontend Dependency - React-PDF

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install dependency**
Run: `npm install react-pdf` in the `frontend/` directory.

- [ ] **Step 2: Commit**
```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore: add react-pdf dependency"
```

### Task 3: Frontend Component - PDF Viewer

**Files:**
- Modify: `frontend/src/components/ResourceContentDisplay.tsx`
- Test: `frontend/src/__tests__/ResourceContentDisplay.test.tsx`

- [ ] **Step 1: Implement PDF rendering**
Modify `ResourceContentDisplay.tsx`:
```tsx
import { Document, Page, pdfjs } from 'react-pdf';
// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Inside renderContent():
case 'PDF':
    return (
        <Document file={signedUrl}>
            <Page pageNumber={1} />
        </Document>
    );
```

- [ ] **Step 2: Add signed URL fetching**
In `ResourceContentDisplay.tsx`:
```tsx
useEffect(() => {
    if (selectedResource?.type === 'PDF') {
        fetch(`/api/resources/${selectedResource._id}/signed-url`)
            .then(res => res.json())
            .then(data => setSignedUrl(data.url));
    }
}, [selectedResource]);
```

- [ ] **Step 3: Test integration**
Run existing tests for `ResourceContentDisplay` and ensure they pass.

- [ ] **Step 4: Commit**
```bash
git add frontend/src/components/ResourceContentDisplay.tsx
git commit -m "feat: implement PDF viewer"
```
