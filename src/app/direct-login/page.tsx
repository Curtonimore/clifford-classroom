"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function DirectLoginPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  
  const handleGoogleLogin = () => {
    try {
      signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };
  
  const handleLogout = () => {
    try {
      signOut({ callbackUrl: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Direct Login Test</h1>
      
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
          <div>
            <p>Not signed in</p>
            <button 
              onClick={handleGoogleLogin}
              style={{ 
                backgroundColor: "#4285F4", 
                color: "white", 
                border: "none", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h3>Troubleshooting Information:</h3>
        <ul>
          <li>NextAuth Status: {status}</li>
          <li>User Email: {session?.user?.email || "Not logged in"}</li>
          <li>User Role: {session?.user?.role || "No role"}</li>
          <li>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</li>
          <li>Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
} 