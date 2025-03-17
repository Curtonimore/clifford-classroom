"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SimpleAuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
  };

  const handleSignIn = () => {
    try {
      addLog("Attempting to sign in with Google...");
      signIn("google", { callbackUrl: "/" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`ERROR: ${errorMessage}`);
      setError(errorMessage);
    }
  };

  const goToSignInPage = () => {
    window.location.href = "/api/auth/signin";
  };

  const goToGoogleSignIn = () => {
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Simple Auth Test</h1>
      
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
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Authentication Options</h2>
        <p>Choose one of the following methods to sign in:</p>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            onClick={handleSignIn}
            style={{
              backgroundColor: "#4285F4",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sign in with Google (Client-Side)
          </button>
          
          <button
            onClick={goToSignInPage}
            style={{
              backgroundColor: "#34A853",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Go to NextAuth Sign In Page
          </button>
          
          <button
            onClick={goToGoogleSignIn}
            style={{
              backgroundColor: "#FBBC05",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Go Directly to Google Sign In
          </button>
          
          <a
            href="/api/auth-simple"
            target="_blank"
            style={{
              backgroundColor: "#EA4335",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Check Auth Simple Endpoint
          </a>
        </div>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h3>Console Logs:</h3>
        <div style={{ 
          backgroundColor: "#263238", 
          color: "#ECEFF1", 
          padding: "10px", 
          borderRadius: "4px", 
          fontFamily: "monospace",
          fontSize: "14px",
          height: "200px",
          overflowY: "auto"
        }}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
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