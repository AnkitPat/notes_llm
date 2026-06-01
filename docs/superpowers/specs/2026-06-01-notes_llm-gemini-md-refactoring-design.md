# notes_llm GEMINI.md Refactoring Design

## Date: 2026-06-01

## Objective

To refactor the `GEMINI.md` file for the `notes_llm` project, removing all `CampGPT`-specific references and replacing them with generic, high-standard RAG and development conventions. The existing "Design First" and "AI as a Team Member" sections will be retained due to their continued relevance to the desired SDLC.

## Design Decisions

### 1. Core Conventions

- **Activity Log:** Maintained (`logs/activity_log.md`).
- **Collaboration:** Maintained (discussion and user confirmation for User Stories).
- **Design First:** Maintained (design spec and implementation plan before coding).
- **Source Control:** Maintained (commit every User Story individually).
- **Tech Stack:**
    - **Backend:** Python (FastAPI, LangChain, ChromaDB) - *Retained.*
    - **Frontend:** Next.js - *Retained.*
    - **Chat Widget:** React + Vite - *Retained.*
- **Documentation:** Maintained (`documentations/` directory).

### 2. Technical Conventions

- **RAG Configuration:**
    - **Chunk Size:** Maintained at 300–800 tokens.
    - **Metadata:** Changed from `id (campsiteId)` to a more generic instruction: "Define metadata requirements per document type as needed for filtered retrieval." This removes the `CampGPT` specific `campsiteId` and allows for flexibility with different document types in `notes_llm`.
    - **Vector DB:** Maintained as ChromaDB persisted in `backend/chroma_db`.
- **API Standards:**
    - **FastAPI:** Maintained for backend endpoints.
    - **POST /query body:** Changed from `{"question": "...", "campsiteId": "..."}` to `{"question": "...", "documentId": "..."}`. This aligns with the removal of `CampGPT` specifics.
    - **Return values:** Changed from `answer` and `sources` (including campsite name and ID) to `answer` and `sources` (including document title and ID). This generic naming is appropriate for `notes_llm`.
- **Quality Standards:**
    - **Testing (Backend & Frontend):** Maintained as mandatory unit/integration tests with specified tools (`pytest`, Jest, React Testing Library).
    - **Pre-commit Checks (Backend & Frontend):** Maintained as mandatory linting, type checking, and formatting (`ruff`, `mypy`, ESLint, Prettier, TypeScript).

### 3. Removed Sections

- The `📈 Project Progress` table, which contained `CampGPT` specific User Story statuses, has been entirely removed to create a clean slate for `notes_llm`.

### 4. Retained Sections

- All sections related to `🤖 AI-Assisted Development Guidelines`, `🧠 AI as a Team Member`, `🔄 AI Usage Across SDLC`, `🧠 Prompting Best Practices`, `🔁 Standard AI Workflow`, `🚫 Anti-Patterns`, `🎯 Success Criteria`, and `🏁 Final Principle` have been retained without modification.

## Spec Self-Review

- **Placeholder scan:** No placeholders or "TBD"s.
- **Internal consistency:** The design consistently removes `CampGPT` specific terms and replaces them with generic `notes_llm` equivalents. The preserved sections remain logically separated.
- **Scope check:** The spec is focused on refactoring `GEMINI.md` and does not introduce new features, keeping the scope manageable for a single implementation plan.
- **Ambiguity check:** The changes are explicit and clear, with no apparent ambiguities.

---
