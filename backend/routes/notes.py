from fastapi import APIRouter
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

@router.patch("/notes/{note_id}")
async def update_note(note_id: str, note_update: NoteUpdate):
    result = await db.notes.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"resourceIds": [ObjectId(rid) for rid in note_update.resourceIds]}}
    )
    return {"message": "Note updated"}
