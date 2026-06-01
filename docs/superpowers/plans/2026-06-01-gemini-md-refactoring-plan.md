# GEMINI.md Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** To refactor the `GEMINI.md` file for the `notes_llm` project, removing all `CampGPT`-specific references and replacing them with generic, high-standard RAG and development conventions, while retaining relevant SDLC and AI-collaboration guidelines.

**Architecture:** The `GEMINI.md` file will be updated to reflect project-wide instructions and conventions for the `notes_llm` project, removing legacy references and ensuring a clean, standardized foundation for future development.

**Tech Stack:** Not applicable, as this plan focuses on documentation refactoring.

---

### Task 1: Update GEMINI.md with Refactored Content

**Files:**
- Modify: `GEMINI.md`

- [ ] **Step 1: Replace old "Core Conventions" and "Technical Conventions" with new content.**

```markdown
# Project Instructions

This file contains project-wide instructions, conventions, and workflows that must be followed across all sessions.

## Core Conventions

- **Activity Log:** Maintain `logs/activity_log.md` by adding an entry after every logical task completion.
- **Collaboration:** Before starting any User Story, discuss the "Plan of Action" and get user confirmation.
- **Design First:** For every User Story, you **MUST** create a design spec (`docs/superpowers/specs/`) and an implementation plan (`docs/superpowers/plans/`) before writing any implementation code.
- **Source Control:** Commit every User Story to git individually to maintain a workable and traceable codebase.
- **Tech Stack:**
    - **Backend:** Python (FastAPI, LangChain, ChromaDB).
    - **Frontend:** Next.js.
    - **Chat Widget:** React + Vite.
- **Documentation:** Refer to the `documentations/` directory for PRD and User Stories.

## Technical Conventions

- **RAG Configuration:**
    - **Chunk Size:** 300–800 tokens.
    - **Metadata:** Define metadata requirements per document type as needed for filtered retrieval.
    - **Vector DB:** ChromaDB persisted in `backend/chroma_db`.
- **API Standards:**
    - Use FastAPI for backend endpoints.
    - `POST /query` body: `{"question": "...", "documentId": "..."}`.
    - Return `answer` and `sources` (including document title and ID).
- **Quality Standards:**
    - **Testing:** Mandatory unit tests for all backend logic (using `pytest`).
    - **Pre-commit Checks:** Mandatory linting and type checking (e.g., `ruff`, `mypy`) must pass before every commit.
    - **Frontend Testing:** Mandatory unit and integration tests for Next.js components and React widgets (e.g., using Jest and React Testing Library).
    - **Frontend Pre-commit Checks:** Mandatory linting (e.g., ESLint), code formatting (e.g., Prettier), and type checking (e.g., TypeScript) must pass before every commit.

---

## 🤖 AI-Assisted Development Guidelines
```

The above content should replace the section from `# Project Instructions` down to `## 🤖 AI-Assisted Development Guidelines` (just before it starts).

- [ ] **Step 2: Commit the changes to GEMINI.md.**

```bash
git add GEMINI.md
git commit -m "docs: Refactor GEMINI.md for notes_llm project"
```

### Task 2: Create Design Specification Document (Already Completed)

**Files:**
- Create: `docs/superpowers/specs/2026-06-01-notes_llm-gemini-md-refactoring-design.md`

- [ ] **Step 1: Verify the design specification document exists.**

    This document should already have been created in the brainstorming phase.
    Path: `docs/superpowers/specs/2026-06-01-notes_llm-gemini-md-refactoring-design.md`

- [ ] **Step 2: Commit the design specification document (if not already committed).**

```bash
git add docs/superpowers/specs/22026-06-01-notes_llm-gemini-md-refactoring-design.md
git commit -m "docs: Add design spec for GEMINI.md refactoring"
```
