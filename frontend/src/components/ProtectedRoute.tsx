'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:8000/check-status/${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setIsVerified(data.verified);
          if (!data.verified) {
            router.push('/waiting-verification');
          }
        })
        .catch(err => {
          console.error('Error checking verification:', err);
          setIsVerified(true); 
        });
    }
  }, [session, router, status]);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'grey.100' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography color="text.secondary" fontWeight="medium">Loading session...</Typography>
      </Box>
    );
  }

  if (session && isVerified === null) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'grey.100' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography color="text.secondary" fontWeight="medium">Verifying account status...</Typography>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>Connecting to backend at localhost:8000</Typography>
      </Box>
    );
  }

  if (status === 'unauthenticated' || (session && isVerified === false)) {
    return null;
  }

  return <>{children}</>;
};
