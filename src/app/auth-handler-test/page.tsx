"use client";

import { useState } from "react";

export default function AuthHandlerTestPage() {
  const [getResponse, setGetResponse] = useState<any>(null);
  const [postResponse, setPostResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testGetMethod = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Testing GET method...");
      const response = await fetch('/api/auth-handler');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json().catch(() => "Not JSON");
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
      const response = await fetch('/api/auth-handler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json().catch(() => "Not JSON");
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

  // Direct navigation to NextAuth endpoints
  const goToGoogleSignIn = () => {
    window.location.href = "/api/auth/signin/google";
  };

  const checkSession = () => {
    window.location.href = "/api/auth/session";
  };

  const goToSignInPage = () => {
    window.location.href = "/api/auth/signin";
  };

  // Function to test NextAuth endpoints directly
  const testNextAuthEndpoint = async (endpoint: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Testing NextAuth endpoint: ${endpoint}`);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json().catch(() => "Not JSON");
      setGetResponse({
        message: `NextAuth endpoint response: ${endpoint}`,
        data: data
      });
      console.log("NextAuth response:", data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`NextAuth Error: ${errorMessage}`);
      console.error("NextAuth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Auth Handler Test</h1>
      
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
        <p>This page tests if our custom auth handler can handle both GET and POST methods correctly.</p>
        
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
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>NextAuth Direct Endpoints</h2>
        <p>These buttons will navigate directly to NextAuth endpoints.</p>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            onClick={goToSignInPage}
            style={{
              backgroundColor: "#FBBC05",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Go to Sign In Page
          </button>
          
          <button
            onClick={goToGoogleSignIn}
            style={{
              backgroundColor: "#EA4335",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Go to Google Sign In
          </button>
          
          <button
            onClick={checkSession}
            style={{
              backgroundColor: "#673AB7",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Check Session
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Test NextAuth Endpoints</h2>
        <p>These buttons will fetch data from NextAuth endpoints without redirecting.</p>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            onClick={() => testNextAuthEndpoint('/api/auth/session')}
            disabled={loading}
            style={{
              backgroundColor: "#009688",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test Session Endpoint
          </button>
          
          <button
            onClick={() => testNextAuthEndpoint('/api/auth/csrf')}
            disabled={loading}
            style={{
              backgroundColor: "#FF5722",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test CSRF Endpoint
          </button>
          
          <button
            onClick={() => testNextAuthEndpoint('/api/auth/providers')}
            disabled={loading}
            style={{
              backgroundColor: "#9C27B0",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test Providers Endpoint
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
            {typeof getResponse === 'object' ? JSON.stringify(getResponse, null, 2) : getResponse}
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
            {typeof postResponse === 'object' ? JSON.stringify(postResponse, null, 2) : postResponse}
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