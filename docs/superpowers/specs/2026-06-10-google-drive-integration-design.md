# Design Spec: Google Drive Document Storage

## 1. Overview
The goal is to enable users to upload documents to a central Google Drive repository managed by a shared Service Account. The documents will be stored in user-specific folders to ensure logical isolation, although users will only interact with these files through the application UI.

## 2. Architecture (Approach 1: Backend Proxy)
The application will use the FastAPI backend as a proxy for all Google Drive interactions. This keeps sensitive Service Account credentials secure on the server.

### 2.1. Components
- **Frontend (Next.js):** Provides a file upload interface in the Dashboard.
- **Backend (FastAPI):** Receives the file, authenticates the request, and handles the Google Drive API communication.
- **Google Drive API:** The storage layer managed by a Service Account.

## 3. Backend Design

### 3.1. Authentication & Configuration
- **Credentials:** A `service-account.json` file will be stored in the backend (excluded from git via `.gitignore`) or provided via an environment variable `GOOGLE_APPLICATION_CREDENTIALS`.
- **API Scopes:** `https://www.googleapis.com/auth/drive.file` (allows the app to see and manage only the files it has created).

### 3.2. API Endpoints

#### `POST /upload`
- **Request:** `multipart/form-data` containing the `file`.
- **Logic:**
    1. Extract user identity (email) from the session/request.
    2. Initialize Google Drive Service.
    3. Check for an existing folder named after the user's email in a master "Notes LLM" root folder.
    4. If no folder exists, create one.
    5. Upload the file into that user-specific folder.
    6. Set file permissions (if needed, though the Service Account owns it).
- **Response:**
    ```json
    {
      "id": "google-drive-file-id",
      "title": "filename.pdf",
      "webViewLink": "https://drive.google.com/..."
    }
    ```

### 3.3. File Management Logic
- **Root Folder:** A master folder created by the Service Account to house all user data.
- **Folder Mapping:** A simple mapping (or searching the Drive by name) to find the user's sub-folder.

## 4. Frontend Design

### 4.1. Dashboard Integration
- **Upload Trigger:** An "Upload Document" button will be added to the `ResourceNavigation` component or a dedicated modal.
- **Upload State:** The UI will show a progress indicator or loading state while the backend proxies the upload to Google Drive.
- **Link Display:** Once uploaded, the document will appear in the "Documents" list. Clicking it will open the `webViewLink` in a new tab or display it in the `ResourceContentDisplay`.

## 5. Security & Privacy
- **Credential Safety:** The `service-account.json` MUST NOT be committed to the repository.
- **Access Control:** The backend only returns file links for the authenticated user's specific folder.
- **No Direct Browse:** Users cannot browse the Google Drive directly; the app provides the only view of the files.

## 6. Success Criteria
- User can select a local file and upload it.
- File appears in the backend's managed Google Drive under a user-specific folder.
- Backend returns a valid Google Drive link.
- Frontend displays the new document in the list with its link.
