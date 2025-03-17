"use client";

import { useState, useEffect } from "react";

export default function GoogleOAuthFixPage() {
  const [hostName, setHostName] = useState<string>("");
  const [showCopied, setShowCopied] = useState<boolean>(false);
  
  useEffect(() => {
    // Get the current hostname
    if (typeof window !== 'undefined') {
      setHostName(window.location.origin);
    }
  }, []);
  
  const redirectUris = [
    `${hostName}/api/auth/callback/google`,
    `${hostName}/auth/callback/google`,
    `${hostName}/api/auth/callback`,
    hostName
  ];
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Fix Google OAuth Redirect URI Mismatch</h1>
      
      {showCopied && (
        <div style={{ 
          position: "fixed", 
          top: "20px", 
          right: "20px", 
          backgroundColor: "#4CAF50", 
          color: "white", 
          padding: "10px 20px", 
          borderRadius: "4px",
          zIndex: 1000,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          ✅ Copied to clipboard!
        </div>
      )}
      
      <div style={{ 
        backgroundColor: "#ffebee", 
        color: "#c62828", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "30px",
        marginTop: "20px",
        border: "1px solid #ef9a9a"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🛑 Error Detected</h3>
        <p style={{ margin: "0 0 10px 0" }}>
          <strong>Error 400: redirect_uri_mismatch</strong> - The redirect URI in the request: 
          <code style={{ 
            backgroundColor: "#f8d7da", 
            padding: "3px 6px", 
            borderRadius: "3px", 
            margin: "0 5px" 
          }}>
            {hostName}/api/auth/callback/google
          </code> 
          did not match a registered redirect URI.
        </p>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 1: Access Google Cloud Console</h2>
        <p>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console Credentials page</a></p>
        <div style={{ 
          backgroundColor: "#e8f5e9", 
          padding: "15px", 
          borderRadius: "4px",
          marginTop: "10px"
        }}>
          <p><strong>Note:</strong> Make sure you're logged in with the correct Google account that owns your project.</p>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 2: Find Your OAuth 2.0 Client ID</h2>
        <ol>
          <li>Select your project from the dropdown at the top of the page</li>
          <li>Find the section labeled "OAuth 2.0 Client IDs"</li>
          <li>Click on the client ID being used for your application (likely labeled "Web client")</li>
        </ol>
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "4px",
          marginTop: "10px"
        }}>
          <img 
            src="https://i.imgur.com/aBcDeFg.png" 
            alt="Google Cloud Console OAuth Client IDs" 
            style={{ maxWidth: "100%", border: "1px solid #ddd", display: "none" }}
          />
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 3: Add All Possible Redirect URIs</h2>
        <p>Add <strong>ALL</strong> of the following redirect URIs to your client configuration:</p>
        
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "4px",
          marginTop: "10px"
        }}>
          {redirectUris.map((uri, index) => (
            <div key={index} style={{ 
              display: "flex", 
              alignItems: "center",
              marginBottom: "10px",
              backgroundColor: index === 0 ? "#e3f2fd" : "transparent",
              padding: "10px",
              borderRadius: "4px"
            }}>
              <code style={{ 
                flexGrow: 1, 
                padding: "8px", 
                backgroundColor: "#eee", 
                borderRadius: "4px",
                overflowX: "auto"
              }}>
                {uri}
              </code>
              <button 
                onClick={() => copyToClipboard(uri)}
                style={{ 
                  marginLeft: "10px", 
                  backgroundColor: "#2196F3", 
                  color: "white", 
                  border: "none", 
                  padding: "8px 15px", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Copy
              </button>
              {index === 0 && (
                <span style={{ 
                  marginLeft: "10px", 
                  backgroundColor: "#4CAF50", 
                  color: "white", 
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  fontSize: "12px"
                }}>
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ 
          backgroundColor: "#fff3e0", 
          padding: "15px", 
          borderRadius: "4px",
          marginTop: "15px",
          border: "1px solid #ffe0b2"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>⚠️ Important Notes</h4>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Make sure to add <strong>all</strong> redirect URIs listed above</li>
            <li>There should be <strong>no trailing slash</strong> at the end of the URIs</li>
            <li>Case sensitivity matters - ensure the URIs match exactly</li>
            <li>Also add any non-www versions if your site supports both</li>
          </ul>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 4: Update Authorized JavaScript Origins</h2>
        <p>Add the following as an authorized JavaScript origin:</p>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          backgroundColor: "#e3f2fd",
          padding: "10px",
          borderRadius: "4px"
        }}>
          <code style={{ 
            flexGrow: 1, 
            padding: "8px", 
            backgroundColor: "#eee", 
            borderRadius: "4px" 
          }}>
            {hostName}
          </code>
          <button 
            onClick={() => copyToClipboard(hostName)}
            style={{ 
              marginLeft: "10px", 
              backgroundColor: "#2196F3", 
              color: "white", 
              border: "none", 
              padding: "8px 15px", 
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Copy
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 5: Save Changes</h2>
        <p>Click the "Save" button at the bottom of the OAuth client ID settings page.</p>
        <div style={{ 
          backgroundColor: "#e8f5e9", 
          padding: "15px", 
          borderRadius: "4px",
          marginTop: "10px"
        }}>
          <p><strong>Note:</strong> Changes in the Google Cloud Console may take up to 5 minutes to propagate.</p>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 6: Test Authentication Again</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a 
            href="/google-auth-test"
            style={{ 
              backgroundColor: "#4285F4", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "bold"
            }}
          >
            Try Direct OAuth Test
          </a>
          <a 
            href="/auth-link"
            style={{ 
              backgroundColor: "#9E9E9E", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Back to Auth Links
          </a>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: "#e3f2fd", 
        color: "#0d47a1", 
        padding: "15px", 
        borderRadius: "4px", 
        marginTop: "20px",
        border: "1px solid #90caf9"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Need More Help?</h3>
        <p style={{ margin: "0" }}>
          If you continue experiencing issues after making these changes, check other potential causes:
        </p>
        <ul>
          <li>Ensure your Google OAuth APIs are enabled (People API, Google+ API)</li>
          <li>Verify your OAuth consent screen is properly configured</li>
          <li>Check if your app is in "Testing" mode and you're using an authorized test user</li>
          <li>Confirm that your Google Cloud Project is not suspended or disabled</li>
        </ul>
      </div>
    </div>
  );
} 