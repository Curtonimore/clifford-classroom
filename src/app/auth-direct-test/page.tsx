"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthDirectTestPage() {
  const { data: session, status } = useSession();
  const [actionResult, setActionResult] = useState<string | null>(null);
  
  const handleSignIn = async () => {
    setActionResult("Signing in...");
    try {
      const result = await signIn("google", { 
        callbackUrl: "/auth-direct-test",
        redirect: true
      });
      if (result?.error) {
        setActionResult(`Error: ${result.error}`);
      }
    } catch (error) {
      setActionResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const handleSignOut = async () => {
    setActionResult("Signing out...");
    try {
      await signOut({ callbackUrl: "/auth-direct-test" });
    } catch (error) {
      setActionResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Direct Auth Test (No MongoDB)</h1>
      
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
          This page tests a simplified authentication flow that doesn't use MongoDB.
          It's designed to isolate database-related issues from the core authentication process.
        </p>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Authentication Status</h2>
        <div style={{ 
          backgroundColor: status === "loading" ? "#f5f5f5" : 
                          status === "authenticated" ? "#e8f5e9" : "#ffebee", 
          padding: "15px", 
          borderRadius: "4px", 
          marginTop: "10px",
          border: status === "authenticated" ? "1px solid #a5d6a7" : 
                status === "unauthenticated" ? "1px solid #ef9a9a" : "1px solid #e0e0e0"
        }}>
          <p><strong>Status:</strong> {status}</p>
          
          {status === "authenticated" && session?.user && (
            <div>
              <p><strong>User:</strong> {session.user.name || "Unknown"}</p>
              <p><strong>Email:</strong> {session.user.email || "Unknown"}</p>
              <p><strong>Role:</strong> {session.user.role || "Unknown"}</p>
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%",
                    marginTop: "10px"
                  }} 
                />
              )}
            </div>
          )}
          
          {actionResult && (
            <p style={{ 
              backgroundColor: "#fff8e1", 
              padding: "8px", 
              borderRadius: "4px", 
              marginTop: "10px"
            }}>
              {actionResult}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Authentication Actions</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {status === "unauthenticated" ? (
            <button 
              onClick={handleSignIn}
              style={{ 
                backgroundColor: "#4285F4", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign In with Google (Direct)
            </button>
          ) : (
            <button 
              onClick={handleSignOut}
              style={{ 
                backgroundColor: "#EA4335", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          )}
          
          <a 
            href="/auth-link"
            style={{ 
              backgroundColor: "#9E9E9E", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Back to Auth Links
          </a>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Direct Auth API Links</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-direct/signin"
              style={{ 
                backgroundColor: "#4CAF50", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Sign In Page (Direct)
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-direct/signin/google"
              style={{ 
                backgroundColor: "#8BC34A", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Sign In with Google (Direct)
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-direct/session"
              style={{ 
                backgroundColor: "#FF9800", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Check Session (Direct)
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-direct/signout"
              style={{ 
                backgroundColor: "#F44336", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Sign Out (Direct)
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Troubleshooting Tools</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/db-connection-test"
              style={{ 
                backgroundColor: "#673AB7", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Test MongoDB Connection
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/auth-config-test"
              style={{ 
                backgroundColor: "#009688", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Test Auth Configuration
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
} 