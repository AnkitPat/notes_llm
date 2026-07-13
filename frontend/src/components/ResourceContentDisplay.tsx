import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { Resource } from '../types/dashboard';

interface ResourceContentDisplayProps {
  selectedResource: Resource | null;
  onRemoveResource: () => void;
}

const ResourceContentDisplay: React.FC<ResourceContentDisplayProps> = ({ selectedResource, onRemoveResource }) => {
  if (!selectedResource) {
    return null;
  }

  const renderContent = () => {
    switch (selectedResource.type) {
      case 'Document':
      case 'Note':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {selectedResource.title}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              style={{height: '100%', overflowY: 'auto'}}
              dangerouslySetInnerHTML={{ __html: selectedResource.content.replace(/\\n/g, '<br />') }}
            />
          </Box>
        );
      case 'Link':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {selectedResource.title}
            </Typography>
            <iframe
              src={selectedResource.content}
              title={selectedResource.title}
              width="100%"
              style={{ border: 'none', flexGrow: 1, height: '100%' }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </Box>
        );
      default:
        return <Typography>Unknown resource type.</Typography>;
    }
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, bgcolor: 'grey.50', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">Viewer</Typography>
        <Button
          onClick={onRemoveResource}
          variant="outlined"
          color="error"
          size="small"
        >
          Remove Resource
        </Button>
      </Box>
      <Box sx={{  overflowY: 'auto', p: 3, height: '100%' }}>{renderContent()}</Box>
    </Paper>
  );
};

export default ResourceContentDisplay;
