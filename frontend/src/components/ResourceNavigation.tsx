import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import { Resource, ResourceType } from '../types/dashboard';
import { ResourceNavigationItem } from './ResourceNavigationItem';
import { UpsertResourceDrawer } from './UpsertResourceDrawer';

interface ResourceNavigationProps {
  resources: Resource[];
  selectedResource: Resource | null;
  onSelectResource: (resource: Resource) => void;
  onAddResource: (type: ResourceType, title: string, content: string, link?: string) => void;
  onEditResource: (id: string, type: ResourceType, title: string, content: string, link?: string) => void;
  onDeleteResource: (id: string) => void;
  onUploadDocument: (file: File) => void;
  isUploading?: boolean;
  noteId: string;
}

const ResourceNavigation: React.FC<ResourceNavigationProps> = ({
  resources,
  selectedResource,
  onSelectResource,
  onAddResource,
  onEditResource,
  onDeleteResource,
  onUploadDocument,
  isUploading = false,
  noteId,
}) => {
  const [filterType, setFilterType] = useState<ResourceType | 'All Resources'>('All Resources');
  const [upsertDrawer, setUpsertDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; initialData?: Resource }>({
    open: false,
    mode: 'create',
  });

  const filteredResources =
    filterType === 'All Resources'
      ? resources
      : resources.filter((res) => res.type === filterType);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDocument(e.target.files[0]);
    }
  };

  const categories: readonly (ResourceType | 'All Resources')[] = ['All Resources', 'Document', 'Link', 'Note'] as const;

  const getCount = (category: ResourceType | 'All Resources') => {
    if (category === 'All Resources') return resources.length;
    return resources.filter((res) => res.type === category).length;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 115px)', bgcolor: 'grey.900', color: 'white', p: 3 }}>
      <Typography variant="h5"  sx={{ mb: 3 }}>Notebook LLM</Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {categories.map((type) => (
          <Chip
            key={type}
            label={`${type === 'All Resources' ? type : `${type}s`} (${getCount(type)})`}
            onClick={() => setFilterType(type)}
            color={filterType === type ? 'primary' : 'default'}
            variant={filterType === type ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer', borderRadius: '16px', color: 'white', borderColor: 'grey.600' }}
          />
        ))}
      </Box>

      <Divider sx={{ borderColor: 'grey.700', mb: 3 }} />

      <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 2, textTransform: 'uppercase', px: 1, letterSpacing: 1 }}>
        {filterType === 'All Resources' ? 'Recent Resources' : `${filterType} List`}
      </Typography>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
        {filteredResources.map((resource) => (
          <ResourceNavigationItem
            key={resource.id}
            resource={resource}
            selected={selectedResource?.id === resource.id}
            onClick={() => onSelectResource(resource)}
            onEdit={() => setUpsertDrawer({ open: true, mode: 'edit', initialData: resource })}
            onDelete={() => onDeleteResource(resource.id)}
          />
        ))}
      </List>

      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'grey.700' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            component="label"
            variant="contained"
            disabled={isUploading}
            fullWidth
            sx={{ py: 1 }}
          >
            {isUploading ? 'Uploading...' : 'Upload PDF/Doc'}
            <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
          </Button>
          <Button variant="contained" color="success" fullWidth onClick={() => setUpsertDrawer({ open: true, mode: 'create', initialData: undefined })}>
            Add Note/Link
          </Button>
        </Box>
      </Box>
      
      <UpsertResourceDrawer 
        open={upsertDrawer.open} 
        onClose={() => setUpsertDrawer({ ...upsertDrawer, open: false })} 
        onUpsert={(data) => {
          if (upsertDrawer.mode === 'create') {
            onAddResource(data.type, data.title, data.content, data.link);
          } else {
            onEditResource(data.id, data.type, data.title, data.content, data.link);
          }
          setUpsertDrawer({ ...upsertDrawer, open: false });
        }}
        noteId={noteId}
        mode={upsertDrawer.mode}
        initialData={upsertDrawer.initialData ? {
            ...upsertDrawer.initialData,
            link: upsertDrawer.initialData.type === 'Link' ? upsertDrawer.initialData.content : '',
        } : undefined}
      />
    </Box>
  );
};

export default ResourceNavigation;
