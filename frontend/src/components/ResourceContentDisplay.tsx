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
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {selectedResource.title}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              dangerouslySetInnerHTML={{ __html: selectedResource.content.replace(/\\n/g, '<br />') }}
            />
          </Box>
        );
      case 'Link':
        return (
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              {selectedResource.title}
            </Typography>
            <Link href={selectedResource.content} target="_blank" rel="noopener noreferrer">
              {selectedResource.content}
            </Link>
          </Box>
        );
      default:
        return <Typography>Unknown resource type.</Typography>;
    }
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'grey.50', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }}>
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
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>{renderContent()}</Box>
    </Paper>
  );
};

export default ResourceContentDisplay;
