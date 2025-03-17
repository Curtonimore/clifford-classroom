import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth/next';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Create a handler function specifically for Google sign-in
async function handler(req: NextRequest) {
  console.log('Google sign-in handler called with method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries([...req.headers.entries()]));
  
  try {
    // Create a NextAuth handler
    const nextAuthHandler = NextAuth(authOptions);
    
    // Call the appropriate method based on the request method
    if (req.method === 'GET') {
      console.log('Calling GET handler for Google sign-in');
      
      // Create a modified URL that NextAuth will recognize
      // This is a workaround to make NextAuth think it's being called at /api/auth/signin/google
      const url = new URL(req.url);
      url.pathname = '/api/auth/signin/google';
      
      // Create a new request with the modified URL
      const modifiedReq = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: req.body
      });
      
      // @ts-ignore - NextAuth types are not fully compatible with Next.js App Router
      const response = await nextAuthHandler.GET(modifiedReq);
      console.log('GET handler response status for Google sign-in:', response.status);
      return response;
    } else if (req.method === 'POST') {
      console.log('Calling POST handler for Google sign-in');
      
      // Create a modified URL that NextAuth will recognize
      const url = new URL(req.url);
      url.pathname = '/api/auth/signin/google';
      
      // Create a new request with the modified URL
      const modifiedReq = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: req.body
      });
      
      // @ts-ignore - NextAuth types are not fully compatible with Next.js App Router
      const response = await nextAuthHandler.POST(modifiedReq);
      console.log('POST handler response status for Google sign-in:', response.status);
      return response;
    }
    
    // If the method is not GET or POST, return a 405 Method Not Allowed
    console.log('Method not allowed for Google sign-in:', req.method);
    return NextResponse.json(
      { error: 'Method Not Allowed', allowedMethods: ['GET', 'POST'] },
      { status: 405 }
    );
  } catch (error) {
    console.error('Error in Google sign-in handler:', error);
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