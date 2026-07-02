# Frontend Navigation Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor frontend navigation: `/` becomes the authenticated home page (note list), `/notes/[note_id]` replaces `/dashboard` for detailed interactions, and public landing page is removed.

**Architecture:** Next.js application structure update.

**Tech Stack:** React, Next.js, `next-auth`.

---

### Task 1: Update Authentication Middleware
**Files:**
- Modify: `frontend/src/middleware.ts`

- [ ] **Step 1: Update middleware to protect `/`**

Ensure `matcher` includes `/` and `/notes/:path*` and excludes login/public paths.

```typescript
// frontend/src/middleware.ts
export const config = {
  matcher: ['/', '/notes/:path*', '/api/:path*'],
};
```
*(Verify existing logic handles the redirect for unauthenticated users correctly).*

### Task 2: Create `/notes/[note_id]` Page
**Files:**
- Create: `frontend/src/app/notes/[note_id]/page.tsx`
- Modify: `frontend/src/app/dashboard/page.tsx` (to be removed later)

- [ ] **Step 1: Migrate content**

Copy the logic and components (`ResourceNavigation`, `ResourceContentDisplay`, `ChatQnASection`) from `dashboard/page.tsx` into `notes/[note_id]/page.tsx`. Ensure it consumes `note_id` from the route params to fetch/filter dummy data.

### Task 3: Create Authenticated Home Page (`/`)
**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Implement Note List View**

Replace marketing content with:
- A `Protected` wrapper or rely on middleware.
- A list of cards (using dummy data for now).
- A "Create New Note" button linking to a creation flow (or just a placeholder action).

```tsx
// frontend/src/app/page.tsx
export default function Home() {
  // Fetch dummy notes
  // Display cards: { title, summary, id }
  // Link cards to `/notes/{id}`
  // Add "Create New Note" button
}
```

### Task 4: Cleanup Dashboard
**Files:**
- Remove: `frontend/src/app/dashboard/`

- [ ] **Step 1: Delete old dashboard**

Remove the `dashboard` directory and update any remaining references.

---
