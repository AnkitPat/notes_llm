'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const LogoBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  color: 'white',
}));

export default function Header() {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'text.primary' }}>
          <LogoBox>N</LogoBox>
          <Typography variant="h6" fontWeight="bold">NotesApp</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => signOut({ callbackUrl: '/login' })}
          sx={{ bgcolor: 'grey.100', color: 'text.secondary', fontWeight: 'medium', '&:hover': { bgcolor: 'grey.200' } }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
