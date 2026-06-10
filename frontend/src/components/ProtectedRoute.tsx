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
        .catch(err => {
          console.error('Error checking verification:', err);
          // If backend is down, we'll allow access for now or handle as unverified
          // Setting it to true for now to allow local UI debugging if backend is not started
          setIsVerified(true); 
        });
    }
  }, [session, router, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (session && isVerified === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying account status...</p>
          <p className="text-xs text-gray-400 mt-2">Connecting to backend at localhost:8000</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || (session && isVerified === false)) {
    return null;
  }

  return <>{children}</>;
};
