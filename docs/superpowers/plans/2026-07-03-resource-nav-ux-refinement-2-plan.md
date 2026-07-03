# UX Refinement 2: Polished Resource Navigation Plan

**Goal:** Improve aesthetic and UX by using MUI `Chip` components, increasing whitespace, and refining typography.

**Constraint:** NO tests. NO commits.

---

### Task 1: Refactor `ResourceNavigation.tsx`

**Files:**
- Modify: `frontend/src/components/ResourceNavigation.tsx`

- [ ] **Step 1: Replace filter Buttons with Chips**
Replace the `Button` components for category filtering with `Chip` components:

```tsx
<Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
  {categories.map((type) => (
    <Chip
      key={type}
      label={type === 'All Resources' ? type : `${type}s`}
      onClick={() => setFilterType(type as any)}
      color={filterType === type ? 'primary' : 'default'}
      variant={filterType === type ? 'filled' : 'outlined'}
      sx={{ cursor: 'pointer', borderRadius: '16px' }}
    />
  ))}
</Box>
```
*Note: Make sure to import `Chip` from `@mui/material/Chip`.*

- [ ] **Step 2: Increase spacing and refine typography**
Update the main `Box` padding to `p: 3`. Ensure `Typography` for headers and items has consistent font weight and spacing.

### Task 2: Refactor `ResourceNavigationItem.tsx`

**Files:**
- Modify: `frontend/src/components/ResourceNavigationItem.tsx`

- [ ] **Step 1: Enhance active state and typography**

Update `ListItemButton` styling for better feedback:

```tsx
<ListItemButton
  selected={selected}
  onClick={onClick}
  sx={{
    borderRadius: 1,
    mb: 0.5,
    borderLeft: selected ? '4px solid #bb86fc' : 'none',
    transition: 'all 0.2s',
    '&:hover': { bgcolor: 'grey.800' },
    '&.Mui-selected': { bgcolor: 'grey.800' }
  }}
>
  <ListItemIcon sx={{ color: selected ? '#bb86fc' : 'white', minWidth: 40 }}>{getIcon(resource.type)}</ListItemIcon>
  <ListItemText primary={resource.title} primaryTypographyProps={{ fontWeight: selected ? 600 : 400 }} />
</ListItemButton>
```
