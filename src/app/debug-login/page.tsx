"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function DebugLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
  };

  useEffect(() => {
    addLog("Page loaded");
    // Check if NextAuth is properly loaded
    if (typeof signIn !== "function") {
      addLog("ERROR: signIn is not a function!");
      setError("NextAuth not properly loaded");
    } else {
      addLog("NextAuth signIn function available");
    }
  }, []);

  const handleLoginClick = async () => {
    try {
      addLog("Login button clicked");
      addLog("Calling signIn('google')...");
      
      // This will redirect to Google
      const result = await signIn("google", { 
        redirect: false,
        callbackUrl: "/"
      });
      
      // If we get here, redirect didn't happen
      addLog(`Sign in result: ${JSON.stringify(result)}`);
      
      if (!result?.ok) {
        setError(`Error: ${result?.error || "Unknown error"}`);
        addLog(`ERROR: ${result?.error || "Unknown error"}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`EXCEPTION: ${errorMessage}`);
      setError(`Exception: ${errorMessage}`);
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Debug Login Page</h1>
      
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
      
      <button
        onClick={handleLoginClick}
        style={{
          background: "#4285F4",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Debug Sign-in with Google
      </button>
      
      <div style={{ marginTop: "20px" }}>
        <h3>Debug Information:</h3>
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "10px", 
          borderRadius: "4px", 
          fontFamily: "monospace",
          fontSize: "14px",
          overflowX: "auto"
        }}>
          <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
          <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</div>
        </div>
        
        <h3 style={{ marginTop: "20px" }}>Console Logs:</h3>
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
    </div>
  );
} 