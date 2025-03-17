import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Create a handler function for the signin path
export async function GET(req: NextRequest) {
  console.log('Sign-in handler called with method: GET');
  console.log('URL:', req.url);
  
  try {
    // Instead of trying to call NextAuth directly, redirect to the actual NextAuth endpoint
    const redirectUrl = new URL('/api/auth/signin', req.nextUrl.origin);
    
    // Copy any query parameters
    const url = new URL(req.url);
    url.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.append(key, value);
    });
    
    console.log('Redirecting to:', redirectUrl.toString());
    
    // Return a redirect response
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in sign-in handler:', error);
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

// POST method is not needed for sign-in page, but we'll include it for completeness
export async function POST(req: NextRequest) {
  console.log('Sign-in handler called with method: POST');
  console.log('URL:', req.url);
  
  try {
    // Redirect to the actual NextAuth endpoint
    const redirectUrl = new URL('/api/auth/signin', req.nextUrl.origin);
    
    console.log('Redirecting to:', redirectUrl.toString());
    
    // Return a redirect response
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in sign-in handler:', error);
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