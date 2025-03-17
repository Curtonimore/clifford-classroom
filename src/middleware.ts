import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware for request processing
 * - Handles authentication checking
 * - Adds security headers
 * - Ensures proper redirects for auth-protected routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log the request path for debugging
  console.log('Middleware processing path:', pathname);
  
  // IMPORTANT: Skip middleware for NextAuth API routes
  // This is critical for NextAuth to work properly
  if (pathname.startsWith('/api/auth')) {
    console.log('Skipping middleware for NextAuth route:', pathname);
    return NextResponse.next();
  }
  
  // Skip middleware for static assets and other API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('/api/') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.png')
  ) {
    return NextResponse.next();
  }
  
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Handle auth-protected routes
  if (
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/subscription') ||
    pathname.startsWith('/settings')
  ) {
    // Check if the user is authenticated
    const token = await getToken({ req: request });
    
    // If no token exists, redirect to the login page
    if (!token) {
      const url = new URL('/auth-link', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    // For admin routes, check if the user has admin role
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 