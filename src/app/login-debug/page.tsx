"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginDebugPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    }
    
    // Check for any URL parameters that might indicate errors
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const errorParam = url.searchParams.get('error');
      if (errorParam) {
        addLog(`Error parameter in URL: ${errorParam}`);
        setError(`Error from redirect: ${errorParam}`);
      }
    }
  }, [status, session]);

  const handleGoogleLogin = async () => {
    try {
      addLog("Google login button clicked");
      setIsLoading(true);
      
      // Log the signIn function details
      addLog(`signIn type: ${typeof signIn}`);
      addLog(`signIn toString: ${signIn.toString().substring(0, 100)}...`);
      
      // Call signIn with logging
      addLog("Calling signIn('google')...");
      const result = await signIn("google", { 
        redirect: false,
        callbackUrl: "/"
      });
      
      addLog(`Sign in result: ${JSON.stringify(result)}`);
      
      if (!result?.ok) {
        setError(`Error: ${result?.error || "Unknown error"}`);
        addLog(`ERROR: ${result?.error || "Unknown error"}`);
      } else {
        addLog("Sign in successful, redirecting...");
        window.location.href = result.url || "/";
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`EXCEPTION: ${errorMessage}`);
      setError(`Exception: ${errorMessage}`);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDirectLogin = () => {
    try {
      addLog("Direct login button clicked");
      addLog("Calling signIn('google') with direct redirect...");
      
      // This will redirect to Google immediately
      signIn("google", { callbackUrl: "/" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`EXCEPTION: ${errorMessage}`);
      setError(`Exception: ${errorMessage}`);
      console.error("Direct login error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      addLog("Logout button clicked");
      await signOut({ redirect: false });
      addLog("Signed out successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`EXCEPTION during logout: ${errorMessage}`);
      setError(`Logout exception: ${errorMessage}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Login Debug Page</h1>
      
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
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: "#f44336", 
                color: "white", 
                border: "none", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Sign Out
            </button>
          </div>
        ) : status === "loading" ? (
          <p>Loading session...</p>
        ) : (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{ 
                backgroundColor: "#4285F4", 
                color: "white", 
                border: "none", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? "Loading..." : "Sign in with Google (No Redirect)"}
            </button>
            
            <button 
              onClick={handleDirectLogin}
              style={{ 
                backgroundColor: "#34A853", 
                color: "white", 
                border: "none", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Sign in with Google (Direct)
            </button>
            
            <a 
              href="/api/auth/signin/google"
              style={{ 
                backgroundColor: "#FBBC05", 
                color: "white", 
                border: "none", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Sign in with Direct Link
            </a>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h3>Troubleshooting Information:</h3>
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