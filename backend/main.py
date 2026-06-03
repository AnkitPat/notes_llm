from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data/verified_users.json"

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
