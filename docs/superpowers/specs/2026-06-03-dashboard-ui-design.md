# Dashboard UI Design Specification

## 1. Introduction
This document outlines the design for the frontend dashboard UI, focusing on presenting user resources (Documents, Links, Notes) and enabling interaction through content display and a Q&A section. The implementation will use dummy data and will not involve any backend modifications at this stage.

## 2. Overall Layout
The dashboard will employ a two-panel layout:
- **Left Panel (Navigation - ~30% width):** Will house the list of resource types and an option to add new resources.
- **Right Panel (Content & Interaction - ~70% width):** Will display the details of the selected resource and provide a chat/Q&A interface.

## 3. Component Breakdown

### 3.1. Dashboard Page (`frontend/src/app/dashboard/page.tsx`)
This will be the main entry point for the dashboard, orchestrating the layout and state management between the left and right panels.

### 3.2. Left Panel Components

#### 3.2.1. `ResourceNavigation.tsx`
- **Purpose:** Displays a list of resource types (Categories) and the individual resources within each type, with clear visual separation.
- **Data:**
    - `resourceTypes`: An array of strings (e.g., ["Documents", "Links", "Notes"]).
    - `resources`: An array of resource objects (see Dummy Data for structure).
- **Structure:**
    - **Top Section (Categories):** Features large, clickable "cards" for "All Resources", "Documents", "Links", and "Notes". Each card displays the category name and an item count.
    - **Divider:** A prominent horizontal line separates categories from the specific list.
    - **Bottom Section (Resource List):** Displays the scrollable list of resource titles filtered by the selected category.
- **Functionality:**
    - Selecting a category card updates the filter and highlights the active card.
    - Selecting an individual resource highlights it and updates the right panel.
- **Styling:** Vertical layout, card-based category buttons with distinct active states, subtle divider, and a clean resource list.

#### 3.2.2. `AddResourceButton.tsx` (or integrated into `ResourceNavigation`)
- **Purpose:** Provides an interface to add a new dummy resource.
- **Functionality:**
    - A button or input field that, when interacted with, simulates adding a new resource (e.g., opens a modal or expands an input form).
    - Collects basic information for a new dummy resource (e.g., type, title).
    - Adds the new dummy resource to the list.

### 3.3. Right Panel Components

#### 3.3.1. `ResourceContentDisplay.tsx`
- **Purpose:** Displays the content of the currently selected resource.
- **Data:**
    - `selectedResource`: The resource object whose content is to be displayed.
- **Functionality:** Renders different content based on the `resourceType` (e.g., plain text for Notes, a dummy URL for Links, simulated document content for Documents).
- **Styling:** Scrollable area, clear title, content formatting appropriate for the resource type.

#### 3.3.2. `ChatQnASection.tsx`
- **Purpose:** Provides a chat-like interface for asking questions and displaying dummy answers related to the selected resource.
- **Data:**
    - `chatHistory`: An array of objects, each with `role` (user/ai) and `message`.
- **Functionality:**
    - Text input for users to type questions.
    - Button to submit questions.
    - Displays dummy AI responses.
- **Styling:** Chat bubble-like interface, input field at the bottom.

## 4. Dummy Data Structure

The frontend will use hardcoded dummy data to represent resources and chat interactions.

### 4.1. `resources.ts` (e.g., `frontend/src/lib/dummy-data/resources.ts`)
```typescript
interface Resource {
  id: string;
  type: 'Document' | 'Link' | 'Note';
  title: string;
  content: string; // Or URL for links, rich text for documents
}

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
```

### 4.2. `chat.ts` (e.g., `frontend/src/lib/dummy-data/chat.ts`)
```typescript
interface ChatMessage {
  role: 'user' | 'ai';
  message: string;
}

const dummyChatResponses: { [key: string]: ChatMessage[] } = {
  'doc-1': [
    { role: 'ai', message: 'These meeting notes seem comprehensive. Is there anything specific you would like to know about them?' },
    { role: 'ai', message: 'I can summarize the action items for you if needed.' },
  ],
  'link-1': [
    { role: 'ai', message: 'This link points to the Next.js documentation. What specifically are you trying to learn or build with Next.js?' },
  ],
  'note-1': [
    { role: 'ai', message: 'These are great ideas for authentication! What are your initial thoughts on the pros and cons of each approach?' },
  ],
};

export default dummyChatResponses;
```

## 5. Styling
The application will adhere to the existing `frontend/src/app/globals.css` for general styling. Component- specific styling will use either CSS Modules or inline styles as appropriate, ensuring a clean and modern aesthetic. Tailwind CSS will be avoided unless explicitly requested or found to be already in use.

## 6. Interaction Flow
1.  User navigates to the dashboard page.
2.  The left panel displays "Documents", "Links", and "Notes" categories.
3.  Upon selecting a category, dummy resources of that type are listed.
4.  User selects a specific resource from the list.
5.  The right panel updates to show the content of the selected resource.
6.  The `ChatQnASection` displays dummy chat history related to the selected resource (if any).
7.  User can type a question into the chat input.
8.  Upon submission, a dummy AI response is displayed in the chat history.
9.  User can click "Add Resource" in the left panel to add a new dummy resource.

## 7. Testing Strategy
-   **Unit Tests:** Jest and React Testing Library will be used to test individual components (e.g., `ResourceNavigation`, `ResourceContentDisplay`, `ChatQnASection`) for correct rendering and interaction with dummy data.
-   **Integration Tests:** Ensure that the `Dashboard Page` correctly integrates the panels and manages state for resource selection and chat.

## 8. Open Questions / Future Considerations
-   How should "Add Resource" functionality precisely work (e.g., modal form, inline input)? (Will assume a simple inline form for now).
-   Advanced filtering or searching of resources.
-   Real-time chat interaction (future backend integration).
-   Persistence of added dummy resources beyond session (not in scope for this story).