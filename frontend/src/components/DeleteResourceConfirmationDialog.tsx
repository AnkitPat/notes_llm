import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface DeleteResourceConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resourceTitle: string;
}

export const DeleteResourceConfirmationDialog: React.FC<DeleteResourceConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  resourceTitle,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Resource</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the resource "{resourceTitle}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
