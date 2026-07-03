# Modern Resource Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `ResourceNavigation.tsx` to a modern sidebar layout, including icon-based listing, an active-state indicator, and a drawer-based "Add Resource" workflow.

**Architecture:**
1.  Refactor `ResourceNavigation.tsx` styling (Material UI).
2.  Implement `ResourceNavigationItem` component for improved UI/UX.
3.  Implement `AddResourceDrawer` component for the drawer interaction.
4.  Update parent to handle drawer state.

**Tech Stack:** Next.js, React, Material UI (MUI).

---

### Task 1: Create `ResourceNavigationItem` Component

**Files:**
- Create: `frontend/src/components/ResourceNavigationItem.tsx`
- Modify: `frontend/src/components/ResourceNavigation.tsx` (to use new component)

- [ ] **Step 1: Write `ResourceNavigationItem`**

```tsx
import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import NoteIcon from '@mui/icons-material/Note';
import { Resource, ResourceType } from '../types/dashboard';

interface Props {
  resource: Resource;
  selected: boolean;
  onClick: () => void;
}

const getIcon = (type: ResourceType) => {
  switch (type) {
    case 'Document': return <DescriptionIcon />;
    case 'Link': return <LinkIcon />;
    case 'Note': return <NoteIcon />;
    default: return <NoteIcon />;
  }
};

export const ResourceNavigationItem: React.FC<Props> = ({ resource, selected, onClick }) => (
  <ListItemButton
    selected={selected}
    onClick={onClick}
    sx={{
      borderRadius: 1,
      mb: 0.5,
      borderLeft: selected ? '4px solid #bb86fc' : 'none',
      '&.Mui-selected': { bgcolor: 'grey.700' }
    }}
  >
    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{getIcon(resource.type)}</ListItemIcon>
    <ListItemText primary={resource.title} />
  </ListItemButton>
);
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ResourceNavigationItem.tsx
git commit -m "feat: add ResourceNavigationItem component"
```

### Task 2: Create `AddResourceDrawer` Component

**Files:**
- Create: `frontend/src/components/AddResourceDrawer.tsx`

- [ ] **Step 1: Write `AddResourceDrawer`**

```tsx
import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { ResourceType } from '../types/dashboard';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (type: ResourceType, title: string, content: string) => void;
}

export const AddResourceDrawer: React.FC<Props> = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<ResourceType>('Note');
  const [content, setContent] = React.useState('');

  const handleSubmit = () => {
    onAdd(type, title, content);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Resource</Typography>
        <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
        <TextField select fullWidth label="Type" value={type} onChange={e => setType(e.target.value as ResourceType)} sx={{ mb: 2 }}>
            <MenuItem value="Note">Note</MenuItem>
            <MenuItem value="Link">Link</MenuItem>
            <MenuItem value="Document">Document</MenuItem>
        </TextField>
        <TextField fullWidth multiline rows={4} label="Content" value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" fullWidth onClick={handleSubmit}>Create</Button>
      </Box>
    </Drawer>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/AddResourceDrawer.tsx
git commit -m "feat: add AddResourceDrawer component"
```

### Task 3: Integrate into `ResourceNavigation`

**Files:**
- Modify: `frontend/src/components/ResourceNavigation.tsx`

- [ ] **Step 1: Update `ResourceNavigation.tsx` to use new components**

(Update imports to include `ResourceNavigationItem`, `AddResourceDrawer`. Replace inline add form with `AddResourceDrawer` and replace list items with `ResourceNavigationItem`).

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ResourceNavigation.tsx
git commit -m "feat: refactor ResourceNavigation to use drawer and new item component"
```

### Task 4: Final Validation

- [ ] **Step 1: Run frontend tests**

Run: `npm run test` (or equivalent test runner for frontend).
Expected: All tests passing.

- [ ] **Step 2: Manual Check**

Check UI, add a new resource, ensure drawer interaction works, active state indicator shows correctly.
