from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from utils.backblaze_b2 import BackblazeB2Helper
from routes.users import router as users_router
from routes.notes import router as notes_router
from routes.resources import router as resources_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(notes_router)
app.include_router(resources_router)

# Initialize helper
try:
    drive_helper = BackblazeB2Helper()
except Exception as e:
    print(f"Error initializing Backblaze B2 Helper: {e}")
    drive_helper = None

@app.get("/presigned-url")
async def get_presigned_url(file_path: str):
    if not drive_helper:
         raise HTTPException(status_code=500, detail="Storage not configured")
    try:
        url = drive_helper.get_presigned_url(file_path)
        return {"url": url}
    except Exception as e:
        print(f"ERROR: Failed to generate presigned URL for {file_path}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(email: str, file: UploadFile = File(...)):
    print(f"DEBUG: Upload request received for email: {email}, filename: {file.filename}, content-type: {file.content_type}")
    if not drive_helper:
         raise HTTPException(status_code=500, detail="Storage not configured")

    try:
        content = await file.read()
        print(f"DEBUG: File content read, size: {len(content)} bytes")

        folder_prefix = drive_helper.get_or_create_user_folder(email)
        print(f"DEBUG: Using folder prefix: {folder_prefix} for user: {email}")

        result = drive_helper.upload_file(
            filename=file.filename,
            content=content,
            mimetype=file.content_type,
            folder_id=folder_prefix
        )
        print(f"DEBUG: Upload successful, result: {result}")
        return {
            "id": result.get("id"),
            "title": file.filename,
            "webViewLink": result.get("webViewLink")
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR: Upload failed for file {file.filename}: {str(e)}")
        print(f"TRACEBACK:\n{error_details}")
        raise HTTPException(status_code=500, detail=str(e))
