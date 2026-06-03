// frontend/src/components/ResourceContentDisplay.tsx
import React from 'react';
import { Resource } from '../types/dashboard';

interface ResourceContentDisplayProps {
  selectedResource: Resource | null;
}

const ResourceContentDisplay: React.FC<ResourceContentDisplayProps> = ({ selectedResource }) => {
  if (!selectedResource) {
    return null;
  }

  const renderContent = () => {
    switch (selectedResource.type) {
      case 'Document':
        // For simplicity, directly rendering markdown-like content.
        // In a real app, you might use a markdown renderer component.
        return (
          <div className="prose lg:prose-xl">
            <h1>{selectedResource.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: selectedResource.content.replace(/\\n/g, '<br />') }} />
          </div>
        );
      case 'Link':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-2">{selectedResource.title}</h1>
            <a
              href={selectedResource.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {selectedResource.content}
            </a>
          </div>
        );
      case 'Note':
        return (
          <div className="prose lg:prose-xl">
            <h1 className="text-2xl font-bold mb-2">{selectedResource.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: selectedResource.content.replace(/\\n/g, '<br />') }} />
          </div>
        );
      default:
        return <p>Unknown resource type.</p>;
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner h-full overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default ResourceContentDisplay;
