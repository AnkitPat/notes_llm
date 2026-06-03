import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  // ADDED: '/api/auth/' to ignore all NextAuth internal API calls
  if (
    pathname === '/login' || 
    pathname.startsWith('/api/auth/') || 
    pathname === '/_next' || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Protect routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Logic for verification
  // Since middleware can't easily access the backend verification status without a call,
  // we are enforcing the rule:
  // - Authenticated and unverified: Redirect to /waiting-verification
  // - Authenticated and verified: Redirect to /dashboard
  // To keep it simple, we assume the session/token would have a verified flag
  // or handle the redirect in a ProtectedRoute component if necessary.
  // For middleware, we'll only enforce authentication for now.
  
  return NextResponse.next();
}
