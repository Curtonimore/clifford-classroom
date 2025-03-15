"use client";

import { useState } from "react";

export default function NextAuthTestPage() {
  const [getResponse, setGetResponse] = useState<any>(null);
  const [postResponse, setPostResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testGetMethod = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Testing GET method...");
      const response = await fetch('/api/nextauth-test');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setGetResponse(data);
      console.log("GET response:", data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`GET Error: ${errorMessage}`);
      console.error("GET Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testPostMethod = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Testing POST method...");
      const response = await fetch('/api/nextauth-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setPostResponse(data);
      console.log("POST response:", data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`POST Error: ${errorMessage}`);
      console.error("POST Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testNextAuthSignIn = () => {
    window.location.href = '/api/auth/signin';
  };

  const testDirectSignIn = () => {
    window.location.href = '/api/auth/signin/google';
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>NextAuth API Method Test</h1>
      
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
        <h2>Test API Methods</h2>
        <p>This page tests if your server can handle both GET and POST methods correctly.</p>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={testGetMethod}
            disabled={loading}
            style={{
              backgroundColor: "#4285F4",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test GET Method
          </button>
          
          <button
            onClick={testPostMethod}
            disabled={loading}
            style={{
              backgroundColor: "#34A853",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test POST Method
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Test NextAuth Directly</h2>
        <p>These buttons will directly navigate to NextAuth endpoints.</p>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={testNextAuthSignIn}
            style={{
              backgroundColor: "#FBBC05",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Go to NextAuth Sign In
          </button>
          
          <button
            onClick={testDirectSignIn}
            style={{
              backgroundColor: "#EA4335",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Go to Direct Google Sign In
          </button>
        </div>
      </div>
      
      {getResponse && (
        <div style={{ marginBottom: "30px" }}>
          <h3>GET Response:</h3>
          <pre style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "10px", 
            borderRadius: "4px", 
            overflow: "auto",
            maxHeight: "300px"
          }}>
            {JSON.stringify(getResponse, null, 2)}
          </pre>
        </div>
      )}
      
      {postResponse && (
        <div style={{ marginBottom: "30px" }}>
          <h3>POST Response:</h3>
          <pre style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "10px", 
            borderRadius: "4px", 
            overflow: "auto",
            maxHeight: "300px"
          }}>
            {JSON.stringify(postResponse, null, 2)}
          </pre>
        </div>
      )}
      
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