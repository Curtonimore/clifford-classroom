import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    // Get the request URL and headers
    const url = new URL(req.url);
    const headers = Object.fromEntries([...req.headers.entries()]);
    
    // Get environment variables (sanitized)
    const env = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[REDACTED]' : null,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '[REDACTED]' : null,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '[REDACTED]' : null,
      NODE_ENV: process.env.NODE_ENV || null,
    };
    
    // Get the auth configuration (sanitized)
    const authConfig = {
      providers: authOptions.providers.map(provider => ({
        id: provider.id,
        name: provider.name,
        type: provider.type,
      })),
      debug: authOptions.debug,
      pages: authOptions.pages,
      session: authOptions.session,
      // Don't include callbacks or secret
    };
    
    // Calculate redirect URIs
    const redirectUris = {
      baseUrl: process.env.NEXTAUTH_URL,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      signInUrl: `${process.env.NEXTAUTH_URL}/api/auth/signin/google`,
      host: url.host,
      origin: url.origin,
      hostname: url.hostname,
    };
    
    // Return the configuration
    return NextResponse.json({
      env,
      authConfig,
      redirectUris,
      request: {
        url: url.toString(),
        path: url.pathname,
        host: url.host,
        origin: url.origin,
        headers: {
          host: headers.host,
          'user-agent': headers['user-agent'],
          referer: headers.referer,
          'x-forwarded-host': headers['x-forwarded-host'],
          'x-forwarded-proto': headers['x-forwarded-proto'],
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in auth-config-check route:', error);
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