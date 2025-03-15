import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    console.log("Environment check endpoint called");
    
    // Check for environment variables
    const envVars = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set (value hidden)" : null,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set (value hidden)" : null,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set (value hidden)" : null,
      NODE_ENV: process.env.NODE_ENV || null,
      VERCEL_URL: process.env.VERCEL_URL || null,
      VERCEL_ENV: process.env.VERCEL_ENV || null,
    };
    
    // Get request information
    const requestInfo = {
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    };
    
    // Return the diagnostic information
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envVars,
      request: requestInfo,
      message: "Environment check completed successfully"
    });
  } catch (error) {
    console.error('Environment check error:', error);
    
    return NextResponse.json({
      error: 'Failed to check environment',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 