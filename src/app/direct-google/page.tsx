"use client";

import { useState, useEffect } from "react";

export default function DirectGooglePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle the callback from our direct Google OAuth endpoint
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we're on the callback URL (redirected from Google)
        const url = new URL(window.location.href);
        const callbackCode = url.searchParams.get("code");
        
        if (callbackCode) {
          setLoading(true);
          setError(null);
          
          // We're in a callback, show the code
          setResult({
            message: "Received callback from Google OAuth",
            code: callbackCode,
            state: url.searchParams.get("state"),
            timestamp: new Date().toISOString()
          });
          
          // Clear the URL parameters to avoid issues on refresh
          window.history.replaceState({}, document.title, "/direct-google");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error handling callback:", err);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, []);

  // Start the OAuth flow
  const startOAuth = () => {
    window.location.href = "/api/direct-google-auth";
  };

  // Check the environment variables
  const checkEnv = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/env-check");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Error checking environment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Direct Google OAuth Test</h1>
      
      <div style={{ 
        backgroundColor: "#e3f2fd", 
        color: "#0d47a1", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        marginTop: "20px",
        border: "1px solid #90caf9"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>ℹ️ About This Page</h3>
        <p style={{ margin: "0 0 10px 0" }}>
          This page tests a direct implementation of Google OAuth that bypasses NextAuth.js.
          It helps diagnose if the issue is with NextAuth configuration or with the Google OAuth credentials themselves.
        </p>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          padding: "15px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: "30px" }}>
        <h2>OAuth Actions</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button 
            onClick={startOAuth}
            disabled={loading}
            style={{ 
              backgroundColor: "#4285F4", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Loading..." : "Start Google OAuth Flow"}
          </button>
          
          <button 
            onClick={checkEnv}
            disabled={loading}
            style={{ 
              backgroundColor: "#34A853", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Check Environment Variables
          </button>
        </div>
      </div>
      
      {result && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Result</h2>
          <div style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "4px", 
            overflow: "auto"
          }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Troubleshooting</h2>
        <ul>
          <li>
            <strong>Redirect URI:</strong> Make sure <code>{process.env.NEXTAUTH_URL}/api/direct-google-auth/callback</code> is 
            added to the authorized redirect URIs in your Google Cloud Console.
          </li>
          <li>
            <strong>Environment Variables:</strong> Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_URL are correctly set.
          </li>
          <li>
            <strong>Cookies:</strong> This implementation uses cookies to store the state parameter. Make sure cookies are enabled in your browser.
          </li>
        </ul>
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