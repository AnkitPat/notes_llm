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
