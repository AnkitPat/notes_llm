import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import NoteIcon from '@mui/icons-material/Note';
import { Resource, ResourceType } from '../types/dashboard';

interface Props {
  resource: Resource;
  selected: boolean;
  onClick: () => void;
}

const getIcon = (type: ResourceType) => {
  switch (type) {
    case 'Document': return <DescriptionIcon />;
    case 'Link': return <LinkIcon />;
    case 'Note': return <NoteIcon />;
    default: return <NoteIcon />;
  }
};

export const ResourceNavigationItem: React.FC<Props> = ({ resource, selected, onClick }) => (
  <ListItemButton
    selected={selected}
    onClick={onClick}
    sx={{
      borderRadius: 1,
      mb: 0.5,
      borderLeft: selected ? '4px solid #bb86fc' : 'none',
      '&.Mui-selected': { bgcolor: 'grey.700', color: 'primary.light' }
    }}
  >
    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{getIcon(resource.type)}</ListItemIcon>
    <ListItemText primary={resource.title} />
  </ListItemButton>
);
