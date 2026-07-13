# ResourceContentDisplay iframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify `ResourceContentDisplay` to render an `iframe` for 'Link' type resource previews instead of just a clickable link.

**Architecture:**
- Replace `Link` component in `ResourceContentDisplay.tsx` with an `iframe` for resources of type `Link`.
- Set appropriate security `sandbox` attributes on the `iframe`.

**Tech Stack:**
- React, Material UI, TypeScript.

---

### Task 1: Update ResourceContentDisplay.tsx

**Files:**
- Modify: `frontend/src/components/ResourceContentDisplay.tsx`

- [ ] **Step 1: Replace Link with iframe**

```tsx
// Inside ResourceContentDisplay.tsx's renderContent function
case 'Link':
  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {selectedResource.title}
      </Typography>
      <iframe
        src={selectedResource.content}
        title={selectedResource.title}
        width="100%"
        height="100%"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{ border: 'none' }}
      />
    </Box>
  );
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ResourceContentDisplay.tsx
git commit -m "feat: render iframe preview in ResourceContentDisplay"
```

### Task 2: Verify Change

**Files:**
- Test: `frontend/src/__tests__/ResourceContentDisplay.test.tsx`

- [ ] **Step 1: Create/Update test to verify iframe rendering**

```tsx
// Example test addition
import { render, screen } from '@testing-library/react';
import ResourceContentDisplay from '../components/ResourceContentDisplay';
import { Resource } from '../types/dashboard';

test('renders iframe for Link type resource', () => {
  const mockResource: Resource = {
    id: '1',
    title: 'Test Link',
    type: 'Link',
    content: 'https://example.com',
  };
  render(<ResourceContentDisplay selectedResource={mockResource} onRemoveResource={() => {}} />);
  
  const iframe = screen.getByTitle('Test Link');
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', 'https://example.com');
});
```

- [ ] **Step 2: Run tests**

Run: `npm run test`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/__tests__/ResourceContentDisplay.test.tsx
git commit -m "test: verify iframe rendering in ResourceContentDisplay"
```
