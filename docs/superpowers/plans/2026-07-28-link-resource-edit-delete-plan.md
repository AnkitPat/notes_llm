# Link Resource Edit/Delete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable edit and delete actions for "Link" resources in the resource navigation menu, matching the existing functionality for "Note" resources.

**Architecture:** Update the frontend UI component `ResourceNavigationItem` to enable the existing action menu for link types.

**Tech Stack:** Next.js, React, Material UI.

---

### Task 1: Update UI to enable action menu for Link resources

**Files:**
- Modify: `frontend/src/components/ResourceNavigationItem.tsx`

- [ ] **Step 1: Modify `ResourceNavigationItem` to include Link type in action menu condition**

Change the condition for showing the action menu:

```tsx
// frontend/src/components/ResourceNavigationItem.tsx

// Current:
{resource.type === 'Note' && (
  <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'white' }}>
    <MoreVertIcon />
  </IconButton>
)}

// New:
{(resource.type === 'Note' || resource.type === 'Link') && (
  <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'white' }}>
    <MoreVertIcon />
  </IconButton>
)}
```

- [ ] **Step 2: Commit the change**

```bash
git add frontend/src/components/ResourceNavigationItem.tsx
git commit -m "feat(frontend): enable edit/delete menu for Link resources"
```

---

### Task 2: Verify Implementation

- [ ] **Step 1: Run Frontend Tests**

Run: `npm run test` in `frontend` directory.
Expected: PASS (Existing tests should pass as this is a UI-only update for Link resources, assuming they were not explicitly testing the *exclusion* of this menu).

- [ ] **Step 2: Verify manually (if applicable/requested)**

The UI should now show the "MoreVertIcon" (three dots) for resources of type "Link", enabling the "Edit" and "Delete" menu items.
