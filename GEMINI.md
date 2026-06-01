#  Project Instructions

This file contains project-wide instructions, conventions, and workflows that must be followed across all sessions.

## Core Conventions
- **User Story First:** Before starting any development task, you **MUST** create or update a corresponding User Story in `documentations/user-stories.md`. This ensures alignment on requirements and success criteria.
- **Collaboration:** Before starting any User Story, discuss the "Plan of Action" and get user confirmation.
- **Design First:** For every User Story, you **MUST** create a design spec (`docs/superpowers/specs/`) and an implementation plan (`docs/superpowers/plans/`) before writing any implementation code.
- **Tech Stack:**
    - **Backend:** Python (FastAPI, LangChain, ChromaDB).
    - **Frontend:** Next.js.
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
    - **Frontend Pre-commit Checks:** Mandatory linting (e.g., ESLint), code formatting (e.g., Prettier), and type checking (e.js., TypeScript) must pass before every commit.

---

## 🤖 AI-Assisted Development Guidelines

### 🎯 Objective

Ensure every team member actively uses AI tools (Gemini, ChatGPT, etc.) across the Software Development Lifecycle (SDLC), not just for coding but for thinking, planning, and improving productivity.

---

## 🧠 AI as a Team Member

AI should be treated as:

* 👨‍💻 Pair Programmer
* 🧠 Solution Architect
* 🐞 Debugging Assistant
* 📄 Documentation Writer

AI is **not a replacement**, but a **collaborator**.

---

## 🔄 AI Usage Across SDLC

### 1. Planning

* Use AI to:

  * Generate PRDs
  * Break down features
  * Define user stories

### 2. Design

* Ask AI for:

  * Architecture suggestions
  * Data flow diagrams
  * Technology decisions

### 3. Development

* Use AI to:

  * Generate boilerplate code
  * Suggest implementation approaches
  * Refactor existing code

### 4. Debugging

* Use AI to:

  * Analyze errors
  * Suggest fixes
  * Identify root causes

### 5. Testing

* Use AI to:

  * Generate test cases
  * Identify edge cases
  * Validate logic

### 6. Documentation

* Use AI to:

  * Write documentation
  * Improve readability
  * Maintain consistency

---

## 🧠 Prompting Best Practices

* Be specific:

  * Include context
  * Mention expected output format

* Iterate:

  * Improve prompts based on AI responses

* Validate:

  * Always review AI-generated output before using

---

## 🔁 Standard AI Workflow

1. Define the problem
2. Ask AI for approach
3. Generate initial solution
4. Review and refine manually
5. Test the implementation
6. Iterate with improved prompts

---

## 🚫 Anti-Patterns

Avoid:

* Blind copy-paste from AI
* Skipping validation
* Over-reliance without understanding
* Over-engineering using AI suggestions

---

## 🎯 Success Criteria

We consider AI usage successful when:

* AI reduces development time
* Developers understand AI-generated solutions
* Code quality remains stable or improves
* AI is used consistently across SDLC phases

---

## 🏁 Final Principle

> “AI is not just a tool — it is a development partner.”

All team members should actively collaborate with AI to build, learn, and improve.
