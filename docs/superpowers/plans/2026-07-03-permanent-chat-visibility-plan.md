# Permanent Chat Visibility Implementation Plan

**Goal:** Restructure `NoteDetailPage` to make the `ChatQnASection` always visible, supporting both resource-specific chat and general chat.

**Architecture:**
- Modify `NoteDetailPage` to split the right panel into two parts: top (Content/Message) and bottom (Permanent Chat).
- Update `ChatQnASection` to handle 'General' vs 'Resource' chat modes dynamically.

**Constraint:** NO tests. NO commits.

---

### Task 1: Refactor `NoteDetailPage`

**Files:**
- Modify: `frontend/src/app/notes/[note_id]/page.tsx`

- [ ] **Step 1: Update layout structure**
Restructure the right panel:

```tsx
<div className="w-[70%] flex flex-col p-6 overflow-hidden">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-900">{noteName}</h1>
  </div>

  <div className="flex-grow flex flex-col gap-6 overflow-hidden">
    {/* Conditional Content Area */}
    <div className="flex-grow bg-white rounded-lg shadow overflow-hidden">
        {selectedResource ? (
            <ResourceContentDisplay
                selectedResource={selectedResource}
                onRemoveResource={handleRemoveResource}
            />
        ) : (
            <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-gray-500">Select a resource to view details.</p>
            </div>
        )}
    </div>

    {/* Permanent Chat Area */}
    <div className="h-[40%] bg-white rounded-lg shadow overflow-hidden">
        <ChatQnASection
            chatHistory={messages}
            onSendMessage={handleSendMessage}
            isChatExpanded={isChatExpanded}
            onToggleChatExpand={handleToggleChatExpand}
            chatMode={selectedResource ? 'Resource Chat' : 'General Chat'}
        />
    </div>
  </div>
</div>
```
- [ ] **Step 2: Cleanup unused code**
Remove previous logic that conditionally rendered/expanded the chat section based on selection.
