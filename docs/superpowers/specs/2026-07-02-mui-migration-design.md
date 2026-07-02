# Material UI Migration Design

## Objective
Migrate the existing Next.js frontend from Tailwind CSS to Material UI (MUI) while maintaining the current UI structure and design patterns.

## Scope
- Replace all Tailwind CSS classes (`className="..."`) with MUI components (`Box`, `Container`, `Typography`, `Link`, `AppBar`, etc.).
- Remove Tailwind dependency if completely replaced.
- Set up global theme provider and baseline.

## Technical Approach
1. **Dependencies**: Add `@mui/material @emotion/react @emotion/styled @mui/icons-material`.
2. **Global Configuration**:
   - Create `frontend/src/theme/theme.ts` for MUI theme customization (colors, typography).
   - Update `frontend/src/app/layout.tsx` to include `ThemeProvider` and `CssBaseline`.
3. **Component Refactoring**:
   - Replace utility-based layout and styling with MUI components.
   - Map existing Tailwind utility classes to corresponding MUI props/styles.

## Compatibility & Testing
- Ensure UI parity with existing design.
- Run existing test suite (`vitest`) after each component refactoring to ensure no regressions.
- Verify component behavior (navigation, layout, interactions).
