from fastapi import APIRouter, HTTPException
from utils.db import db
from pydantic import BaseModel

router = APIRouter()

class UserVerify(BaseModel):
    email: str

@router.get("/check-status/{email}")
async def check_status(email: str):
    user = await db.users.find_one({"email": email})
    if not user:
        return {"verified": False}
    return {"verified": user.get("isVerified", False)}

@router.post("/admin/verify-user")
async def verify_user(user: UserVerify):
    result = await db.users.update_one(
        {"email": user.email},
        {"$set": {"isVerified": True}},
        upsert=True
    )
    return {"message": "User verified"}
