"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NextAuthDebugPage() {
  const { data: session, status } = useSession();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [providers, setProviders] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/auth/csrf");
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    fetchCsrfToken();
  }, []);

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers");
        const data = await response.json();
        setProviders(data);
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    };

    fetchProviders();
  }, []);

  // Handle sign in
  const handleSignIn = async () => {
    try {
      setTestResults([
        ...testResults,
        {
          test: "Sign In (google)",
          timestamp: new Date().toISOString(),
          status: "pending",
          data: null
        }
      ]);

      const result = await signIn("google", { redirect: false });
      
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => item.status === "pending");
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: result?.error ? "failed" : "success",
            data: result?.error ? { error: result.error } : result
          };
        }
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => item.status === "pending");
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "failed",
            data: { error: err instanceof Error ? err.message : String(err) }
          };
        }
        return updated;
      });
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Test providers fetch
  const testProvidersFetch = async () => {
    try {
      const timestamp = new Date().toISOString();
      setTestResults([
        ...testResults,
        {
          test: "Providers Fetch",
          timestamp,
          status: "pending",
          data: null
        }
      ]);

      const response = await fetch("/api/auth/providers");
      const data = await response.json();
      
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => 
          item.test === "Providers Fetch" && item.timestamp === timestamp
        );
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "success",
            data
          };
        }
        return updated;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => item.status === "pending");
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "failed",
            data: { error: errorMessage }
          };
        }
        return updated;
      });
    }
  };

  // Test CSRF token fetch
  const testCsrfFetch = async () => {
    try {
      const timestamp = new Date().toISOString();
      setTestResults([
        ...testResults,
        {
          test: "CSRF Token Fetch",
          timestamp,
          status: "pending",
          data: null
        }
      ]);

      const response = await fetch("/api/auth/csrf");
      const data = await response.json();
      
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => 
          item.test === "CSRF Token Fetch" && item.timestamp === timestamp
        );
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "success",
            data
          };
        }
        return updated;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => item.status === "pending");
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "failed",
            data: { error: errorMessage }
          };
        }
        return updated;
      });
    }
  };

  // Test session check
  const testSessionCheck = async () => {
    try {
      const timestamp = new Date().toISOString();
      setTestResults([
        ...testResults,
        {
          test: "Session Check",
          timestamp,
          status: "pending",
          data: null
        }
      ]);

      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => 
          item.test === "Session Check" && item.timestamp === timestamp
        );
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "success",
            data
          };
        }
        return updated;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      setTestResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(item => item.status === "pending");
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "failed",
            data: { error: errorMessage }
          };
        }
        return updated;
      });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>NextAuth Debug Page</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          padding: "15px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Session Status</h2>
        <p>Current session status: <strong>{status}</strong></p>
        {status === "authenticated" && session && (
          <div>
            <p><strong>User:</strong> {session.user?.name} ({session.user?.email})</p>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Authentication Actions</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button 
            onClick={handleSignIn}
            style={{ 
              backgroundColor: "#4285F4", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: "pointer"
            }}
          >
            Sign In with Google
          </button>
          
          <button 
            onClick={handleSignOut}
            style={{ 
              backgroundColor: "#EA4335", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: "pointer"
            }}
          >
            Sign Out
          </button>
          
          <button 
            onClick={testSessionCheck}
            style={{ 
              backgroundColor: "#FBBC05", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: "pointer"
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
            <p>{csrfToken}</p>
          ) : (
            <p>Loading CSRF token...</p>
          )}
          
          <button 
            onClick={testCsrfFetch}
            style={{ 
              backgroundColor: "#34A853", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Test CSRF Token Fetch
          </button>
        </div>
        
        <div>
          <h3>Available Providers</h3>
          {providers ? (
            <pre>{JSON.stringify(providers, null, 2)}</pre>
          ) : (
            <p>Loading providers...</p>
          )}
          
          <button 
            onClick={testProvidersFetch}
            style={{ 
              backgroundColor: "#34A853", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Test Providers Fetch
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Test Results</h2>
        {testResults.length > 0 ? (
          <div>
            {testResults.map((result, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: result.status === "success" ? "#e8f5e9" : result.status === "failed" ? "#ffebee" : "#e3f2fd",
                  padding: "15px", 
                  borderRadius: "4px", 
                  marginBottom: "10px",
                  border: result.status === "success" ? "1px solid #a5d6a7" : result.status === "failed" ? "1px solid #ef9a9a" : "1px solid #90caf9"
                }}
              >
                <h3 style={{ margin: "0 0 10px 0" }}>
                  {result.test} - {result.status === "success" ? "Success" : result.status === "failed" ? "Failed" : "Pending"}
                </h3>
                <p style={{ margin: "0 0 10px 0" }}>{result.timestamp}</p>
                {result.data && (
                  <pre style={{ margin: 0, overflow: "auto" }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No tests run yet. Use the buttons above to test NextAuth functionality.</p>
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
      
      <footer style={{ marginTop: "50px", borderTop: "1px solid #eee", paddingTop: "20px", color: "#666" }}>
        Clifford Classroom © 2025 - Educational Resources for Modern Educators
      </footer>
    </div>
  );
} 