"use client";

import { useState, useEffect } from "react";

export default function AuthConfigTestPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth-config-check');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error fetching auth config:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>NextAuth Configuration Test</h1>
      
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
          This page displays the current NextAuth configuration for debugging purposes.
          It shows environment variables and configuration settings that might affect authentication.
        </p>
      </div>
      
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
      
      {loading ? (
        <p>Loading configuration data...</p>
      ) : config ? (
        <div>
          <h2>Environment Variables</h2>
          <div style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "4px", 
            marginBottom: "20px",
            overflow: "auto"
          }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(config.env, null, 2)}
            </pre>
          </div>
          
          <h2>NextAuth Configuration</h2>
          <div style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "4px", 
            marginBottom: "20px",
            overflow: "auto"
          }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(config.authConfig, null, 2)}
            </pre>
          </div>
          
          <h2>Redirect URIs</h2>
          <div style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "4px", 
            marginBottom: "20px",
            overflow: "auto"
          }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(config.redirectUris, null, 2)}
            </pre>
          </div>
          
          <h2>Request Information</h2>
          <div style={{ 
            backgroundColor: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "4px", 
            marginBottom: "20px",
            overflow: "auto"
          }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(config.request, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <p>Failed to load configuration data.</p>
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