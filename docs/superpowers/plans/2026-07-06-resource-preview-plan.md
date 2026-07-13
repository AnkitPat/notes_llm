# ResourcePreview iframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify `ResourcePreview` to render an `iframe` for webpage previews instead of just a link button.

**Architecture:**
- Replace `Button` component in `ResourcePreview.tsx` with an `iframe` for non-Note resource types.
- Set appropriate security `sandbox` attributes on the `iframe`.

**Tech Stack:**
- React, Material UI, TypeScript.

---

### Task 1: Update ResourcePreview.tsx

**Files:**
- Modify: `frontend/src/components/ResourcePreview.tsx`

- [ ] **Step 1: Replace Button with iframe**

```tsx
// Inside ResourcePreview.tsx
) : (
  <Box sx={{ p: 1.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
    <iframe
      src={link || '#'}
      title={title || 'Resource Preview'}
      width="100%"
      height="400px"
      sandbox="allow-scripts allow-same-origin allow-forms"
      style={{ border: 'none' }}
    />
  </Box>
)}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ResourcePreview.tsx
git commit -m "feat: render iframe preview in ResourcePreview"
```

### Task 2: Verify Change

**Files:**
- Test: `frontend/src/__tests__/ResourcePreview.test.tsx` (or similar)

- [ ] **Step 1: Create/Update test to verify iframe rendering**

(Assuming a test file exists; if not, create one based on similar tests in `frontend/src/__tests__/`)

```tsx
// Example test addition
import { render, screen } from '@testing-library/react';
import { ResourcePreview } from '../components/ResourcePreview';

test('renders iframe for non-Note types', () => {
  render(
    <ResourcePreview
      title="Test Site"
      type="URL" // or appropriate non-Note type
      content=""
      link="https://example.com"
    />
  );
  const iframe = screen.getByTitle('Test Site');
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', 'https://example.com');
});
```

- [ ] **Step 2: Run tests**

Run: `npm run test` (or `vitest run`)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/__tests__/ResourcePreview.test.tsx
git commit -m "test: verify iframe rendering in ResourcePreview"
```
