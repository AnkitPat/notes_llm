# Design: Note Update and Delete Endpoints

## Architecture
- **Update (`PUT /notes/{noteId}`):** Replace the entire note object (or just relevant fields like `name` and `resourceIds`). Given the `US9` requirement "edit... note title", I will update the `name`.
- **Delete (`DELETE /notes/{noteId}`):** Remove the note from MongoDB.

## Data Flow
1. **Update:** 
   - Receive `PUT /notes/{noteId}`.
   - Validate payload (e.g., `name` is string).
   - Perform `db.notes.update_one({"_id": ObjectId(noteId)}, {"$set": {"name": note_data.name}})`
   - Return 200 OK.
2. **Delete:**
   - Receive `DELETE /notes/{noteId}`.
   - Perform `db.notes.delete_one({"_id": ObjectId(noteId)})`
   - Return 204 No Content.

## Testing
- `PUT`: Test updating a note name, verify it's updated in the database.
- `DELETE`: Test deleting a note, verify it's removed from the database.
