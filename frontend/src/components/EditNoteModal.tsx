'use client';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  initialName: string;
}

export function EditNoteModal({ isOpen, onClose, onSave, initialName }: EditNoteModalProps) {
  const [name, setName] = useState(initialName);

  return (
    <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Note
        </Typography>
        <TextField
          fullWidth
          label="Note Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}
