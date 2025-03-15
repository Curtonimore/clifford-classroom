// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
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
    
    // Return the diagnostic information
    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      authConfig,
      issues,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL || null,
      message: "Auth configuration check completed"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff'
      },
    });
  } catch (error) {
    console.error('Auth config check error:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to check auth configuration',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
} 