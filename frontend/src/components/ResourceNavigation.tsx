// frontend/src/components/ResourceNavigation.tsx
'use client';

import React, { useState } from 'react';
import { Resource, ResourceType } from '../types/dashboard';

interface ResourceNavigationProps {
  resources: Resource[];
  selectedResource: Resource | null;
  onSelectResource: (resource: Resource) => void;
  onAddResource: (type: ResourceType, title: string, content: string) => void;
  onUploadDocument: (file: File) => void;
  isUploading?: boolean;
}

const ResourceNavigation: React.FC<ResourceNavigationProps> = ({
  resources,
  selectedResource,
  onSelectResource,
  onAddResource,
  onUploadDocument,
  isUploading = false,
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

  const getCount = (type: ResourceType | 'All Resources') => {
    if (type === 'All Resources') return resources.length;
    return resources.filter((res) => res.type === type).length;
  };

  const handleAddResource = () => {
    if (newResourceTitle.trim() && (newResourceContent.trim() || newResourceType === 'Document')) {
      onAddResource(newResourceType, newResourceTitle.trim(), newResourceContent.trim());
      setNewResourceTitle('');
      setNewResourceContent('');
      setShowAddForm(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDocument(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Notebook LLM</h2>

      {/* Top Section - Category Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            filterType === 'All Resources'
              ? 'bg-blue-600 border-blue-400'
              : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
          }`}
          onClick={() => setFilterType('All Resources')}
        >
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">All Resources</span>
          <span className="text-xl font-bold">{getCount('All Resources')}</span>
        </button>
        {(['Document', 'Link', 'Note'] as ResourceType[]).map((type) => (
          <button
            key={type}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              filterType === type
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => setFilterType(type)}
          >
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{type}s</span>
            <span className="text-xl font-bold">{getCount(type)}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-700 mb-6"></div>

      {/* Bottom Section - Resource List */}
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">
        {filterType === 'All Resources' ? 'Recent Resources' : `${filterType} List`}
      </h3>
      <div className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-1">
          {filteredResources.map((resource) => (
            <li
              key={resource.id}
              className={`cursor-pointer py-2 px-3 rounded-lg transition-colors ${
                selectedResource?.id === resource.id
                  ? 'bg-gray-700 text-blue-400 font-medium'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
              onClick={() => onSelectResource(resource)}
            >
              {resource.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex flex-col gap-2">
           <label className={`bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl w-full font-medium transition-colors text-center cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
             {isUploading ? 'Uploading...' : 'Upload PDF/Doc'}
             <input 
               type="file" 
               className="hidden" 
               onChange={handleFileChange} 
               disabled={isUploading}
               accept=".pdf,.doc,.docx,.txt"
             />
           </label>
           
           <button
            className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl w-full font-medium transition-colors"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Note/Link'}
          </button>
        </div>

        {showAddForm && (
          <div className="mt-4 space-y-2 bg-gray-900 p-3 rounded-xl border border-gray-700">
            <input
              type="text"
              placeholder="Resource Title"
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              value={newResourceTitle}
              onChange={(e) => setNewResourceTitle(e.target.value)}
            />
            <select
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              value={newResourceType}
              onChange={(e) => setNewResourceType(e.target.value as ResourceType)}
            >
              <option value="Note">Note</option>
              <option value="Link">Link</option>
            </select>
            <textarea
              placeholder={newResourceType === 'Link' ? 'Enter URL' : 'Enter Note content'}
              rows={3}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              value={newResourceContent}
              onChange={(e) => setNewResourceContent(e.target.value)}
            ></textarea>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full font-bold"
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
