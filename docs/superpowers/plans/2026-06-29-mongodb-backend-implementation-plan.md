# MongoDB Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate user verification and note/resource management from local JSON files to MongoDB using FastAPI and Motor.

**Architecture:** Use `motor` (async MongoDB driver) integrated into FastAPI. Endpoints will be organized into separate route files under `backend/routes/` for clarity.

**Tech Stack:** FastAPI, Motor, Pydantic, Pytest.

---

### Task 1: Setup Dependencies and Connection

**Files:**
- Modify: `backend/requirements.txt`
- Create: `backend/utils/db.py`
- Modify: `backend/.env` (add placeholder)

- [ ] **Step 1: Install `motor`**

Run: `pip install motor`
(Assumes `.venv` is activated: `source .venv/bin/activate`)
Update: `requirements.txt` to include `motor`

- [ ] **Step 2: Create DB Connection utility**

Create `backend/utils/db.py`:
```python
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.notes_llm
```

- [ ] **Step 3: Update `.env`**

Add: `MONGODB_URI=mongodb://localhost:27017`

---

### Task 2: Users Routes and Verification

**Files:**
- Create: `backend/routes/users.py`
- Modify: `backend/main.py`

- [ ] **Step 1: Implement `users` routes**

Create `backend/routes/users.py`:
```python
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
```

- [ ] **Step 2: Update `main.py` to use routes**

Refactor `main.py` to import `users` router and register it.

---

### Task 3: Notes Management (Updated)

**Files:**
- Create/Modify: `backend/routes/notes.py`

- [ ] **Step 1: Implement/Update `notes` routes**

```python
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
```

---

### Task 4: Resources Management (Updated)

**Files:**
- Create/Modify: `backend/routes/resources.py`

- [ ] **Step 1: Implement/Update `resources` routes**

```python
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
    for r in resources: r["_id"] = str(r["_id"])
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
```

---

### Task 5: Testing

- [ ] **Step 1: Create test file**

Create `backend/tests/test_mongodb_routes.py` and implement tests for users, notes, and resources using a test database (e.g., `db_test = client.notes_llm_test`).

- [ ] **Step 2: Run tests**

Run: `pytest backend/tests/test_mongodb_routes.py`
