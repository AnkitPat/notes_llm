import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't require approval
  const publicPaths = ['/login', '/auth-status', '/api/auth/google'];

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for authentication/approval via cookies or headers.
  // Since we are using localStorage in the client, server-side middleware 
  // might have trouble accessing it directly.
  // A robust approach would use HTTP-only cookies for session management.
  
  // For now, allow access and assume frontend handles client-side protection
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
