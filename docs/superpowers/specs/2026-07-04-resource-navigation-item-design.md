# ResourceNavigationItem Design

## Goal
Create a reusable `ResourceNavigationItem` component for the dashboard navigation sidebar to improve visual consistency and maintainability.

## UI Requirements
- Use MUI's `ListItemButton` as the base.
- Display an icon based on the resource type ('Document', 'Link', 'Note').
- Display the resource title.
- Highlight the item when selected.
- Follow existing color scheme (dark mode, primary highlight).

## API
```tsx
interface Props {
  resource: Resource;
  selected: boolean;
  onClick: () => void;
}
```

## Styling
- `borderRadius: 1`
- `mb: 0.5`
- `borderLeft: selected ? '4px solid #bb86fc' : 'none'`
- `'&.Mui-selected': { bgcolor: 'grey.700' }`
- Icon color: 'white'
