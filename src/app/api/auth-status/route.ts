import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    // Test the NextAuth session endpoint
    const sessionResponse = await fetch(new URL('/api/auth/session', req.nextUrl.origin));
    const sessionStatus = sessionResponse.status;
    let sessionData = null;
    
    try {
      sessionData = await sessionResponse.json();
    } catch (e) {
      console.error('Error parsing session response:', e);
    }
    
    // Test the NextAuth CSRF endpoint
    const csrfResponse = await fetch(new URL('/api/auth/csrf', req.nextUrl.origin));
    const csrfStatus = csrfResponse.status;
    let csrfData = null;
    
    try {
      csrfData = await csrfResponse.json();
    } catch (e) {
      console.error('Error parsing CSRF response:', e);
    }
    
    // Test the NextAuth providers endpoint
    const providersResponse = await fetch(new URL('/api/auth/providers', req.nextUrl.origin));
    const providersStatus = providersResponse.status;
    let providersData = null;
    
    try {
      providersData = await providersResponse.json();
    } catch (e) {
      console.error('Error parsing providers response:', e);
    }
    
    // Return the results
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      nextauth_routes: {
        session: {
          status: sessionStatus,
          data: sessionData,
        },
        csrf: {
          status: csrfStatus,
          data: csrfData,
        },
        providers: {
          status: providersStatus,
          data: providersData,
        },
      },
      request: {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries([...req.headers.entries()]),
      },
    });
  } catch (error) {
    console.error('Error in auth-status route:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 