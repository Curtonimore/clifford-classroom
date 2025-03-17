"use client";

import { useState } from "react";

export default function GoogleOAuthFixPage() {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Google OAuth Configuration Fix</h1>
      
      <div style={{ 
        backgroundColor: "#e8f5e9", 
        color: "#2e7d32", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        marginTop: "20px",
        border: "1px solid #a5d6a7"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🔍 Redirect URI Mismatch Detected</h3>
        <p style={{ margin: "0 0 10px 0" }}>
          Based on our testing, we've identified that the Google OAuth configuration likely has incorrect redirect URIs.
          This is a common issue that causes authentication to fail with 500 errors or redirect problems.
        </p>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 1: Check Your Google Cloud Console</h2>
        <p>
          Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console Credentials page</a> and select your OAuth 2.0 Client ID.
        </p>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 2: Update Authorized Redirect URIs</h2>
        <p>
          Make sure the following URLs are added to the "Authorized redirect URIs" section:
        </p>
        
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "4px", 
          marginTop: "10px",
          position: "relative"
        }}>
          <pre style={{ margin: 0, wordBreak: "break-all" }}>
            https://www.cliffordclassroom.com/api/auth/callback/google
          </pre>
          <button 
            onClick={() => handleCopy("https://www.cliffordclassroom.com/api/auth/callback/google")}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: copied ? "#4CAF50" : "#2196F3",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <p style={{ marginTop: "15px" }}>
          If you're also testing on localhost, add this URL as well:
        </p>
        
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "4px", 
          marginTop: "10px",
          position: "relative"
        }}>
          <pre style={{ margin: 0, wordBreak: "break-all" }}>
            http://localhost:3000/api/auth/callback/google
          </pre>
          <button 
            onClick={() => handleCopy("http://localhost:3000/api/auth/callback/google")}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: copied ? "#4CAF50" : "#2196F3",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 3: Check JavaScript Origins</h2>
        <p>
          Make sure the following URLs are added to the "Authorized JavaScript origins" section:
        </p>
        
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "4px", 
          marginTop: "10px",
          position: "relative"
        }}>
          <pre style={{ margin: 0, wordBreak: "break-all" }}>
            https://www.cliffordclassroom.com
          </pre>
          <button 
            onClick={() => handleCopy("https://www.cliffordclassroom.com")}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: copied ? "#4CAF50" : "#2196F3",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <p style={{ marginTop: "15px" }}>
          If you're also testing on localhost, add this URL as well:
        </p>
        
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "4px", 
          marginTop: "10px",
          position: "relative"
        }}>
          <pre style={{ margin: 0, wordBreak: "break-all" }}>
            http://localhost:3000
          </pre>
          <button 
            onClick={() => handleCopy("http://localhost:3000")}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: copied ? "#4CAF50" : "#2196F3",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Step 4: Save Changes and Test</h2>
        <p>
          After saving the changes in Google Cloud Console, it may take a few minutes for the changes to propagate.
          Once they do, try the authentication again using the buttons below:
        </p>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
          <a 
            href="/api/auth/signin/google"
            style={{ 
              backgroundColor: "#4285F4", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Sign In with Google (Direct)
          </a>
          
          <a 
            href="/nextauth-debug"
            style={{ 
              backgroundColor: "#34A853", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            NextAuth Debug Page
          </a>
        </div>
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>Common Issues</h2>
        <ul>
          <li><strong>Redirect URI Mismatch:</strong> This error occurs when the redirect URI in your Google OAuth configuration doesn't match the one used by NextAuth.</li>
          <li><strong>HTTP 500 Errors:</strong> Often caused by incorrect environment variables or OAuth configuration issues.</li>
          <li><strong>Unexpected end of JSON input:</strong> This can happen when the OAuth provider returns an error that NextAuth can't parse properly.</li>
        </ul>
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