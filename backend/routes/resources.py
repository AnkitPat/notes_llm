from fastapi import APIRouter
from utils.db import db
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ResourceCreate(BaseModel):
    noteId: str
    type: str
    name: str
    link: Optional[str] = None
    content: Optional[str] = None

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    link: Optional[str] = None
    embedded: Optional[bool] = None

@router.get("/notes/{note_id}/resources")
async def get_resources(note_id: str):
    cursor = db.resources.find({"noteId": ObjectId(note_id)})
    resources = await cursor.to_list(length=100)
    for r in resources: 
        r["_id"] = str(r["_id"])
        r["noteId"] = str(r["noteId"])
    return resources

@router.post("/resources")
async def create_resource(res: ResourceCreate):
    new_res = {
        "noteId": ObjectId(res.noteId),
        "type": res.type,
        "name": res.name,
        "link": res.link,
        "content": res.content,
        "embedded": False
    }
    result = await db.resources.insert_one(new_res)
    return {"id": str(result.inserted_id)}

@router.patch("/resources/{resource_id}")
async def update_resource(resource_id: str, res: ResourceUpdate):
    update_data = {k: v for k, v in res.dict().items() if v is not None}
    await db.resources.update_one(
        {"_id": ObjectId(resource_id)},
        {"$set": update_data}
    )
    return {"message": "Resource updated"}
