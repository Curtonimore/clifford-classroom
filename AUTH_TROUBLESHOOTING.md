# Authentication Troubleshooting Guide

This document provides guidance for troubleshooting authentication issues in Clifford Classroom.

## Common Authentication Errors

### "This action with HTTP GET is not supported by NextAuth.js"

If you see this error, it means you're trying to access a NextAuth.js endpoint with a GET method that only supports POST, or you're accessing a path that NextAuth is trying to handle but shouldn't.

**Solution:**
- **IMPORTANT**: Do NOT use paths that start with `/api/auth/` for custom endpoints - NextAuth tries to handle these
- Use these alternative debug endpoints instead:
  - `/api/auth-debug` - Primary debug endpoint (outside NextAuth's path)
  - `/api/debug-auth` - Alternative debug endpoint
- If you need to access NextAuth functionality, use the proper paths like `/api/auth/signin` or `/api/auth/callback/google`

### 405 Method Not Allowed

If you see a 405 error on `/api/auth/signin/google`, this means the server is rejecting the HTTP method being used. This typically happens when:

1. The NextAuth API routes are not properly configured
2. There's a middleware or server configuration blocking these requests

**Solution:**
- Ensure your NextAuth API routes are properly set up in `/app/api/auth/[...nextauth]/route.ts`
- Check for any middleware that might be intercepting these requests
- Verify your server configuration allows POST requests to these endpoints

### 500 Server Error

If you see a 500 error on `/api/auth/session`, this indicates a server-side error in the authentication process. Common causes include:

1. Missing or incorrect environment variables
2. Database connection issues
3. Misconfigured NextAuth options

**Solution:**
- Check your environment variables (NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- Verify your MongoDB connection is working
- Look at server logs for more detailed error information

### JSON Parsing Error

If you see `Uncaught (in promise) SyntaxError: Unexpected end of JSON input`, this suggests:

1. The server is returning an empty or malformed JSON response
2. A network error is interrupting the response

**Solution:**
- Check network requests in your browser's developer tools
- Verify the server is returning proper JSON responses
- Look for any server-side errors that might be causing incomplete responses

## Environment Variables Checklist

Ensure these environment variables are correctly set in your production environment:

```
# Authentication
NEXTAUTH_URL=https://cliffordclassroom.com
NEXTAUTH_SECRET=<your-secret-here>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
ADMIN_EMAILS=<comma-separated-admin-emails>

# Database
MONGODB_URI=<your-mongodb-connection-string>
```

## Google OAuth Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Ensure these authorized redirect URIs are added:
   - `https://cliffordclassroom.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local development)
6. Ensure these authorized JavaScript origins are added:
   - `https://cliffordclassroom.com`
   - `http://localhost:3000` (for local development)

## Diagnostic Tools

Use these endpoints to diagnose authentication issues:

- `/api/auth-debug` - Primary debug endpoint (outside NextAuth's path)
- `/api/debug-auth` - Alternative debug endpoint
- `/auth-test` - Interactive page for testing login functionality
- `/debug-login` - Interactive page for testing login functionality with detailed logs

## Deployment Checklist

When deploying to production:

1. Update NEXTAUTH_URL to match your production domain
2. Generate a strong NEXTAUTH_SECRET
3. Verify Google OAuth redirect URIs include your production domain
4. Check that your MongoDB connection string is correct
5. Ensure your server allows the necessary HTTP methods for NextAuth routes 