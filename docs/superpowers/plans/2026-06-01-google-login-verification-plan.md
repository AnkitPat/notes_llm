# US3: Google Login & Owner Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Google OAuth login with NextAuth.js and an automated verification email notification to the site owner.

**Architecture:**
- **Frontend:** Integrate NextAuth.js with Google provider.
- **Backend:** Create a FastAPI service to handle verification links and store user status.
- **Notification:** Use Resend API to notify the owner.

**Tech Stack:** Next.js, NextAuth.js, Resend, FastAPI, Python.

---

### Task 1: Initialize FastAPI Backend & Setup Project Structure

**Files:**
- Create: `backend/main.py`
- Create: `backend/requirements.txt`
- Create: `backend/data/verified_users.json`

- [ ] **Step 1: Create requirements.txt**

```text
fastapi
uvicorn
resend
```

- [ ] **Step 2: Create main.py (initial setup)**

```python
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
```

- [ ] **Step 3: Initialize data file**

Run: `mkdir -p backend/data && echo '{"verified_users": []}' > backend/data/verified_users.json`

- [ ] **Step 4: Commit backend init**

```bash
git add backend/
git commit -m "feat: initialize fastapi backend"
```

---

### Task 2: Configure NextAuth.js on Frontend

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Install NextAuth**

Run: `cd frontend && npm install next-auth`

- [ ] **Step 2: Setup route handler**

```ts
// frontend/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
        // Trigger email notification here or via events
        return true;
    }
  }
});

export { handler as GET, handler as POST };
```

- [ ] **Step 3: Commit NextAuth setup**

```bash
git add frontend/package.json frontend/src/app/api/auth/[...nextauth]/route.ts
git commit -m "feat: configure nextauth with google provider"
```

---

### Task 3: Implement Verification Email (Resend)

**Files:**
- Modify: `frontend/src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Install Resend**

Run: `cd frontend && npm install resend`

- [ ] **Step 2: Update route handler to send email**

```ts
import { Resend } from 'resend';
// ... other imports

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = NextAuth({
  // ... providers
  events: {
    async signIn({ user }) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'siddeshgandhe@gmail.com',
        subject: 'New User Login',
        text: `User ${user.email} has logged in. Verify them here: http://localhost:8000/verify?email=${user.email}`
      });
    }
  }
});
```

- [ ] **Step 3: Commit email notification**

```bash
git add frontend/src/app/api/auth/[...nextauth]/route.ts
git commit -m "feat: add resend email notification on signin"
```

---

### Task 4: Implement Verification Logic in Backend

**Files:**
- Modify: `backend/main.py`

- [ ] **Step 1: Add verification endpoint**

```python
@app.get("/verify")
async def verify_user(email: str):
    if not os.path.exists(DATA_FILE):
        data = {"verified_users": []}
    else:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
    
    if email not in data["verified_users"]:
        data["verified_users"].append(email)
        with open(DATA_FILE, "w") as f:
            json.dump(data, f)
    return {"message": "User verified successfully"}
```

- [ ] **Step 2: Commit backend verification**

```bash
git add backend/main.py
git commit -m "feat: add verification endpoint to backend"
```
