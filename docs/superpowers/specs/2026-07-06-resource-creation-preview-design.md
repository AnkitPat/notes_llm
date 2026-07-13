# Design: ResourcePreview iframe Implementation

## Overview
Modify `ResourcePreview` to render a live `iframe` preview for non-Note resource types, replacing the current "Open Link" button.

## Architecture
- **Component:** `ResourcePreview`
- **Location:** `frontend/src/components/ResourcePreview.tsx`
- **Logic:** For `type !== 'Note'`, render an `iframe` instead of a `Button`.
- **`iframe` Attributes:**
  - `src`: `{link}`
  - `title`: `{title}`
  - `width`: "100%"
  - `height`: "400px"
  - `sandbox`: "allow-scripts allow-same-origin allow-forms"
  - `style`: `{ border: 'none' }`

## Constraints
- Many websites block embedding via `X-Frame-Options` or `Content-Security-Policy`. This approach accepts these failures.

## Testing Strategy
1. **Unit Test:** Verify `iframe` presence in `ResourceNavigationItem.test.tsx` (or update `ResourcePreview.test.tsx` if it existed).
2. **Manual Test:** Confirm `iframe` renders with provided URL and appropriate sandbox attributes.
