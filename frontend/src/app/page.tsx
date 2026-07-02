'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateNoteModal } from '@/components/CreateNoteModal';

interface Note {
  _id: string;
  name: string;
  userId: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(`http://localhost:8000/notes?email=${encodeURIComponent(session.user.email)}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async (name: string) => {
    if (!session?.user?.email) throw new Error('User not logged in');

    // API Call
    const response = await fetch('http://localhost:8000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, name }),
    });
    if (!response.ok) {
        throw new Error('Failed to create note');
    }
    await fetchNotes(); // Refresh list
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

          {notes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <p className="text-gray-500">No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Link 
                  key={note._id} 
                  href={`/notes/${note._id}`}
                  className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-2">{note.name}</h2>
                </Link>
              ))}
            </div>
          )}
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
