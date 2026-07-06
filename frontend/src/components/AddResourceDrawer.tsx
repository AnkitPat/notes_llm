import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { ResourceType } from '../types/dashboard';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (type: ResourceType, title: string, content: string, link?: string) => void;
  noteId: string;
}

export const AddResourceDrawer: React.FC<Props> = ({ open, onClose, onAdd, noteId }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('Note');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdResource, setCreatedResource] = useState<any>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          noteId, 
          type, 
          name: title, 
          content: type === 'Note' ? content : undefined,
          link: type === 'Link' ? link : undefined 
        }),
      });

      if (!response.ok) throw new Error('Failed to create resource');
      const data = await response.json();
      setCreatedResource({ id: data.id, title, type, content, link });
      onAdd(type, title, content, link);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCreatedResource(null);
    setTitle('');
    setType('Note');
    setContent('');
    setLink('');
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 400, p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : createdResource ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Preview</Typography>
            {createdResource.type === 'Note' ? (
              <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }} dangerouslySetInnerHTML={{ __html: createdResource.content }} />
            ) : (
              <Button href={createdResource.link} target="_blank" variant="outlined" fullWidth>Open Link</Button>
            )}
            <Button onClick={handleClose} sx={{ mt: 2 }} fullWidth>Close</Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Resource</Typography>
            <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
            <TextField select fullWidth label="Type" value={type} onChange={e => setType(e.target.value as ResourceType)} sx={{ mb: 2 }}>
              <MenuItem value="Note">Note</MenuItem>
              <MenuItem value="Link">Link</MenuItem>
            </TextField>
            {type === 'Note' ? (
              <TextField fullWidth multiline rows={4} label="Content (HTML)" value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 2 }} />
            ) : (
              <TextField fullWidth label="URL" value={link} onChange={e => setLink(e.target.value)} sx={{ mb: 2 }} />
            )}
            <Button variant="contained" fullWidth onClick={handleSubmit}>Create</Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
