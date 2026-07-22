# PDF Viewer Implementation Design

## Overview
We will implement secure PDF viewing within the `ResourceContentDisplay` component using `react-pdf` (powered by Mozilla's `pdf.js`). To ensure security, the frontend will never directly access Backblaze B2. Instead, it will request a time-limited, signed URL from our FastAPI backend.

## Proposed Architecture

### 1. Backend: Signed URL Endpoint
We will add a new endpoint to `backend/routes/resources.py`:

`GET /resources/{resource_id}/signed-url`

- **Role:** Authenticate request, lookup resource in MongoDB to get its path, call `BackblazeB2Helper.get_presigned_url(file_path)`, and return the signed URL.

### 2. Frontend: PDF Viewer Integration

We will modify `frontend/src/components/ResourceContentDisplay.tsx`:

- **New State:** Added state for `signedUrl` and loading/error status.
- **Data Flow:**
    1. When a PDF resource is selected, `ResourceContentDisplay` calls the new backend endpoint.
    2. Upon receiving the signed URL, it passes it to the `react-pdf` `Document` component.
- **Component:** Use `react-pdf` to render the PDF document with basic controls (page navigation, zoom).

## Technical Requirements
- **Dependency:** Add `react-pdf` to `frontend/package.json`.
- **Backend:** Update `backend/routes/resources.py` to handle the new route.
- **Security:** Ensure the signed URL duration is short (e.g., 5-15 minutes) to mitigate risks if a URL is intercepted.

---

Does this design look right? If approved, I will proceed to create the implementation plan.
