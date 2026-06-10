// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import ResourceNavigation from '@/components/ResourceNavigation';
import ResourceContentDisplay from '@/components/ResourceContentDisplay';
import ChatQnASection from '@/components/ChatQnASection';
import dummyResources from '@/lib/dummy-data/resources';
import dummyChatResponses from '@/lib/dummy-data/chat';
import { Resource, ChatMessage, ResourceType } from '@/types/dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { signOut, useSession } from 'next-auth/react';
import { uploadDocument } from '@/lib/api';

const DashboardPage: React.FC = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>(dummyResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsChatExpanded(false); // Reset expansion on new resource selection
    setMessages(dummyChatResponses[resource.id] || []);
  };

  const handleRemoveResource = () => {
    setSelectedResource(null);
    setIsChatExpanded(false);
    setMessages([]); // Reset history when removing resource
  };

  const handleToggleChatExpand = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  const handleAddResource = (type: ResourceType, title: string, content: string) => {
    const newResource: Resource = {
      id: `new-${Date.now()}`, // Simple unique ID
      type,
      title,
      content,
    };
    setResources((prevResources) => [...prevResources, newResource]);
    // Optionally select the newly added resource
    setSelectedResource(newResource);
  };

  const handleUploadDocument = async (file: File) => {
    if (!session?.user?.email) {
      alert('You must be logged in to upload documents');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadDocument(file, session.user.email);
      const newResource: Resource = {
        id: result.id,
        type: 'Document',
        title: result.title,
        content: result.webViewLink,
      };
      setResources((prevResources) => [...prevResources, newResource]);
      setSelectedResource(newResource);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check backend connection and Google credentials.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    const newUserMessage: ChatMessage = { role: 'user', message };
    setMessages((prevHistory) => [...prevHistory, newUserMessage]);

    if (!selectedResource) return;

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'ai',
        message: `AI's dummy response to: "${message}" about "${selectedResource.title}".`,
      };
      setMessages((prevHistory) => [...prevHistory, aiResponse]);
    }, 1000);
  };


  return (
    <ProtectedRoute>
      <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">
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
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedResource ? `Viewing: ${selectedResource.title}` : 'Welcome to your dashboard'}
            </h1>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>

          <div className="flex-grow flex gap-6 overflow-hidden">
            {selectedResource && (
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
            )}
            <div
              className={`bg-white rounded-lg shadow mb-6 overflow-hidden flex flex-col ${
                selectedResource
                  ? isChatExpanded
                    ? 'flex-[3]'
                    : 'flex-1'
                  : 'flex-1'
              } transition-all duration-300`}
            >
              <ChatQnASection
                chatHistory={messages}
                onSendMessage={handleSendMessage}
                isChatExpanded={isChatExpanded}
                onToggleChatExpand={handleToggleChatExpand}
                chatMode={selectedResource ? 'Resource Chat' : 'All Resource Chat'}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
