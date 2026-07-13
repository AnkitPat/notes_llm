'use client';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface DeleteNoteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  noteName: string;
}

export function DeleteNoteConfirmationDialog({ isOpen, onClose, onConfirm, noteName }: DeleteNoteConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Delete Note
        </Typography>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete the note "{noteName}"? This action cannot be undone.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
