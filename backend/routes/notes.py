from fastapi import APIRouter, Response, HTTPException, status
from utils.db import db
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

def validate_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

class NoteCreate(BaseModel):
    email: str
    name: str

class NoteUpdate(BaseModel):
    resourceIds: List[str]

class NoteUpdateName(BaseModel):
    name: str

@router.get("/notes/{note_id}")
async def get_note(note_id: str):
    obj_id = validate_object_id(note_id)
    note = await db.notes.find_one({"_id": obj_id})
    if note:
        note["_id"] = str(note["_id"])
        return note
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

@router.get("/notes")
async def get_notes(email: str):
    cursor = db.notes.find({"userId": email})
    notes = await cursor.to_list(length=100)
    for n in notes: n["_id"] = str(n["_id"])
    return notes

@router.post("/notes")
async def create_note(note: NoteCreate):
    new_note = {"userId": note.email, "name": note.name, "resourceIds": []}
    result = await db.notes.insert_one(new_note)
    return {"id": str(result.inserted_id)}

@router.put("/notes/{note_id}")
async def update_note_name(note_id: str, note_update: NoteUpdateName):
    obj_id = validate_object_id(note_id)
    result = await db.notes.update_one(
        {"_id": obj_id},
        {"$set": {"name": note_update.name}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found or no change")
    return {"message": "Note updated"}

@router.patch("/notes/{note_id}")
async def update_note(note_id: str, note_update: NoteUpdate):
    obj_id = validate_object_id(note_id)
    resource_ids = [validate_object_id(rid) for rid in note_update.resourceIds]
    result = await db.notes.update_one(
        {"_id": obj_id},
        {"$set": {"resourceIds": resource_ids}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return {"message": "Note updated"}

@router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    obj_id = validate_object_id(note_id)
    result = await db.notes.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
