import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { ResourceType } from '../types/dashboard';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (type: ResourceType, title: string, content: string) => void;
}

export const AddResourceDrawer: React.FC<Props> = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<ResourceType>('Note');
  const [content, setContent] = React.useState('');

  const handleSubmit = () => {
    onAdd(type, title, content);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Resource</Typography>
        <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
        <TextField select fullWidth label="Type" value={type} onChange={e => setType(e.target.value as ResourceType)} sx={{ mb: 2 }}>
            <MenuItem value="Note">Note</MenuItem>
            <MenuItem value="Link">Link</MenuItem>
            <MenuItem value="Document">Document</MenuItem>
        </TextField>
        <TextField fullWidth multiline rows={4} label="Content" value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" fullWidth onClick={handleSubmit}>Create</Button>
      </Box>
    </Drawer>
  );
};
