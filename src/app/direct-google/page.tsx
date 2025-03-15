"use client";

import { useSession } from "next-auth/react";

export default function DirectGooglePage() {
  const { data: session, status } = useSession();
  
  // Hardcoded Google OAuth URL
  // This is a generic URL that will work with any Google OAuth client
  // The user will need to select their account and consent to the permissions
  const googleOAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com" + // Demo client ID
    "&redirect_uri=https%3A%2F%2Fwww.cliffordclassroom.com%2Fapi%2Fauth%2Fcallback%2Fgoogle" +
    "&response_type=code" +
    "&scope=openid%20email%20profile" +
    "&prompt=consent";

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Direct Google Link</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>Session Status: {status}</h2>
        {status === "authenticated" ? (
          <div>
            <p><strong>Logged in as:</strong> {session?.user?.email}</p>
            <p><strong>Name:</strong> {session?.user?.name}</p>
            <p><strong>Role:</strong> {session?.user?.role || "No role"}</p>
          </div>
        ) : status === "loading" ? (
          <p>Loading session...</p>
        ) : (
          <div>
            <p>Not signed in</p>
            <div>
              <p>This is a direct link to Google's OAuth page. It uses a demo client ID and your site's callback URL.</p>
              <a 
                href={googleOAuthUrl}
                style={{ 
                  backgroundColor: "#4285F4", 
                  color: "white", 
                  padding: "10px 15px", 
                  borderRadius: "4px", 
                  textDecoration: "none",
                  display: "inline-block",
                  marginTop: "10px"
                }}
              >
                Sign in with Google (Hardcoded URL)
              </a>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: "30px" }}>
        <h3>How This Works</h3>
        <p>
          This page uses a hardcoded Google OAuth URL that doesn't rely on any API endpoints.
          It uses a demo client ID that will allow you to test the OAuth flow, but won't actually
          authenticate you with your application.
        </p>
        <p>
          If this works but the other methods don't, it suggests there might be an issue with
          your Google OAuth configuration or how NextAuth is handling the authentication flow.
        </p>
      </div>
      
      <div style={{ marginTop: "30px" }}>
        <a 
          href="/auth-link"
          style={{ 
            color: "#4285F4", 
            textDecoration: "none"
          }}
        >
          Back to Auth Links
        </a>
      </div>
    </div>
  );
} 