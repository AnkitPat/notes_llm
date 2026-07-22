import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import NoteIcon from '@mui/icons-material/Note';
import { Resource, ResourceType } from '../types/dashboard';

interface Props {
  resource: Resource;
  selected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const getIcon = (type: ResourceType) => {
  switch (type) {
    case 'Document': return <DescriptionIcon />;
    case 'Link': return <LinkIcon />;
    case 'Note': return <NoteIcon />;
    default: return <NoteIcon />;
  }
};

export const ResourceNavigationItem: React.FC<Props> = ({ resource, selected, onClick, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
      <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'white' }}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); onEdit(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { handleClose(); onDelete(); }}>Delete</MenuItem>
      </Menu>
    </ListItemButton>
  );
};
