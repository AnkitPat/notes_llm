'use client';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  initialName: string;
}

export function EditNoteModal({ isOpen, onClose, onSave, initialName }: EditNoteModalProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave(name);
      onClose();
    } catch (err) {
      setError('Failed to update note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Note
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth
          label="Note Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
