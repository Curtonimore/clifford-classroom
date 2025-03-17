import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Auth simple endpoint working",
    timestamp: new Date().toISOString(),
    nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
    googleClientIdExists: !!process.env.GOOGLE_CLIENT_ID,
    nextAuthSecretExists: !!process.env.NEXTAUTH_SECRET
  });
} 