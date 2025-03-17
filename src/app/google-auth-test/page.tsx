"use client";

import { useState } from "react";

export default function GoogleAuthTestPage() {
  const [clientId, setClientId] = useState<string>("");
  const [showClientId, setShowClientId] = useState<boolean>(false);
  const [redirectUri, setRedirectUri] = useState<string>("https://www.cliffordclassroom.com/api/auth/callback/google");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate Google OAuth URL
  const generateOAuthUrl = () => {
    try {
      if (!clientId) {
        setErrorMessage("Please enter a Google Client ID");
        return null;
      }

      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const options = {
        redirect_uri: redirectUri,
        client_id: clientId,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
        state: Math.random().toString(36).substring(2, 15),
      };
      
      const qs = new URLSearchParams(options);
      return `${rootUrl}?${qs.toString()}`;
    } catch (error) {
      setErrorMessage(`Error generating URL: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  };

  // Fetch client ID
  const fetchClientId = async () => {
    try {
      const response = await fetch('/api/get-client-id');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setClientId(data.clientId || "");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(`Error fetching client ID: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Handle the OAuth flow
  const startOAuthFlow = () => {
    const url = generateOAuthUrl();
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Google OAuth Direct Test</h1>
      
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
          This page helps diagnose Google OAuth redirect URI issues by letting you explicitly 
          set the redirect URI and see the full OAuth URL being used.
        </p>
      </div>
      
      {errorMessage && (
        <div style={{ 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          padding: "15px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
      
      <div style={{ marginBottom: "30px" }}>
        <h2>OAuth Configuration</h2>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Google Client ID:
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              type="text" 
              value={showClientId ? clientId : "●".repeat(clientId.length || 10)} 
              onChange={(e) => setClientId(e.target.value)}
              style={{ 
                flex: "1", 
                padding: "8px", 
                borderRadius: "4px", 
                border: "1px solid #ccc" 
              }}
              placeholder="Your Google Client ID"
            />
            <button 
              onClick={() => setShowClientId(!showClientId)}
              style={{ 
                backgroundColor: "#9E9E9E", 
                color: "white", 
                padding: "8px 15px", 
                borderRadius: "4px", 
                border: "none",
                cursor: "pointer",
              }}
            >
              {showClientId ? "Hide" : "Show"}
            </button>
            <button 
              onClick={fetchClientId}
              style={{ 
                backgroundColor: "#2196F3", 
                color: "white", 
                padding: "8px 15px", 
                borderRadius: "4px", 
                border: "none",
                cursor: "pointer",
              }}
            >
              Fetch ID
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Redirect URI:
          </label>
          <input 
            type="text" 
            value={redirectUri} 
            onChange={(e) => setRedirectUri(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "8px", 
              borderRadius: "4px", 
              border: "1px solid #ccc" 
            }}
            placeholder="Redirect URI"
          />
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Test Actions</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button 
            onClick={startOAuthFlow}
            style={{ 
              backgroundColor: "#4285F4", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              border: "none",
              cursor: "pointer",
            }}
          >
            Start OAuth Flow
          </button>
          
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
        <h2>OAuth URL Preview</h2>
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "4px", 
          marginBottom: "10px",
          overflow: "auto",
          wordBreak: "break-all"
        }}>
          {generateOAuthUrl() || "Enter Client ID to generate URL"}
        </div>
        <p><strong>Note:</strong> This is the exact URL that will be used to start the OAuth flow.</p>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Troubleshooting Tips</h2>
        <ul>
          <li>Make sure the Redirect URI matches exactly what's in your Google Cloud Console.</li>
          <li>Check if you need both www and non-www versions of your domain.</li>
          <li>Verify that your application is set to the correct status (testing/production).</li>
          <li>Try using different browsers or clearing cookies if you're testing multiple times.</li>
          <li>Look for any query parameters being added to the redirect URI that might cause mismatches.</li>
        </ul>
      </div>
    </div>
  );
} 