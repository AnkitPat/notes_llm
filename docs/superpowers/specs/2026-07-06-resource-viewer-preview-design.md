# Design: ResourceContentDisplay iframe Implementation

## Overview
Modify `ResourceContentDisplay` to render a live `iframe` preview for 'Link' type resources, replacing the current clickable `Link` component.

## Architecture
- **Component:** `ResourceContentDisplay`
- **Location:** `frontend/src/components/ResourceContentDisplay.tsx`
- **Logic:** For `selectedResource.type === 'Link'`, render an `iframe` instead of a `Link` component.
- **`iframe` Attributes:**
  - `src`: `{selectedResource.content}`
  - `title`: `{selectedResource.title}`
  - `width`: "100%"
  - `height`: "100%" (fills parent container)
  - `sandbox`: "allow-scripts allow-same-origin allow-forms"
  - `style`: `{ border: 'none' }`

## Constraints
- As with `ResourcePreview`, many websites block embedding via `X-Frame-Options` or `Content-Security-Policy`. This approach accepts these failures.

## Testing Strategy
1. **Unit Test:** Verify `iframe` presence when a Link resource is selected.
2. **Manual Test:** Confirm `iframe` renders with provided URL and fills the viewer container.
