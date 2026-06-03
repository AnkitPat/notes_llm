// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ResourceNavigation from '@/components/ResourceNavigation';
import ResourceContentDisplay from '@/components/ResourceContentDisplay';
import ChatQnASection from '@/components/ChatQnASection';
import dummyResources from '@/lib/dummy-data/resources';
import dummyChatResponses from '@/lib/dummy-data/chat';
import { Resource, ChatMessage, ResourceType } from '@/types/dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const DashboardPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(dummyResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (selectedResource) {
      setChatHistory(dummyChatResponses[selectedResource.id] || []);
    } else {
      setChatHistory([]);
    }
  }, [selectedResource]);

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
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

  const handleSendMessage = (message: string) => {
    if (!selectedResource) return;

    const newUserMessage: ChatMessage = { role: 'user', message };
    setChatHistory((prevHistory) => [...prevHistory, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'ai',
        message: `AI's dummy response to: "${message}" about "${selectedResource.title}".`,
      };
      setChatHistory((prevHistory) => [...prevHistory, aiResponse]);
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
          />
        </div>

        {/* Right Panel - Content Display and Chat */}
        <div className="w-[70%] flex flex-col p-6 overflow-hidden">
          <div className="flex-grow bg-white rounded-lg shadow mb-6 overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto">
              <ResourceContentDisplay selectedResource={selectedResource} />
            </div>
          </div>
          <div className="h-1/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <ChatQnASection chatHistory={chatHistory} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
