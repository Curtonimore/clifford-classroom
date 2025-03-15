"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DirectOAuthPage() {
  const { data: session, status } = useSession();
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthTest = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth-test');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setGoogleUrl(data.googleOAuthUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error fetching auth test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthTest();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Direct Google OAuth Test</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
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
            {loading ? (
              <p>Loading Google OAuth URL...</p>
            ) : googleUrl ? (
              <div>
                <p>We've constructed a direct Google OAuth URL that bypasses NextAuth's signIn function.</p>
                <a 
                  href={googleUrl}
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
                  Sign in with Google (Direct OAuth)
                </a>
              </div>
            ) : (
              <p>Failed to get Google OAuth URL</p>
            )}
          </div>
        )}
      </div>
      
      <div style={{ marginTop: "30px" }}>
        <h3>How This Works</h3>
        <p>
          This page bypasses NextAuth's signIn function and directly constructs a Google OAuth URL.
          It still uses the same client ID and redirect URI as NextAuth, but it doesn't rely on
          NextAuth's client-side JavaScript to initiate the authentication flow.
        </p>
        <p>
          If this works but the regular login doesn't, it suggests there's an issue with how
          NextAuth's client-side code is being executed or how it's handling the authentication flow.
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