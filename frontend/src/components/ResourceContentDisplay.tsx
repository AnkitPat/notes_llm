import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Resource } from '../types/dashboard';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { API_BASE_URL } from '@/lib/config';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ResourceContentDisplayProps {
  selectedResource: Resource | null;
  onRemoveResource: () => void;
}

const ResourceContentDisplay: React.FC<ResourceContentDisplayProps> = ({ selectedResource, onRemoveResource }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(selectedResource, 'sel res')
    if (selectedResource?.type === 'Document') {
      setLoading(true);
      fetch(`${API_BASE_URL}/resources/${selectedResource.id}/signed-url`)
        .then(res => res.json())
        .then(data => {
          setSignedUrl(data.url);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch signed URL", err);
          setLoading(false);
        });
    } else {
      setSignedUrl(null);
    }
  }, [selectedResource]);

  if (!selectedResource) {
    return null;
  }

  const renderContent = () => {
    switch (selectedResource.type) {
      // case 'Document':
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
      case 'Document':
        if (loading) return <CircularProgress />;
        if (!signedUrl) return <Typography>Error loading PDF.</Typography>;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {selectedResource.title}
            </Typography>
            <Document file={signedUrl}>
              <Page pageNumber={1} width={600} />
            </Document>
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
