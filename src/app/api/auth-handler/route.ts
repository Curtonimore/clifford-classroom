import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth/next';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Create a handler function that logs information about the request
async function handler(req: NextRequest) {
  console.log('Auth handler called with method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries([...req.headers.entries()]));
  
  try {
    // Check if this is a direct request to the handler or a sub-path
    const url = new URL(req.url);
    const path = url.pathname;
    
    // If this is just the base path, return a JSON response with info
    if (path === '/api/auth-handler') {
      return NextResponse.json({
        message: 'Auth handler is working',
        method: req.method,
        timestamp: new Date().toISOString(),
        path: path,
        query: Object.fromEntries(url.searchParams.entries()),
        headers: Object.fromEntries([...req.headers.entries()]),
      });
    }
    
    // For any sub-paths like /api/auth-handler/signin/google, use NextAuth
    console.log('Handling sub-path:', path);
    
    // Create a NextAuth handler
    const nextAuthHandler = NextAuth(authOptions);
    
    // Call the appropriate method based on the request method
    if (req.method === 'GET') {
      console.log('Calling GET handler for path:', path);
      // @ts-ignore - NextAuth types are not fully compatible with Next.js App Router
      const response = await nextAuthHandler.GET(req);
      console.log('GET handler response status:', response.status);
      return response;
    } else if (req.method === 'POST') {
      console.log('Calling POST handler for path:', path);
      // @ts-ignore - NextAuth types are not fully compatible with Next.js App Router
      const response = await nextAuthHandler.POST(req);
      console.log('POST handler response status:', response.status);
      return response;
    }
    
    // If the method is not GET or POST, return a 405 Method Not Allowed
    console.log('Method not allowed:', req.method);
    return NextResponse.json(
      { error: 'Method Not Allowed', allowedMethods: ['GET', 'POST'] },
      { status: 405 }
    );
  } catch (error) {
    console.error('Error in auth handler:', error);
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

// Export the handler for GET and POST methods
export const GET = handler;
export const POST = handler; 