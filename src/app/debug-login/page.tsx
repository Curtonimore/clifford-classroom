"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function DebugLoginPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoadingDebug, setIsLoadingDebug] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
  };

  useEffect(() => {
    addLog("Page loaded");
    addLog(`Session status: ${status}`);
    
    // Check if NextAuth is properly loaded
    if (typeof signIn !== "function") {
      addLog("ERROR: signIn is not a function!");
      setError("NextAuth not properly loaded");
    } else {
      addLog("NextAuth signIn function available");
    }
    
    // Log session data if available
    if (status === "authenticated" && session) {
      addLog(`Logged in as: ${session.user?.email || 'Unknown user'}`);
      addLog(`User role: ${session.user?.role || 'No role'}`);
    }
  }, [status, session]);

  const handleDirectLoginClick = () => {
    addLog("Direct login button clicked");
    addLog("Calling signIn('google') with direct redirect...");
    
    // This will redirect to Google immediately
    signIn("google", { callbackUrl: "/" });
  };
  
  const handleNoRedirectLoginClick = async () => {
    try {
      addLog("No-redirect login button clicked");
      addLog("Calling signIn('google', { redirect: false })...");
      
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

  const fetchDebugInfo = async () => {
    try {
      setIsLoadingDebug(true);
      addLog("Fetching debug info from /api/auth-debug...");
      
      const response = await fetch('/api/auth-debug');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setDebugData(data);
      addLog("Debug info fetched successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`ERROR fetching debug info: ${errorMessage}`);
      setError(`Error fetching debug info: ${errorMessage}`);
    } finally {
      setIsLoadingDebug(false);
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
      
      {status === "authenticated" ? (
        <div style={{ 
          backgroundColor: "#e8f5e9", 
          color: "#2e7d32", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <strong>Logged in as:</strong> {session?.user?.email}<br />
          <strong>Role:</strong> {session?.user?.role || "No role"}
        </div>
      ) : status === "loading" ? (
        <div style={{ 
          backgroundColor: "#e3f2fd", 
          color: "#1565c0", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <strong>Loading session...</strong>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: "#fff3e0", 
          color: "#e65100", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <strong>Not logged in</strong>
        </div>
      )}
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={handleDirectLoginClick}
          style={{
            background: "#4285F4",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Sign-in with Google (Direct)
        </button>
        
        <button
          onClick={handleNoRedirectLoginClick}
          style={{
            background: "#34A853",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Sign-in with Google (No Redirect)
        </button>
        
        <Link href="/login" style={{
          background: "#FBBC05",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-block"
        }}>
          Try Simple Login Page
        </Link>
        
        <button
          onClick={fetchDebugInfo}
          disabled={isLoadingDebug}
          style={{
            background: "#DB4437",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: isLoadingDebug ? "not-allowed" : "pointer",
            opacity: isLoadingDebug ? 0.7 : 1
          }}
        >
          {isLoadingDebug ? "Loading..." : "Fetch Debug Info"}
        </button>
      </div>
      
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
          <div><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</div>
          <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</div>
          <div><strong>Session Status:</strong> {status}</div>
          <div><strong>NextAuth URL:</strong> {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not exposed to client'}</div>
          <div>
            <strong>Debug Endpoints:</strong>
            <ul style={{ marginTop: "5px", marginBottom: "5px" }}>
              <li><a href="/api/auth-debug" target="_blank" style={{ color: "#4285F4" }}>/api/auth-debug</a> - Auth configuration</li>
              <li><a href="/api/debug-auth" target="_blank" style={{ color: "#4285F4" }}>/api/debug-auth</a> - Alternative debug endpoint</li>
              <li><a href="/auth-test" target="_blank" style={{ color: "#4285F4" }}>/auth-test</a> - Basic auth test page</li>
            </ul>
          </div>
        </div>
        
        {debugData && (
          <>
            <h3 style={{ marginTop: "20px" }}>Debug API Response:</h3>
            <div style={{ 
              backgroundColor: "#f5f5f5", 
              padding: "10px", 
              borderRadius: "4px", 
              fontFamily: "monospace",
              fontSize: "14px",
              maxHeight: "300px",
              overflowY: "auto"
            }}>
              <pre>{JSON.stringify(debugData, null, 2)}</pre>
            </div>
          </>
        )}
        
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
        
        <div style={{ marginTop: "20px" }}>
          <Link href="/" style={{
            color: "#4285F4",
            textDecoration: "none"
          }}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 