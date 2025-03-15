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
    
    // Check environment variables (without revealing secrets)
    const authConfig = {
      nextauth: {
        url: {
          exists: !!process.env.NEXTAUTH_URL,
          value: process.env.NEXTAUTH_URL || '',
          isHttps: process.env.NEXTAUTH_URL?.startsWith('https://') || false,
        },
        secret: {
          exists: !!process.env.NEXTAUTH_SECRET,
          length: process.env.NEXTAUTH_SECRET?.length || 0,
        },
      },
      google: {
        clientId: {
          exists: !!process.env.GOOGLE_CLIENT_ID,
          format: process.env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com') || false,
          length: process.env.GOOGLE_CLIENT_ID?.length || 0,
        },
        clientSecret: {
          exists: !!process.env.GOOGLE_CLIENT_SECRET,
          length: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
        },
      },
      admin: {
        emails: (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()),
      },
    };
    
    // Get request information
    const requestInfo = {
      host: request.headers.get('host') || '',
      userAgent: request.headers.get('user-agent') || '',
      referer: request.headers.get('referer') || '',
      protocol: request.headers.get('x-forwarded-proto') || 'http',
      url: request.url,
      nextauth_url: process.env.NEXTAUTH_URL,
    };
    
    // Check for common issues
    const issues: string[] = [];
    
    if (!authConfig.nextauth.url.exists) {
      issues.push('NEXTAUTH_URL is missing');
    } else if (process.env.NODE_ENV === 'production' && !authConfig.nextauth.url.isHttps) {
      issues.push('NEXTAUTH_URL should use HTTPS in production');
    }
    
    if (!authConfig.nextauth.secret.exists) {
      issues.push('NEXTAUTH_SECRET is missing');
    }
    
    if (!authConfig.google.clientId.exists || !authConfig.google.clientSecret.exists) {
      issues.push('Google OAuth credentials are missing');
    }
    
    if (authConfig.google.clientId.exists && !authConfig.google.clientId.format) {
      issues.push('Google Client ID format appears incorrect (should end with .apps.googleusercontent.com)');
    }
    
    // Check if the domain in NEXTAUTH_URL matches the request host
    const nextAuthUrlDomain = process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : '';
    if (nextAuthUrlDomain && requestInfo.host && 
        !requestInfo.host.includes(nextAuthUrlDomain) && 
        !nextAuthUrlDomain.includes(requestInfo.host)) {
      issues.push(`Domain mismatch: NEXTAUTH_URL domain (${nextAuthUrlDomain}) doesn't match request host (${requestInfo.host})`);
    }
    
    // Return the diagnostic information
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authenticated: !!session,
      user: session?.user ? {
        email: session.user.email,
        role: session.user.role,
      } : null,
      authConfig,
      requestInfo,
      issues,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL || null,
      message: "This debug endpoint is working correctly. If you're seeing this, your server can handle API requests properly."
    });
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json({
      error: 'Failed to debug authentication',
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
    }, { status: 500 });
  }
} 