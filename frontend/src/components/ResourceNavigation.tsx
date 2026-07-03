'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { Resource, ResourceType } from '../types/dashboard';
import { ResourceNavigationItem } from './ResourceNavigationItem';
import { AddResourceDrawer } from './AddResourceDrawer';

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
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const filteredResources =
    filterType === 'All Resources'
      ? resources
      : resources.filter((res) => res.type === filterType);

  const getCount = (type: ResourceType | 'All Resources') => {
    if (type === 'All Resources') return resources.length;
    return resources.filter((res) => res.type === type).length;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDocument(e.target.files[0]);
    }
  };

  const categories = ['All Resources', 'Document', 'Link', 'Note'] as const;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'grey.900', color: 'white', p: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Notebook LLM</Typography>

      <Grid container spacing={1} sx={{ mb: 3 }}>
        {categories.map((type) => (
          <Grid key={type} size={6}>
            <Card
              sx={{
                bgcolor: filterType === type ? 'primary.main' : 'grey.800',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <CardActionArea onClick={() => setFilterType(type as any)}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="caption" sx={{ display: 'block', textTransform: 'uppercase', opacity: 0.8 }}>
                    {type === 'All Resources' ? type : `${type}s`}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">{getCount(type as any)}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ borderColor: 'grey.700', mb: 3 }} />

      <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 1, textTransform: 'uppercase', px: 1 }}>
        {filterType === 'All Resources' ? 'Recent Resources' : `${filterType} List`}
      </Typography>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
        {filteredResources.map((resource) => (
          <ResourceNavigationItem
            key={resource.id}
            resource={resource}
            selected={selectedResource?.id === resource.id}
            onClick={() => onSelectResource(resource)}
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
          <Button variant="contained" color="success" fullWidth onClick={() => setIsAddDrawerOpen(true)}>
            Add Note/Link
          </Button>
        </Box>
      </Box>
      
      <AddResourceDrawer 
        open={isAddDrawerOpen} 
        onClose={() => setIsAddDrawerOpen(false)} 
        onAdd={onAddResource} 
      />
    </Box>
  );
};

export default ResourceNavigation;
