import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import { ResourceType } from '../types/dashboard';
import { ResourcePreview } from './ResourcePreview';
import { API_BASE_URL } from '../lib/config';
import { uploadDocument } from '../lib/api';

interface ResourceData {
  id: string;
  title: string;
  type: ResourceType;
  content: string;
  link?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onUpsert: (data: ResourceData) => void;
  noteId: string;
  mode: 'create' | 'edit';
  initialData?: ResourceData;
}

export const UpsertResourceDrawer: React.FC<Props> = ({ open, onClose, onUpsert, noteId, mode, initialData }) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState<ResourceType>(initialData?.type || 'Note');
  const [content, setContent] = useState(initialData?.content || '');
  const [link, setLink] = useState(initialData?.link || '');
  const [loading, setLoading] = useState(false);
  const [processedResource, setProcessedResource] = useState<ResourceData | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFileLink, setUploadedFileLink] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setContent(initialData.content);
      setLink(initialData.link || '');
    }
  }, [mode, initialData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.email) return;

    setUploadStatus('uploading');
    try {
      const result = await uploadDocument(file, session.user.email);
      setUploadedFileLink(result.webViewLink);
      setUploadedFileName(file.name);
      setUploadStatus('success');
    } catch (err) {
      setUploadStatus('error');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = mode === 'create' 
        ? `${API_BASE_URL}/resources` 
        : `${API_BASE_URL}/resources/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          noteId, 
          type, 
          name: title, 
          content: type === 'Note' ? content : (type === 'Document' ? uploadedFileLink : undefined),
          link: type === 'Link' ? link : undefined 
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${mode} resource`);
      const data = await response.json();
      const resultData = { id: data.id || initialData?.id, title, type, content: type === 'Document' ? (uploadedFileLink || '') : content, link };
      setProcessedResource(resultData);
      onUpsert(resultData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProcessedResource(null);
    setUploadStatus('idle');
    setUploadedFileLink(null);
    setUploadedFileName(null);
    if (mode === 'create') {
      setTitle('');
      setType('Note');
      setContent('');
      setLink('');
    }
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 400, p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : processedResource ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>{mode === 'create' ? 'Created' : 'Updated'} Resource</Typography>
            <ResourcePreview title={processedResource.title} type={processedResource.type} content={processedResource.content} link={processedResource.link || ''} />
            <Button onClick={handleClose} sx={{ mt: 2 }} fullWidth>Close</Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>{mode === 'create' ? 'Add New' : 'Edit'} Resource</Typography>
            <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
            <TextField 
              select 
              fullWidth 
              label="Type" 
              value={type} 
              onChange={e => { setType(e.target.value as ResourceType); setUploadStatus('idle'); setUploadedFileLink(null); setUploadedFileName(null); }} 
              disabled={mode === 'edit'}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Note">Note</MenuItem>
              <MenuItem value="Link">Link</MenuItem>
              <MenuItem value="Document">Document</MenuItem>
            </TextField>
            {type === 'Note' ? (
              <TextField fullWidth multiline rows={4} label="Content (HTML)" value={content} onChange={e => setContent(e.target.value)} sx={{ mb: 2 }} />
            ) : type === 'Link' ? (
              <TextField fullWidth label="URL" value={link} onChange={e => setLink(e.target.value)} sx={{ mb: 2 }} />
            ) : type === 'Document' ? (
              <Box sx={{ mb: 2 }}>
                {mode === 'edit' ? (
                  <Typography>File: {initialData?.content}</Typography>
                ) : uploadStatus === 'idle' || uploadStatus === 'error' ? (
                  <Button component="label" variant="outlined" fullWidth>
                    {uploadStatus === 'error' ? 'Retry Upload' : 'Select & Upload PDF/Doc'}
                    <input type="file" hidden onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" />
                  </Button>
                ) : uploadStatus === 'uploading' ? (
                  <CircularProgress size={24} />
                ) : (
                  <Typography color="success.main">Uploaded: {uploadedFileName}</Typography>
                )}
              </Box>
            ) : null}
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSubmit}
              disabled={
                (type === 'Document' && mode === 'create' && uploadStatus !== 'success') || 
                (type === 'Note' && !content) || 
                (type === 'Link' && !link)
              }
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
