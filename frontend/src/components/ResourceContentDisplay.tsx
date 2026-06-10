// frontend/src/components/ResourceContentDisplay.tsx
import React from 'react';
import { Resource } from '../types/dashboard';

interface ResourceContentDisplayProps {
  selectedResource: Resource | null;
  onRemoveResource: () => void;
}

const ResourceContentDisplay: React.FC<ResourceContentDisplayProps> = ({ selectedResource, onRemoveResource }) => {
  if (!selectedResource) {
    return null;
  }

  const renderContent = () => {
    switch (selectedResource.type) {
      case 'Document':
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
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-inner overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg text-gray-800">Viewer</h2>
        <button
          onClick={onRemoveResource}
          className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded border border-red-200 transition-colors"
        >
          Remove Resource
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">{renderContent()}</div>
    </div>
  );
};

export default ResourceContentDisplay;
