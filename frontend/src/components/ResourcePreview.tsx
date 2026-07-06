import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DOMPurify from 'dompurify';
import { ResourceType } from '../types/dashboard';

interface ResourcePreviewProps {
  title: string;
  type: ResourceType;
  content: string;
  link: string;
  showLivePreviewLabel?: boolean;
}

export const ResourcePreview: React.FC<ResourcePreviewProps> = ({
  title,
  type,
  content,
  link,
  showLivePreviewLabel = false,
}) => {
  const sanitizedContent = DOMPurify.sanitize(content || '<em>No content entered yet</em>');

  return (
    <Box sx={{ mt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'background.paper' }} data-testid="resource-preview">
      {showLivePreviewLabel && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', letterSpacing: 1 }}>
            LIVE PREVIEW
          </Typography>
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: title ? 'text.primary' : 'text.secondary', fontStyle: title ? 'normal' : 'italic' }}>
        {title || 'Untitled'}
      </Typography>
      {type === 'Note' ? (
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            maxHeight: 150,
            overflowY: 'auto',
            fontSize: '0.875rem',
            wordBreak: 'break-word',
            '& *': { margin: 0 },
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      ) : (
        <Box sx={{ p: 1.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Button
            href={link || '#'}
            target="_blank"
            variant="outlined"
            size="small"
            fullWidth
            disabled={!link}
            sx={{ textTransform: 'none' }}
          >
            {link ? `Open Link: ${link}` : 'No URL entered yet'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
