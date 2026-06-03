'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
        .catch(err => console.error('Error checking verification:', err));
    }
  }, [session, router, status]);

  if (status === 'loading' || (session && isVerified === null)) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && isVerified === false)) {
    return null;
  }

  return <>{children}</>;
};
