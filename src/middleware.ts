import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Simplified middleware for request processing
 * - Completely bypasses all auth-related routes
 * - Only handles authentication for specific protected routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log the request path for debugging
  console.log('Middleware processing path:', pathname);
  
  // CRITICAL: Skip middleware for ALL auth-related routes
  if (
    pathname.includes('/api/auth') || 
    pathname.includes('/auth-') ||
    pathname.includes('/api/direct-google-auth')
  ) {
    console.log('Skipping middleware for auth route:', pathname);
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
  
  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Only check auth for these specific protected routes
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
 * - Explicitly exclude all auth-related routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - api/direct-google-auth (Our direct OAuth implementation)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/direct-google-auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 