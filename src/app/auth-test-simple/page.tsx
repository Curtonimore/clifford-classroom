"use client";

import { useState } from "react";

export default function AuthTestSimplePage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Test a GET request to a specific endpoint
  const testEndpoint = async (endpoint: string, method: string = 'GET') => {
    setLoading(true);
    try {
      const startTime = Date.now();
      
      const response = await fetch(endpoint, { method });
      const endTime = Date.now();
      
      let data;
      let error: string | null = null;
      
      try {
        data = await response.json();
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
        try {
          data = await response.text();
        } catch {
          data = null;
        }
      }
      
      setResults(prev => [
        {
          endpoint,
          method,
          status: response.status,
          statusText: response.statusText,
          time: `${endTime - startTime}ms`,
          data,
          error,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    } catch (error) {
      setResults(prev => [
        {
          endpoint,
          method,
          status: 'Error',
          statusText: error instanceof Error ? error.message : String(error),
          time: 'N/A',
          data: null,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Test all NextAuth endpoints
  const testAllEndpoints = async () => {
    await testEndpoint('/api/auth/csrf');
    await testEndpoint('/api/auth/providers');
    await testEndpoint('/api/auth/session');
    await testEndpoint('/api/auth/signin/google');
    await testEndpoint('/api/auth/signin/google', 'POST');
    await testEndpoint('/api/auth/callback/google');
    await testEndpoint('/api/auth/callback/google', 'POST');
    await testEndpoint('/api/auth/signin');
    await testEndpoint('/api/auth/signin', 'POST');
    await testEndpoint('/api/direct-google-auth');
  };

  // Clear all results
  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Simple Auth Endpoint Test</h1>
      
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
          This page makes direct fetch requests to various auth endpoints to test their accessibility.
          It doesn't use any NextAuth client libraries, just raw fetch calls.
        </p>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Test Actions</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button 
            onClick={() => testEndpoint('/api/auth/csrf')}
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
            Test CSRF Endpoint
          </button>
          
          <button 
            onClick={() => testEndpoint('/api/auth/providers')}
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
            Test Providers Endpoint
          </button>
          
          <button 
            onClick={() => testEndpoint('/api/auth/session')}
            disabled={loading}
            style={{ 
              backgroundColor: "#FBBC05", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test Session Endpoint
          </button>
          
          <button 
            onClick={() => testEndpoint('/api/auth/signin/google')}
            disabled={loading}
            style={{ 
              backgroundColor: "#EA4335", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test Google Signin (GET)
          </button>
          
          <button 
            onClick={() => testEndpoint('/api/auth/signin/google', 'POST')}
            disabled={loading}
            style={{ 
              backgroundColor: "#DB4437", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test Google Signin (POST)
          </button>
          
          <button 
            onClick={() => testEndpoint('/api/direct-google-auth')}
            disabled={loading}
            style={{ 
              backgroundColor: "#673AB7", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test Direct Google Auth
          </button>
          
          <button 
            onClick={testAllEndpoints}
            disabled={loading}
            style={{ 
              backgroundColor: "#009688", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Test All Endpoints
          </button>
          
          <button 
            onClick={clearResults}
            disabled={loading}
            style={{ 
              backgroundColor: "#9E9E9E", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Clear Results
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Test Results</h2>
        {results.length > 0 ? (
          <div>
            {results.map((result, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: result.status === 200 ? "#e8f5e9" : "#ffebee",
                  padding: "15px", 
                  borderRadius: "4px", 
                  marginBottom: "10px",
                  border: result.status === 200 ? "1px solid #a5d6a7" : "1px solid #ef9a9a"
                }}
              >
                <h3 style={{ margin: "0 0 10px 0" }}>
                  {result.method} {result.endpoint} - {result.status} {result.statusText}
                </h3>
                <p style={{ margin: "0 0 5px 0" }}>Time: {result.time}</p>
                <p style={{ margin: "0 0 10px 0" }}>Timestamp: {result.timestamp}</p>
                
                {result.error && (
                  <div style={{ 
                    backgroundColor: "#fff8e1", 
                    padding: "10px", 
                    borderRadius: "4px", 
                    marginBottom: "10px",
                    border: "1px solid #ffe082"
                  }}>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.data && (
                  <div style={{ 
                    backgroundColor: "#f5f5f5", 
                    padding: "10px", 
                    borderRadius: "4px", 
                    overflow: "auto"
                  }}>
                    <pre style={{ margin: 0 }}>
                      {typeof result.data === 'string' 
                        ? result.data 
                        : JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No tests run yet. Use the buttons above to test endpoints.</p>
        )}
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