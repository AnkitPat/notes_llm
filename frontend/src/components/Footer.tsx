import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'white', borderTop: 1, borderColor: 'divider', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Notes LLM. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
