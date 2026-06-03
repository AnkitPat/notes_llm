// frontend/src/components/ResourceNavigation.tsx
'use client';

import React, { useState } from 'react';
import { Resource, ResourceType } from '../types/dashboard';

interface ResourceNavigationProps {
  resources: Resource[];
  selectedResource: Resource | null;
  onSelectResource: (resource: Resource) => void;
  onAddResource: (type: ResourceType, title: string, content: string) => void;
}

const ResourceNavigation: React.FC<ResourceNavigationProps> = ({
  resources,
  selectedResource,
  onSelectResource,
  onAddResource,
}) => {
  const [filterType, setFilterType] = useState<ResourceType | 'All Resources'>('All Resources');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceType, setNewResourceType] = useState<ResourceType>('Note');
  const [newResourceContent, setNewResourceContent] = useState('');

  const filteredResources =
    filterType === 'All Resources'
      ? resources
      : resources.filter((res) => res.type === filterType);

  const handleAddResource = () => {
    if (newResourceTitle.trim() && newResourceContent.trim()) {
      onAddResource(newResourceType, newResourceTitle.trim(), newResourceContent.trim());
      setNewResourceTitle('');
      setNewResourceContent('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Resources</h2>

      <div className="mb-4">
        <button
          className={`block w-full text-left py-2 px-3 rounded-md ${
            filterType === 'All Resources' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          onClick={() => setFilterType('All Resources')}
        >
          All Resources
        </button>
        {(['Document', 'Link', 'Note'] as ResourceType[]).map((type) => (
          <button
            key={type}
            className={`block w-full text-left py-2 px-3 rounded-md mt-1 ${
              filterType === type ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
            onClick={() => setFilterType(type)}
          >
            {type}s
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-1">
          {filteredResources.map((resource) => (
            <li
              key={resource.id}
              className={`cursor-pointer py-2 px-3 rounded-md ${
                selectedResource?.id === resource.id
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => onSelectResource(resource)}
            >
              {resource.title} ({resource.type})
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md w-full"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel Add Resource' : 'Add Resource'}
        </button>

        {showAddForm && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Resource Title"
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none"
              value={newResourceTitle}
              onChange={(e) => setNewResourceTitle(e.target.value)}
            />
            <select
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none"
              value={newResourceType}
              onChange={(e) => setNewResourceType(e.target.value as ResourceType)}
            >
              <option value="Note">Note</option>
              <option value="Document">Document</option>
              <option value="Link">Link</option>
            </select>
            <textarea
              placeholder="Content (for Note/Document) or URL (for Link)"
              rows={3}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none"
              value={newResourceContent}
              onChange={(e) => setNewResourceContent(e.target.value)}
            ></textarea>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full"
              onClick={handleAddResource}
            >
              Create Resource
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceNavigation;
