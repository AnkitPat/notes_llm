import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';

export default function Navbar() {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} href="/" sx={{ textDecoration: 'none', color: 'primary.main', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Notes LLM
          </MuiLink>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          <MuiLink component={Link} href="/" sx={{ color: 'text.primary', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 'medium' }}>
            Home
          </MuiLink>
          <MuiLink component={Link} href="/notes" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 'medium', '&:hover': { color: 'text.primary' } }}>
            Notes
          </MuiLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
