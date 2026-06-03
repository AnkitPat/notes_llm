// frontend/src/lib/dummy-data/resources.ts
import { Resource } from '../../types/dashboard.d';

const dummyResources: Resource[] = [
  {
    id: 'doc-1',
    type: 'Document',
    title: 'Meeting Notes Q1 2026',
    content: '## Meeting Notes - Q1 2026

**Date:** January 15, 2026

**Attendees:** John Doe, Jane Smith, Bob Johnson

**Topics Discussed:**
1. Project Alpha Kick-off
2. Budget Review
3. Q1 Marketing Strategy

**Action Items:**
- John: Draft project plan for Alpha.
- Jane: Prepare Q1 budget report.
- Bob: Develop social media campaign ideas.

---',
  },
  {
    id: 'link-1',
    type: 'Link',
    title: 'Next.js Documentation',
    content: 'https://nextjs.org/docs',
  },
  {
    id: 'note-1',
    type: 'Note',
    title: 'Ideas for New Feature',
    content: 'Brainstormed some ideas for the new user authentication flow:
- Social logins (Google, GitHub)
- Email/password with MFA
- Magic links for passwordless access

Need to research NextAuth.js capabilities further.',
  },
  {
    id: 'doc-2',
    type: 'Document',
    title: 'Project Phoenix Proposal',
    content: '## Project Phoenix: A New Initiative

**Overview:** Project Phoenix aims to revitalize our legacy codebase by migrating to a modern, scalable architecture. This will involve updating core dependencies, refactoring critical modules, and improving developer experience.

**Goals:**
1.  Reduce technical debt by 50%.
2.  Improve system performance by 30%.
3.  Enhance developer productivity through better tools.

**Timeline:**
-   Phase 1 (Q3 2026): Planning and Proof of Concept.
-   Phase 2 (Q4 2026 - Q1 2027): Core Migration.
-   Phase 3 (Q2 2027): Feature Parity and Deployment.

**Key Technologies:**
-   Next.js for frontend.
-   FastAPI for backend microservices.
-   TypeScript for type safety.',
  },
  {
    id: 'link-2',
    type: 'Link',
    title: 'FastAPI Official Site',
    content: 'https://fastapi.tiangolo.com/',
  },
];

export default dummyResources;
