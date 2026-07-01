# Design Spec: MongoDB Backend Architecture

## Status
Proposed (Awaiting User Review)

## Context & Purpose
Notes LLM is transitioning its local JSON data persistence (e.g., `verified_users.json`) to a scalable MongoDB database. The goal is to design a clean, relational-but-document-oriented architecture supporting Users, Notes, and Resources (Documents, Links, Texts) to power the backend API and RAG pipeline.

This specification covers only the backend database schema, drivers, and API endpoint designs. It excludes frontend/UI modifications.

---

## 1. Database Schema Design (MongoDB)

### 1.1 `users` Collection
Tracks verified users to allow dashboard access. Replaces `verified_users.json`.
```json
{
  "_id": "ObjectId",
  "email": "string",       // Unique index
  "isVerified": "boolean", // True if allowed to access notes
  "createdAt": "Date"
}
```

### 1.2 `notes` Collection
Represents top-level notebook entities owned by a user.
```json
{
  "_id": "ObjectId",
  "userId": "string",      // References users.email (foreign key mapping)
  "name": "string",        // e.g., "Maths Notes", "Physics"
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 1.3 `resources` Collection
Every individual upload, pasted link, or manual text block is stored as a distinct document. This ensures MongoDB document size limits are never breached and allows atomic CRUD operations on individual files/links.
```json
{
  "_id": "ObjectId",
  "noteId": "ObjectId",    // References notes._id (foreign key mapping)
  "type": "string",        // Enum: "document" | "text" | "link"
  "name": "string",        // e.g., "calculus_syllabus.pdf" or link title
  "content": "string",     // Raw content (only populated if type == "text")
  "link": "string",        // URL if type == "link", or Backblaze B2 path if type == "document"
  "embedded": "boolean",   // True if successfully processed & indexed in ChromaDB
  "createdAt": "Date"
}
```

*Note: Chat History is intentionally kept in-memory (session-based) and is not persisted in MongoDB.*

---

## 2. Backend Technology Stack & Drivers

*   **Database Client**: `motor` (the official asynchronous Python driver for MongoDB) to fit cleanly with FastAPI's async endpoints.
*   **Object Modeling / Validation**: `pydantic` (already in FastAPI) to enforce schema compliance.
*   **Database Connection**: Configured via `MONGODB_URI` environment variable inside `backend/.env`.

---

## 3. API Endpoints Design (FastAPI)

### 3.1 User Management
*   `GET /check-status/{email}`:
    *   Queries `users` collection by email. Returns `{"verified": boolean}`.
*   `POST /admin/verify-user`:
    *   Inserts or updates a user document setting `isVerified: true`.

### 3.2 Notes Management
*   `GET /notes?email={email}`:
    *   Returns list of notes owned by the user.
*   `POST /notes`:
    *   Request body: `{"email": "...", "name": "..."}`.
    *   Creates a new note document.
*   `PATCH /notes/{note_id}`:
    *   Request body: `{"resourceIds": [ObjectId]}`.
    *   Updates the `resourceIds` array for the specified note.
*   `DELETE /notes/{note_id}`:
    *   Deletes a note and cascadingly deletes all associated `resources` referencing its `noteId`.

### 3.3 Resource Management
*   `GET /notes/{note_id}/resources`:
    *   Returns a flat list of all resources matching the given `noteId`.
*   `POST /resources`:
    *   Request body: `{"noteId": ObjectId, "type": "...", "name": "...", "link": "..."}`.
    *   Creates a new resource document.
*   `PATCH /resources/{resource_id}`:
    *   Request body: `{"name": "...", "content": "...", "link": "...", "embedded": boolean}`.
    *   Updates an existing resource document.
*   `DELETE /resources/{resource_id}`:
    *   Deletes the resource from MongoDB (and triggers ChromaDB cleanup for vector entries).

---

## 4. Testing Strategy
*   Use `pytest` with a mock or separate test database instance (e.g., standard MongoDB test client / Motor mock) to ensure database mutations work as expected and clean up after run.
