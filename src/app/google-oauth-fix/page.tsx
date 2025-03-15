"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function GoogleOAuthFixPage() {
  const { data: session, status } = useSession();
  const [authConfig, setAuthConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthTest = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth-test');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setAuthConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error fetching auth test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthTest();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Google OAuth Configuration Fix</h1>
      
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
          </div>
        ) : status === "loading" ? (
          <p>Loading session...</p>
        ) : (
          <p>Not signed in</p>
        )}
      </div>
      
      {loading ? (
        <p>Loading configuration data...</p>
      ) : authConfig ? (
        <div>
          <h2>Configuration Issue Detected</h2>
          
          <div style={{ 
            backgroundColor: "#fff3e0", 
            padding: "15px", 
            borderRadius: "4px", 
            marginBottom: "20px",
            border: "1px solid #ffcc80"
          }}>
            <p>Based on your configuration, we've identified a potential issue with your Google OAuth setup:</p>
            
            <h3>Your Current Configuration:</h3>
            <ul>
              <li><strong>NEXTAUTH_URL:</strong> {authConfig.nextAuthUrl}</li>
              <li><strong>Redirect URI:</strong> {authConfig.redirectUri}</li>
            </ul>
            
            <h3>Detected Issues:</h3>
            <ul>
              <li>Your site is accessible at <strong>www.cliffordclassroom.com</strong>, but your NEXTAUTH_URL is set to <strong>{authConfig.nextAuthUrl}</strong> (without the "www").</li>
              <li>This means the redirect URI registered with Google might not match what Google sees when redirecting back to your site.</li>
            </ul>
          </div>
          
          <h2>How to Fix This</h2>
          
          <div style={{ marginBottom: "30px" }}>
            <h3>Option 1: Update Google Cloud Console (Recommended)</h3>
            <ol>
              <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console Credentials page</a></li>
              <li>Find and edit your OAuth 2.0 Client ID</li>
              <li>Under "Authorized redirect URIs", make sure you have <strong>both</strong> of these URLs:
                <ul>
                  <li>{authConfig.redirectUri}</li>
                  <li>https://www.cliffordclassroom.com/api/auth/callback/google</li>
                </ul>
              </li>
              <li>Under "Authorized JavaScript origins", make sure you have <strong>both</strong> of these URLs:
                <ul>
                  <li>{authConfig.nextAuthUrl}</li>
                  <li>https://www.cliffordclassroom.com</li>
                </ul>
              </li>
              <li>Save your changes</li>
            </ol>
          </div>
          
          <div style={{ marginBottom: "30px" }}>
            <h3>Option 2: Update NEXTAUTH_URL in Vercel</h3>
            <ol>
              <li>Go to your <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">Vercel Dashboard</a></li>
              <li>Select your project</li>
              <li>Go to Settings → Environment Variables</li>
              <li>Update NEXTAUTH_URL to <strong>https://www.cliffordclassroom.com</strong> (with the "www")</li>
              <li>Redeploy your application</li>
            </ol>
          </div>
          
          <div style={{ marginBottom: "30px" }}>
            <h3>Option 3: Set Up URL Forwarding</h3>
            <p>Configure your domain to forward all traffic from one domain to the other:</p>
            <ul>
              <li>Forward all traffic from <strong>cliffordclassroom.com</strong> to <strong>www.cliffordclassroom.com</strong></li>
              <li>Or forward all traffic from <strong>www.cliffordclassroom.com</strong> to <strong>cliffordclassroom.com</strong></li>
            </ul>
            <p>This ensures users always end up on the same domain, regardless of which URL they use.</p>
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