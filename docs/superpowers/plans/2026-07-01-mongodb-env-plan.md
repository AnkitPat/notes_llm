# MongoDB Credential Security Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove hardcoded MongoDB credentials from `backend/utils/db.py`, force loading from `backend/.env`, and fail if credentials are missing.

**Architecture:** Modify the database initialization utility to use a secure, environment-variable-driven approach.

**Tech Stack:** Python, `python-dotenv`, `motor`, `os`.

---

### Task 1: Update `backend/utils/db.py`

**Files:**
- Modify: `backend/utils/db.py`

- [ ] **Step 1: Read the current file**

Run: `cat backend/utils/db.py`

- [ ] **Step 2: Update `backend/utils/db.py`**

Replace the content of `backend/utils/db.py` with the following:

```python
import motor.motor_asyncio
import os
from dotenv import load_dotenv
import pathlib

# Load .env from backend folder explicitly
env_path = pathlib.Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable not set in backend/.env")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client["notes_llm"]
```

- [ ] **Step 3: Verify the change**

Run: `python3 -c "from backend.utils.db import MONGODB_URI; print('Successfully loaded MONGODB_URI')"`.
Note: This assumes the `.env` exists and has `MONGODB_URI` set. If not, it should raise a `ValueError`.

- [ ] **Step 4: Commit**

```bash
git add backend/utils/db.py
git commit -m "feat: secure mongodb credentials by removing hardcoded fallback"
```
