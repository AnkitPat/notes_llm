'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceNavigation from '@/components/ResourceNavigation';
import ResourceContentDisplay from '@/components/ResourceContentDisplay';
import ChatQnASection from '@/components/ChatQnASection';
import { Resource, ChatMessage, ResourceType } from '@/types/dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { signOut } from 'next-auth/react';
import { uploadDocument } from '@/lib/api';

interface NoteDetailPageProps {
  params: Promise<{
    note_id: string;
  }>;
}

const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ params }) => {
  const { note_id } = React.use(params);
  const [noteName, setNoteName] = useState<string>('Loading...');

  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchResources = async () => {
    try {
      const response = await fetch(`http://localhost:8000/notes/${note_id}/resources`);
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((r: any) => ({
          id: r._id,
          type: r.type,
          title: r.name,
          content: r.type === 'Link' ? r.link : r.content || ''
        }));
        setResources(mapped);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`http://localhost:8000/notes/${note_id}`);
        if (response.ok) {
          const data = await response.json();
          setNoteName(data.name);
        } else {
          setNoteName('Unknown Note');
        }
      } catch (error) {
        setNoteName('Error loading note');
      }
    }
    fetchNote();
    fetchResources();
  }, [note_id]);

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsChatExpanded(false);
    setMessages([]);
  };

  const handleRemoveResource = () => {
    setSelectedResource(null);
    setIsChatExpanded(false);
    setMessages([]);
  };

  const handleToggleChatExpand = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  const handleAddResource = async (type: ResourceType, title: string, content: string, link?: string) => {
    await fetchResources();
  };

  const handleUploadDocument = async (file: File) => {
    // ... same as before
    setIsUploading(true);
    // ...
  };

  const handleSendMessage = (message: string) => {
    const newUserMessage: ChatMessage = { role: 'user', message };
    setMessages((prevHistory) => [...prevHistory, newUserMessage]);
    // TODO: Connect to backend API for AI response
  };

  return (
    <ProtectedRoute>
      <div className="flex h-[calc(100vh-64px-64px)] overflow-hidden">
        {/* Left Panel */}
        <div className="w-[30%] bg-gray-800 text-white flex flex-col border-r border-gray-700">
          <ResourceNavigation
            resources={resources}
            selectedResource={selectedResource}
            onSelectResource={handleSelectResource}
            onAddResource={handleAddResource}
            onUploadDocument={handleUploadDocument}
            isUploading={isUploading}
            noteId={note_id}
          />
        </div>

        {/* Right Panel */}
        <div className="w-[70%] flex flex-col p-6 overflow-hidden min-h-0">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">{noteName}</h1>
          </div>

          <div className="flex flex-1 min-h-0 gap-6 overflow-hidden">
            {/* Left Content */}
            <div className="flex-1 min-h-0 bg-white rounded-lg shadow flex flex-col">
              {selectedResource ? (
                <ResourceContentDisplay
                  selectedResource={selectedResource}
                  onRemoveResource={handleRemoveResource}
                />

              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">
                    Select a resource to view details.
                  </p>
                </div>
              )}
            </div>

            {/* Right Chat */}
            <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
              <ChatQnASection
                chatHistory={messages}
                onSendMessage={handleSendMessage}
                isChatExpanded={isChatExpanded}
                onToggleChatExpand={handleToggleChatExpand}
                chatMode={selectedResource ? "Resource Chat" : "General Chat"}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NoteDetailPage;
