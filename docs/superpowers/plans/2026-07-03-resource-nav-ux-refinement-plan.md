# UX Refinement: Streamlined Resource Navigation Plan

**Goal:** Replace the bulky Grid/Card category filter in `ResourceNavigation.tsx` with a clean, horizontal row of Filter Chips.

**Architecture:**
- Remove `Grid` and `Card` components from `ResourceNavigation.tsx`.
- Add a new `Box` or `Stack` container for the filter chips.
- Create or reuse a Chip-like component or just style Buttons to look like chips.

**Constraint:** NO tests. NO commits.

---

### Task 1: Refactor `ResourceNavigation.tsx`

**Files:**
- Modify: `frontend/src/components/ResourceNavigation.tsx`

- [ ] **Step 1: Replace category grid with filter chips**

Replace the current `Grid` container mapping categories to cards with:

```tsx
<Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
  {categories.map((type) => (
    <Button
      key={type}
      variant={filterType === type ? 'contained' : 'outlined'}
      onClick={() => setFilterType(type as any)}
      size="small"
      sx={{ borderRadius: '16px', textTransform: 'capitalize' }}
    >
      {type === 'All Resources' ? type : `${type}s`}
    </Button>
  ))}
</Box>
```
Ensure the `categories` array and `filteredResources` logic remains intact.

- [ ] **Step 2: Cleanup unused imports**
Remove `Card`, `CardActionArea`, `CardContent`, and `Grid` from imports if they are no longer used in `ResourceNavigation.tsx`.
