import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    console.log("Auth test endpoint called");
    
    // Get the NextAuth URL from the environment
    const nextAuthUrl = process.env.NEXTAUTH_URL || '';
    console.log("NEXTAUTH_URL:", nextAuthUrl);
    
    // Get the Google client ID
    const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    console.log("GOOGLE_CLIENT_ID exists:", !!googleClientId);
    
    // Construct the Google OAuth URL manually
    const redirectUri = `${nextAuthUrl}/api/auth/callback/google`;
    console.log("Redirect URI:", redirectUri);
    
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&prompt=consent`;
    
    console.log("Generated OAuth URL (partial):", googleOAuthUrl.substring(0, 100) + "...");
    
    // Return the diagnostic information
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      nextAuthUrl,
      googleClientIdExists: !!googleClientId,
      redirectUri,
      googleOAuthUrl,
      message: "Auth test completed successfully"
    });
  } catch (error) {
    console.error('Auth test error:', error);
    
    // Get detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Unknown Error';
    
    return NextResponse.json({
      error: 'Failed to run auth test',
      errorType: errorName,
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 