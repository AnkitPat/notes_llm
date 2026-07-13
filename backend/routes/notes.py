from fastapi import APIRouter, Response
from utils.db import db
from bson import ObjectId
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class NoteCreate(BaseModel):
    email: str
    name: str

class NoteUpdate(BaseModel):
    resourceIds: List[str]

class NoteUpdateName(BaseModel):
    name: str

@router.get("/notes/{note_id}")
async def get_note(note_id: str):
    note = await db.notes.find_one({"_id": ObjectId(note_id)})
    if note:
        note["_id"] = str(note["_id"])
        return note
    return {"error": "Note not found"}, 404

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
    result = await db.notes.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"name": note_update.name}}
    )
    if result.modified_count == 0:
        return {"error": "Note not found or no change"}, 404
    return {"message": "Note updated"}

@router.patch("/notes/{note_id}")
async def update_note(note_id: str, note_update: NoteUpdate):
    result = await db.notes.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"resourceIds": [ObjectId(rid) for rid in note_update.resourceIds]}}
    )
    return {"message": "Note updated"}

@router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    result = await db.notes.delete_one({"_id": ObjectId(note_id)})
    if result.deleted_count == 0:
        return {"error": "Note not found"}, 404
    return Response(status_code=204)
