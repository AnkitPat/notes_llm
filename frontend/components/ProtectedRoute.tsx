'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isUserApproved } from '../utils/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else if (!isUserApproved()) {
      router.push('/auth-status');
    }
  }, [router]);

  if (!isAuthenticated() || !isUserApproved()) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
