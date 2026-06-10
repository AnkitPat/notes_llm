# Google Drive Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable users to upload documents to a shared Google Drive via a FastAPI backend proxy and retrieve the file link.

**Architecture:** The frontend (Next.js) will send files to the backend (FastAPI), which will use a Service Account to upload them into user-specific folders on Google Drive.

**Tech Stack:** FastAPI, Google API Python Client, Next.js, NextAuth.

---

### Task 1: Backend Dependencies & Environment Setup

**Files:**
- Modify: `backend/requirements.txt`

- [ ] **Step 1: Add Google Drive API dependencies to requirements.txt**

Add the following lines to `backend/requirements.txt`:
```text
google-api-python-client
google-auth-httplib2
google-auth-oauthlib
python-multipart
```

- [ ] **Step 2: Install dependencies**

Run: `pip install -r backend/requirements.txt`

- [ ] **Step 3: Commit**

```bash
git add backend/requirements.txt
git commit -m "chore: add google drive api and multipart dependencies"
```

---

### Task 2: Google Drive Service Helper

**Files:**
- Create: `backend/utils/google_drive.py`
- Test: `backend/test_google_drive.py`

- [ ] **Step 1: Write a test for the Google Drive helper (Mocked)**

Create `backend/test_google_drive.py`:
```python
import pytest
from unittest.mock import MagicMock, patch
from utils.google_drive import GoogleDriveHelper

@patch("utils.google_drive.build")
def test_get_or_create_user_folder(mock_build):
    mock_drive = MagicMock()
    mock_build.return_value = mock_drive
    
    # Mock search for folder
    mock_drive.files().list().execute.return_value = {"files": [{"id": "folder-123"}]}
    
    helper = GoogleDriveHelper(service_account_info={})
    folder_id = helper.get_or_create_user_folder("test@example.com")
    
    assert folder_id == "folder-123"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/test_google_drive.py`
Expected: FAIL (ImportError: No module named 'utils.google_drive')

- [ ] **Step 3: Implement GoogleDriveHelper**

Create `backend/utils/google_drive.py`:
```python
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

SCOPES = ['https://www.googleapis.com/auth/drive.file']

class GoogleDriveHelper:
    def __init__(self, service_account_info=None):
        if service_account_info:
            self.creds = service_account.Credentials.from_service_account_info(
                service_account_info, scopes=SCOPES)
        else:
            # Fallback to env var or local file for development
            self.creds = service_account.Credentials.from_service_account_file(
                'service-account.json', scopes=SCOPES)
        self.service = build('drive', 'v3', credentials=self.creds)

    def get_or_create_user_folder(self, email: str) -> str:
        query = f"name = '{email}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        results = self.service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        files = results.get('files', [])

        if files:
            return files[0]['id']

        # Create folder
        file_metadata = {
            'name': email,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        folder = self.service.files().create(body=file_metadata, fields='id').execute()
        return folder.get('id')

    def upload_file(self, filename: str, content: bytes, mimetype: str, folder_id: str):
        file_metadata = {
            'name': filename,
            'parents': [folder_id]
        }
        fh = io.BytesIO(content)
        media = MediaIoBaseUpload(fh, mimetype=mimetype, resumable=True)
        file = self.service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
        return file
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/test_google_drive.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/utils/google_drive.py backend/test_google_drive.py
git commit -m "feat: implement google drive service helper"
```

---

### Task 3: Backend Upload Endpoint

**Files:**
- Modify: `backend/main.py`
- Test: `backend/test_main.py`

- [ ] **Step 1: Write test for /upload endpoint (Mocked)**

Modify `backend/test_main.py`:
```python
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

@patch("main.GoogleDriveHelper")
def test_upload_file(mock_helper_class):
    mock_helper = MagicMock()
    mock_helper_class.return_value = mock_helper
    mock_helper.get_or_create_user_folder.return_value = "folder-123"
    mock_helper.upload_file.return_value = {
        "id": "file-456",
        "webViewLink": "https://drive.google.com/test"
    }

    response = client.post(
        "/upload",
        params={"email": "test@example.com"},
        files={"file": ("test.txt", b"hello world", "text/plain")}
    )
    
    assert response.status_code == 200
    assert response.json()["id"] == "file-456"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/test_main.py`
Expected: FAIL (404 Not Found for /upload)

- [ ] **Step 3: Implement /upload endpoint**

Modify `backend/main.py`:
```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from utils.google_drive import GoogleDriveHelper
# ... (existing imports)

# Initialize helper (assuming credentials in service-account.json for now)
try:
    drive_helper = GoogleDriveHelper()
except Exception:
    drive_helper = None

@app.post("/upload")
async def upload_file(email: str, file: UploadFile = File(...)):
    if not drive_helper:
         raise HTTPException(status_code=500, detail="Google Drive not configured")
    
    try:
        content = await file.read()
        folder_id = drive_helper.get_or_create_user_folder(email)
        result = drive_helper.upload_file(
            filename=file.filename,
            content=content,
            mimetype=file.content_type,
            folder_id=folder_id
        )
        return {
            "id": result.get("id"),
            "title": file.filename,
            "webViewLink": result.get("webViewLink")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest backend/test_main.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/main.py
git commit -m "feat: add /upload endpoint to backend"
```

---

### Task 4: Frontend API Helper

**Files:**
- Create: `frontend/src/lib/api.ts`

- [ ] **Step 1: Implement upload function in frontend/src/lib/api.ts**

Create `frontend/src/lib/api.ts`:
```typescript
export async function uploadDocument(file: File, email: string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`http://localhost:8000/upload?email=${encodeURIComponent(email)}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/lib/api.ts
git commit -m "feat: add frontend api helper for uploads"
```

---

### Task 5: Frontend Dashboard Upload UI

**Files:**
- Modify: `frontend/src/components/ResourceNavigation.tsx`
- Modify: `frontend/src/app/dashboard/page.tsx`

- [ ] **Step 1: Add upload UI to ResourceNavigation.tsx**

Modify `frontend/src/components/ResourceNavigation.tsx` to include a file input and upload button (simplifying for now, just an input that triggers on change).

- [ ] **Step 2: Update Dashboard Page to handle the upload event**

In `frontend/src/app/dashboard/page.tsx`, handle the `uploadDocument` call and update the local state (adding the new document to the list).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ResourceNavigation.tsx frontend/src/app/dashboard/page.tsx
git commit -m "feat: integrate document upload into dashboard ui"
```
