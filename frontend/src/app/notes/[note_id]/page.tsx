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
  params: {
    note_id: string;
  };
}

const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ params }) => {
  const { note_id } = params;
  const [noteName, setNoteName] = useState<string>('Loading...');
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAddResource = (type: ResourceType, title: string, content: string) => {
    const newResource: Resource = {
      id: `new-${Date.now()}`,
      type,
      title,
      content,
    };
    setResources((prevResources) => [...prevResources, newResource]);
    setSelectedResource(newResource);
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
      <div className="flex flex-grow overflow-hidden">
            {/* Left Panel - Resource Navigation */}
            <div className="w-[30%] bg-gray-800 text-white flex flex-col border-r border-gray-700">
            <ResourceNavigation
                resources={resources}
                selectedResource={selectedResource}
                onSelectResource={handleSelectResource}
                onAddResource={handleAddResource}
                onUploadDocument={handleUploadDocument}
                isUploading={isUploading}
            />
            </div>

            {/* Right Panel - Content Display and Chat */}
            <div className="w-[70%] flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{noteName}</h1>
            </div>

            <div className="flex-grow flex gap-6 overflow-hidden">
                {selectedResource ? (
                    <>
                        <div
                            className={`bg-white rounded-lg shadow mb-6 overflow-hidden flex flex-col ${
                            isChatExpanded ? 'flex-1' : 'flex-[2]'
                            } transition-all duration-300`}
                        >
                            <div className="flex-grow overflow-y-auto">
                            <ResourceContentDisplay
                                selectedResource={selectedResource}
                                onRemoveResource={handleRemoveResource}
                            />
                            </div>
                        </div>
                        <div
                            className={`bg-white rounded-lg shadow mb-6 overflow-hidden flex flex-col ${
                            isChatExpanded ? 'flex-[3]' : 'flex-1'
                            } transition-all duration-300`}
                        >
                            <ChatQnASection
                            chatHistory={messages}
                            onSendMessage={handleSendMessage}
                            isChatExpanded={isChatExpanded}
                            onToggleChatExpand={handleToggleChatExpand}
                            chatMode='Resource Chat'
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow">
                        <p className="text-gray-500">Select a resource to view details and chat.</p>
                    </div>
                )}
            </div>
            </div>
        </div>
    </ProtectedRoute>
  );
};

export default NoteDetailPage;
