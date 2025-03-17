import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // Get the client ID from environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    
    if (!clientId) {
      console.warn('GOOGLE_CLIENT_ID environment variable is not set');
      return NextResponse.json(
        { error: 'Google Client ID is not configured' }, 
        { status: 500 }
      );
    }
    
    // Return the client ID
    return NextResponse.json({ clientId });
  } catch (error) {
    console.error('Error fetching client ID:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve client ID' }, 
      { status: 500 }
    );
  }
} 