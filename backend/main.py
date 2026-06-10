from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from utils.google_drive import GoogleDriveHelper

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data/verified_users.json"

# Initialize helper
try:
    drive_helper = GoogleDriveHelper()
except Exception as e:
    print(f"Error initializing Google Drive Helper: {e}")
    drive_helper = None

@app.get("/check-status/{email}")
async def check_status(email: str):
    if not os.path.exists(DATA_FILE):
        return {"verified": False}
    with open(DATA_FILE, "r") as f:
        data = json.load(f)
    return {"verified": email in data.get("verified_users", [])}

@app.get("/verify")
async def verify_user(email: str):
    if not os.path.exists(DATA_FILE):
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        users = []
    else:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
        users = data.get("verified_users", [])
    
    if email not in users:
        users.append(email)
        with open(DATA_FILE, "w") as f:
            json.dump({"verified_users": users}, f)
    
    return {"message": "User verified successfully"}

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
