# Material UI Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Next.js frontend from Tailwind CSS to Material UI (MUI) while maintaining the existing UI structure and design patterns.

**Architecture:** A centralized MUI theme will be provided at the root level, and Tailwind classes will be incrementally replaced by MUI components in individual components.

**Tech Stack:** Next.js, Material UI (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material).

---

### Task 1: Install Dependencies
- **Files:** Modify: `frontend/package.json`

- [ ] **Step 1: Add dependencies**
Run: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`

- [ ] **Step 2: Commit**
`git add frontend/package.json`
`git commit -m "feat: install mui dependencies"`

### Task 2: Configure MUI Theme
- **Files:** Create: `frontend/src/theme/theme.ts`

- [ ] **Step 1: Create theme.ts**
```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Matches blue-600
    },
  },
});

export default theme;
```

- [ ] **Step 2: Commit**
`git add frontend/src/theme/theme.ts`
`git commit -m "feat: setup mui theme"`

### Task 3: Setup Theme Provider
- **Files:** Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**
Wrap the children with `ThemeProvider` and add `CssBaseline`. Note: You will need to create a client component wrapper for the ThemeProvider because it's a context provider.

- [ ] **Step 2: Commit**
`git add frontend/src/app/layout.tsx`
`git commit -m "feat: integrate mui provider"`

### Task 4: Refactor Navbar Component
- **Files:** Modify: `frontend/src/components/Navbar.tsx`

- [ ] **Step 1: Replace Tailwind classes with MUI components**
Convert `nav`, `div`, and `Link` to `AppBar`, `Toolbar`, `Typography`, `Box`, `Link`.

- [ ] **Step 2: Run tests**
`npm run test frontend/src/__tests__/Navbar.test.tsx` (if it exists or similar)

- [ ] **Step 3: Commit**
`git add frontend/src/components/Navbar.tsx`
`git commit -m "refactor: navbar to mui"`

---
