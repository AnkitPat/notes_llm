# Create Note Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a custom 'Create Note' modal for the dashboard.

**Architecture:** A new React component `CreateNoteModal.tsx` manages modal state (`isOpen`, `isLoading`) and interacts with `POST /notes` API.

**Tech Stack:** React, Tailwind CSS, TypeScript.

---

### Task 1: Create `CreateNoteModal` Component

**Files:**
- Create: `frontend/src/components/CreateNoteModal.tsx`

- [ ] **Step 1: Create skeleton for `CreateNoteModal`**

```tsx
'use client';
import { useState } from 'react';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateNoteModal({ isOpen, onClose, onCreate }: CreateNoteModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onCreate(name);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Create New Note</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Note Name"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Task 2: Integrate `CreateNoteModal` into `frontend/src/app/page.tsx`

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Modify `page.tsx` to include the modal**

```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import dummyResources from '@/lib/dummy-data/resources';
import { CreateNoteModal } from '@/components/CreateNoteModal';

export default function Home() {
  const notes = dummyResources; 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNote = async (name: string) => {
    // API Call
    await fetch('http://localhost:8000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', name }),
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Notes</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500"
            >
              Create New Note
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Link 
                key={note.id} 
                href={`/notes/${note.id}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                <p className="text-gray-600 text-sm">{note.type}</p>
              </Link>
            ))}
          </div>
        </div>
        <CreateNoteModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCreate={handleCreateNote} 
        />
      </div>
    </ProtectedRoute>
  );
}
```
