import { NextResponse } from 'next/server';

// This endpoint will help us diagnose what's wrong with NextAuth
export async function GET() {
  try {
    // Check environment variables (without revealing actual values)
    const checks = {
      nextauth: {
        secret: !!process.env.NEXTAUTH_SECRET,
        url: !!process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : null,
      },
      google: {
        clientId: !!process.env.GOOGLE_CLIENT_ID,
        clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      },
      // Get the actual request URL and host
      request: {
        host: process.env.VERCEL_URL || 'localhost',
        nextAuthUrl: process.env.NEXTAUTH_URL,
      },
      // Check for any API_ROUTE environment variable
      vercelUrl: process.env.VERCEL_URL,
      // Check current Node environment
      nodeEnv: process.env.NODE_ENV,
    };

    // Check if all required environment variables are present
    const allPresent = 
      checks.nextauth.secret && 
      checks.nextauth.url && 
      checks.google.clientId && 
      checks.google.clientSecret;

    return NextResponse.json({
      status: 'success',
      allRequiredVarsPresent: allPresent,
      checks,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 