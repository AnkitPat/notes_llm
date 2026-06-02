from fastapi import FastAPI
import json
import os

app = FastAPI()

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
