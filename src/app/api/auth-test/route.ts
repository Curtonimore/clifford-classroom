import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Get the NextAuth URL from the environment
    const nextAuthUrl = process.env.NEXTAUTH_URL || '';
    
    // Get the Google client ID
    const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    
    // Construct the Google OAuth URL manually
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(`${nextAuthUrl}/api/auth/callback/google`)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&prompt=consent`;
    
    // Return the diagnostic information
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authenticated: !!session,
      user: session?.user ? {
        email: session.user.email,
        role: session.user.role,
      } : null,
      nextAuthUrl,
      googleOAuthUrl,
      message: "Auth test completed successfully"
    });
  } catch (error) {
    console.error('Auth test error:', error);
    
    return NextResponse.json({
      error: 'Failed to run auth test',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 