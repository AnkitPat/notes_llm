# Design Spec: US1 - Initial Frontend Setup

**Date:** 2026-06-01
**Status:** Approved

## 1. Overview
The goal of this task is to initialize the frontend for the "Notes LLM" project. This involves setting up a Next.js application in a dedicated directory with a modern tech stack and a feature-ready structure.

## 2. Architecture
- **Framework:** Next.js (App Router)
- **Directory:** `frontend/`
- **Source Code:** `src/` directory pattern
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** npm

### Directory Structure
```
frontend/
├── src/
│   ├── app/           # App router pages, layouts, and global styles
│   ├── components/    # Reusable UI components (Nav, Footer, Buttons, etc.)
│   ├── lib/           # Utility functions, constants, and API clients
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript interfaces and types
├── public/            # Static assets
└── tests/             # Component and integration tests (Vitest)
```

## 3. Key Components
- **Root Layout:** Provides the global structure, including a responsive `Navbar` and `Footer`.
- **Home Page:** A welcoming hero section with the title "Notes LLM" and a brief mission statement.
- **Navbar:** Navigation links to Home and future features (e.g., Notes).

## 4. Technical Specifications
- **Styling:** Tailwind CSS for all styling, using standard utility classes.
- **Components:** Functional components with TypeScript props.
- **Icons:** Lucide-react for consistent iconography.

## 5. Testing & Quality
- **Unit Testing:** Vitest + React Testing Library.
- **Linting:** ESLint with Next.js defaults.
- **Formatting:** Prettier for consistent code style.
- **Verification:** `npm run build`, `npm run lint`, and `npm test` must pass.

## 6. Success Criteria
- [ ] Next.js app is successfully initialized in `frontend/`.
- [ ] Home page renders at `/` with a "Welcome to Notes LLM" message.
- [ ] Layout includes functional (but simple) Navbar and Footer.
- [ ] TypeScript, ESLint, and Prettier are correctly configured.
- [ ] At least one unit test exists for the home page and passes.
