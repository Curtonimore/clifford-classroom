"use client";

import { useState } from "react";

export default function MethodTestPage() {
  const [getResult, setGetResult] = useState<any>(null);
  const [postResult, setPostResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testGetMethod = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/method-test');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setGetResult(data);
    } catch (err) {
      setError(`GET Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error("GET error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testPostMethod = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/method-test', {
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
      setPostResult(data);
    } catch (err) {
      setError(`POST Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error("POST error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testNextAuthEndpoints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test GET to /api/auth/csrf
      const csrfResponse = await fetch('/api/auth/csrf');
      if (!csrfResponse.ok) {
        throw new Error(`CSRF endpoint error! Status: ${csrfResponse.status}`);
      }
      
      const csrfData = await csrfResponse.json();
      
      // Test GET to /api/auth/providers
      const providersResponse = await fetch('/api/auth/providers');
      if (!providersResponse.ok) {
        throw new Error(`Providers endpoint error! Status: ${providersResponse.status}`);
      }
      
      const providersData = await providersResponse.json();
      
      // Set combined result
      setGetResult({
        csrf: csrfData,
        providers: providersData,
        message: "NextAuth endpoints test successful"
      });
    } catch (err) {
      setError(`NextAuth Test Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error("NextAuth test error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>HTTP Method Test</h1>
      
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
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
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
        
        <button
          onClick={testNextAuthEndpoints}
          disabled={loading}
          style={{
            backgroundColor: "#FBBC05",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          Test NextAuth Endpoints
        </button>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>GET Result:</h2>
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "10px", 
          borderRadius: "4px", 
          fontFamily: "monospace",
          fontSize: "14px",
          maxHeight: "200px",
          overflowY: "auto"
        }}>
          <pre>{getResult ? JSON.stringify(getResult, null, 2) : "No result yet"}</pre>
        </div>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>POST Result:</h2>
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "10px", 
          borderRadius: "4px", 
          fontFamily: "monospace",
          fontSize: "14px",
          maxHeight: "200px",
          overflowY: "auto"
        }}>
          <pre>{postResult ? JSON.stringify(postResult, null, 2) : "No result yet"}</pre>
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