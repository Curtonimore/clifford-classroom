import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Create a NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST methods
export { handler as GET, handler as POST }; 