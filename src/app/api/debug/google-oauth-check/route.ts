import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getAuthSession();
    
    // Check environment variables (without revealing secrets)
    const googleConfig = {
      clientId: {
        exists: !!process.env.GOOGLE_CLIENT_ID,
        format: process.env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com') || false,
        length: process.env.GOOGLE_CLIENT_ID?.length || 0,
        firstChars: process.env.GOOGLE_CLIENT_ID?.substring(0, 5) || '',
        lastChars: process.env.GOOGLE_CLIENT_ID?.slice(-10) || '',
      },
      clientSecret: {
        exists: !!process.env.GOOGLE_CLIENT_SECRET,
        length: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
        firstChars: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 3) || '',
      },
    };
    
    // Check NextAuth configuration
    const nextAuthConfig = {
      url: {
        exists: !!process.env.NEXTAUTH_URL,
        value: process.env.NEXTAUTH_URL || '',
        isHttps: process.env.NEXTAUTH_URL?.startsWith('https://') || false,
        domain: new URL(process.env.NEXTAUTH_URL || 'https://example.com').hostname,
      },
      secret: {
        exists: !!process.env.NEXTAUTH_SECRET,
        length: process.env.NEXTAUTH_SECRET?.length || 0,
        isPlaceholder: process.env.NEXTAUTH_SECRET === 'build-placeholder-secret-safe-for-commit',
      },
    };
    
    // Get request information
    const requestInfo = {
      host: request.headers.get('host') || '',
      userAgent: request.headers.get('user-agent') || '',
      referer: request.headers.get('referer') || '',
      protocol: request.headers.get('x-forwarded-proto') || 'http',
    };
    
    // Check for common issues
    const issues: string[] = [];
    
    if (!googleConfig.clientId.exists || !googleConfig.clientSecret.exists) {
      issues.push('Google OAuth credentials are missing');
    }
    
    if (googleConfig.clientId.exists && !googleConfig.clientId.format) {
      issues.push('Google Client ID format appears incorrect (should end with .apps.googleusercontent.com)');
    }
    
    if (!nextAuthConfig.url.exists) {
      issues.push('NEXTAUTH_URL is missing');
    } else if (!nextAuthConfig.url.isHttps) {
      issues.push('NEXTAUTH_URL should use HTTPS in production');
    }
    
    if (!nextAuthConfig.secret.exists) {
      issues.push('NEXTAUTH_SECRET is missing');
    } else if (nextAuthConfig.secret.isPlaceholder) {
      issues.push('NEXTAUTH_SECRET is using the placeholder value from .env.production');
    }
    
    // Check if the domain in NEXTAUTH_URL matches the request host
    if (nextAuthConfig.url.exists && requestInfo.host && 
        !requestInfo.host.includes(nextAuthConfig.url.domain) && 
        !nextAuthConfig.url.domain.includes(requestInfo.host)) {
      issues.push(`Domain mismatch: NEXTAUTH_URL domain (${nextAuthConfig.url.domain}) doesn't match request host (${requestInfo.host})`);
    }
    
    // Return the diagnostic information
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authenticated: !!session,
      user: session?.user ? {
        email: session.user.email,
        role: session.user.role,
      } : null,
      googleConfig,
      nextAuthConfig,
      requestInfo,
      issues,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL || null,
    });
  } catch (error) {
    console.error('Google OAuth check error:', error);
    return NextResponse.json({
      error: 'Failed to check Google OAuth configuration',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 