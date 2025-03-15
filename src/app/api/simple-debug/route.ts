import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  console.log("Simple debug endpoint called");
  
  try {
    // Get request information
    const requestInfo = {
      host: request.headers.get('host') || '',
      userAgent: request.headers.get('user-agent') || '',
      referer: request.headers.get('referer') || '',
      protocol: request.headers.get('x-forwarded-proto') || 'http',
      url: request.url,
    };
    
    // Check environment variables (without revealing secrets)
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL || null,
      NEXTAUTH_URL_EXISTS: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET_EXISTS: !!process.env.GOOGLE_CLIENT_SECRET,
    };
    
    // Return basic diagnostic information
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      message: "Simple debug endpoint is working correctly",
      requestInfo,
      envVars,
    });
  } catch (error) {
    console.error('Simple debug error:', error);
    
    return NextResponse.json({
      error: 'Error in simple debug endpoint',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 