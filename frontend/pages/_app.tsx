import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isAuthenticated, isUserApproved } from '../utils/auth';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const publicPaths = ['/login', '/auth-status']; // Paths accessible without full approval

    if (!publicPaths.includes(router.pathname)) {
      if (!isAuthenticated()) {
        router.push('/login');
      } else if (!isUserApproved()) {
        router.push('/auth-status');
      }
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;
