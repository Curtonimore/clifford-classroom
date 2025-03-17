import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/direct-google-auth/callback`;

// Generate a random state for CSRF protection
const generateState = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Handle the callback from Google
    if (path.endsWith('/callback')) {
      return handleCallback(req);
    }
    
    // Initial authorization request
    const state = generateState();
    
    // Store state in a cookie for verification
    const response = NextResponse.redirect(getGoogleAuthURL(state));
    response.cookies.set('oauth_state', state, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });
    
    return response;
  } catch (error) {
    console.error('Error in direct-google-auth route:', error);
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

// Handle the callback from Google
async function handleCallback(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    // Check for error parameter
    if (error) {
      return NextResponse.json({ error, message: 'Google authentication error' }, { status: 400 });
    }
    
    // Verify state to prevent CSRF attacks
    const storedState = req.cookies.get('oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.json({ error: 'Invalid state', message: 'CSRF validation failed' }, { status: 400 });
    }
    
    // Exchange code for tokens
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID || '',
        client_secret: GOOGLE_CLIENT_SECRET || '',
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      return NextResponse.json({ 
        error: 'Token exchange failed', 
        status: tokenResponse.status,
        details: errorData
      }, { status: 400 });
    }
    
    const tokenData = await tokenResponse.json();
    
    // Get user info with the access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 400 });
    }
    
    const userData = await userInfoResponse.json();
    
    // Clear the state cookie
    const response = NextResponse.json({
      success: true,
      user: userData,
      tokens: {
        access_token: tokenData.access_token,
        id_token: tokenData.id_token,
        // Don't expose the refresh token in the response
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
      }
    });
    
    response.cookies.set('oauth_state', '', { 
      httpOnly: true, 
      maxAge: 0 
    });
    
    return response;
  } catch (error) {
    console.error('Error handling callback:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Generate the Google OAuth URL
function getGoogleAuthURL(state: string) {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID || '',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    state,
  };
  
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
} 