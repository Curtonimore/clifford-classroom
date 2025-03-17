"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NextAuthDebugPage() {
  const { data: session, status } = useSession();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [providers, setProviders] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/auth/csrf');
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
          addTestResult('CSRF Token Fetch', true, data);
        } else {
          setCsrfToken(null);
          addTestResult('CSRF Token Fetch', false, { status: response.status, statusText: response.statusText });
        }
      } catch (err) {
        setCsrfToken(null);
        addTestResult('CSRF Token Fetch', false, { error: String(err) });
      }
    };

    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/auth/providers');
        if (response.ok) {
          const data = await response.json();
          setProviders(data);
          addTestResult('Providers Fetch', true, data);
        } else {
          setProviders(null);
          addTestResult('Providers Fetch', false, { status: response.status, statusText: response.statusText });
        }
      } catch (err) {
        setProviders(null);
        addTestResult('Providers Fetch', false, { error: String(err) });
      }
    };

    fetchCsrfToken();
    fetchProviders();
  }, []);

  const addTestResult = (name: string, success: boolean, data: any) => {
    setTestResults(prev => [
      ...prev,
      {
        name,
        success,
        data,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleSignIn = async (provider: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Signing in with ${provider}...`);
      
      // Log the signIn function to see if it's available
      console.log('signIn function:', signIn);
      
      // Call the signIn function with the provider
      const result = await signIn(provider, { redirect: false });
      
      console.log('Sign in result:', result);
      
      if (result?.error) {
        setError(result.error);
        addTestResult(`Sign In (${provider})`, false, result);
      } else {
        addTestResult(`Sign In (${provider})`, true, result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Sign in error:', err);
      addTestResult(`Sign In (${provider})`, false, { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signing out...');
      
      // Call the signOut function
      const result = await signOut({ redirect: false });
      
      console.log('Sign out result:', result);
      addTestResult('Sign Out', true, result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Sign out error:', err);
      addTestResult('Sign Out', false, { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Checking session...');
      
      const response = await fetch('/api/auth/session');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Session data:', data);
      addTestResult('Session Check', true, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Session check error:', err);
      addTestResult('Session Check', false, { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>NextAuth Debug Page</h1>
      
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
        <h2>Session Status</h2>
        <p>Current session status: <strong>{status}</strong></p>
        
        {session && (
          <div style={{ 
            backgroundColor: "#e8f5e9", 
            color: "#2e7d32", 
            padding: "10px", 
            borderRadius: "4px", 
            marginTop: "10px" 
          }}>
            <h3>Session Data</h3>
            <pre style={{ 
              backgroundColor: "#f5f5f5", 
              padding: "10px", 
              borderRadius: "4px", 
              overflow: "auto",
              maxHeight: "200px"
            }}>
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Authentication Actions</h2>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleSignIn('google')}
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
            Sign In with Google
          </button>
          
          <button
            onClick={handleSignOut}
            disabled={loading || status !== 'authenticated'}
            style={{
              backgroundColor: "#EA4335",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: (loading || status !== 'authenticated') ? "not-allowed" : "pointer",
              opacity: (loading || status !== 'authenticated') ? 0.7 : 1
            }}
          >
            Sign Out
          </button>
          
          <button
            onClick={checkSession}
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
            Check Session
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>NextAuth Configuration</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <h3>CSRF Token</h3>
          {csrfToken ? (
            <p style={{ wordBreak: "break-all" }}>{csrfToken}</p>
          ) : (
            <p>No CSRF token available</p>
          )}
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <h3>Available Providers</h3>
          {providers ? (
            <pre style={{ 
              backgroundColor: "#f5f5f5", 
              padding: "10px", 
              borderRadius: "4px", 
              overflow: "auto",
              maxHeight: "200px"
            }}>
              {JSON.stringify(providers, null, 2)}
            </pre>
          ) : (
            <p>No providers available</p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Test Results</h2>
        
        {testResults.length === 0 ? (
          <p>No tests run yet</p>
        ) : (
          <div>
            {testResults.map((result, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: result.success ? "#e8f5e9" : "#ffebee", 
                  color: result.success ? "#2e7d32" : "#c62828", 
                  padding: "10px", 
                  borderRadius: "4px", 
                  marginBottom: "10px" 
                }}
              >
                <h4 style={{ margin: "0 0 5px 0" }}>
                  {result.name} - {result.success ? "Success" : "Failed"}
                </h4>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.8em" }}>
                  {result.timestamp}
                </p>
                <pre style={{ 
                  backgroundColor: "#f5f5f5", 
                  padding: "10px", 
                  borderRadius: "4px", 
                  overflow: "auto",
                  maxHeight: "150px",
                  margin: "5px 0 0 0"
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
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