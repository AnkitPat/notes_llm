# Signed URL Endpoint Design

**Goal:** Implement `GET /resources/{resource_id}/signed-url` to provide secure access to B2 files.

**Architecture:**
1. FastAPI route `GET /resources/{resource_id}/signed-url`.
2. Validate `resource_id` as MongoDB `ObjectId`.
3. Query `db.resources`.
4. Validate existence.
5. Call `BackblazeB2Helper.get_presigned_url(file_path=resource['content'])`.
6. Respond `{"url": signed_url}`.

**Error Handling:**
- `InvalidId`: 400 Bad Request
- Not Found: 404 Not Found
