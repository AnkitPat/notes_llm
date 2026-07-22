from fastapi import APIRouter, HTTPException
from utils.db import db
from utils.backblaze_b2 import BackblazeB2Helper
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel
from typing import Optional

router = APIRouter()
b2_helper = BackblazeB2Helper()

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

@router.get("/resources/{resource_id}/signed-url")
async def get_resource_signed_url(resource_id: str):
    try:
        oid = ObjectId(resource_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid resource ID format")
        
    resource = await db.resources.find_one({"_id": oid})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    file_path = resource.get('content')
    if not file_path:
        raise HTTPException(status_code=400, detail="Resource has no content path")
    
    signed_url = b2_helper.get_presigned_url(file_path)
    return {"url": signed_url}

@router.post("/resources")
async def create_resource(res: ResourceCreate):
    content = res.content
    if res.type == 'PDF' and content:
        # If the content is an absolute URL, extract the B2 path.
        # Example: https://f003.backblazeb2.com/file/bucket-name/user@email.com/filename.pdf
        # B2 paths usually look like: user@email.com/filename.pdf
        if content.startswith('http'):
            # Simple extraction: find the last part after the bucket-name in the URL
            # The pattern is usually .../file/<bucket-name>/<file-path>
            parts = content.split('/file/')
            if len(parts) > 1:
                # part[0] is base, part[1] is bucket/path
                bucket_path = parts[1].split('/', 1) # split at first slash after bucket
                if len(bucket_path) > 1:
                    content = bucket_path[1]
    
    new_res = {
        "noteId": ObjectId(res.noteId),
        "type": res.type,
        "name": res.name,
        "link": res.link,
        "content": content,
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

@router.delete("/resources/{resource_id}", status_code=204)
async def delete_resource(resource_id: str):
    try:
        oid = ObjectId(resource_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid resource ID format")
    result = await db.resources.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    return None
