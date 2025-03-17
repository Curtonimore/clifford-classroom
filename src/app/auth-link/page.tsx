export default function AuthLinkPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>NextAuth Direct Links</h1>
      
      <div style={{ 
        backgroundColor: "#e8f5e9", 
        color: "#2e7d32", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        marginTop: "20px",
        border: "1px solid #a5d6a7"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🔍 Configuration Issue Detected</h3>
        <p style={{ margin: "0 0 10px 0" }}>We've identified a potential issue with your Google OAuth configuration. The redirect URI mismatch is likely causing authentication failures.</p>
        <a 
          href="/google-oauth-fix"
          style={{ 
            backgroundColor: "#4CAF50", 
            color: "white", 
            padding: "10px 15px", 
            borderRadius: "4px", 
            textDecoration: "none",
            display: "inline-block",
            fontWeight: "bold"
          }}
        >
          View Fix Instructions
        </a>
      </div>
      
      <div style={{ 
        backgroundColor: "#e3f2fd", 
        color: "#0d47a1", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        marginTop: "20px",
        border: "1px solid #90caf9"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>⚠️ HTTP 405 Error Detected</h3>
        <p style={{ margin: "0 0 10px 0" }}>You're experiencing HTTP 405 (Method Not Allowed) errors, which suggests an issue with how your server is handling API requests.</p>
        <a 
          href="/nextauth-test"
          style={{ 
            backgroundColor: "#2196F3", 
            color: "white", 
            padding: "10px 15px", 
            borderRadius: "4px", 
            textDecoration: "none",
            display: "inline-block",
            fontWeight: "bold"
          }}
        >
          Test API Methods
        </a>
      </div>
      
      <div style={{ 
        backgroundColor: "#ffebee", 
        color: "#c62828", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        marginTop: "20px",
        border: "1px solid #ef9a9a"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🛠️ Middleware Fix Applied</h3>
        <p style={{ margin: "0 0 10px 0" }}>We've updated the middleware to explicitly skip NextAuth API routes. This should fix the HTTP 405 errors.</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <a 
            href="/simple-auth"
            style={{ 
              backgroundColor: "#F44336", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "bold"
            }}
          >
            Try Simple Auth Page
          </a>
          <a 
            href="/api/auth-simple"
            style={{ 
              backgroundColor: "#D32F2F", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "bold"
            }}
          >
            Check Auth Simple Endpoint
          </a>
        </div>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h2>Sign In Links</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth/signin"
              style={{ 
                backgroundColor: "#4285F4", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              NextAuth Sign In Page
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth/signin/google"
              style={{ 
                backgroundColor: "#34A853", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Sign In with Google (Direct)
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth/session"
              style={{ 
                backgroundColor: "#FBBC05", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Check Session
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth/signout"
              style={{ 
                backgroundColor: "#EA4335", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Sign Out
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginTop: "30px" }}>
        <h2>Debug Pages</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/simple-auth"
              style={{ 
                backgroundColor: "#4CAF50", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Simple Auth Test
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/nextauth-test"
              style={{ 
                backgroundColor: "#1976D2", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              NextAuth API Method Test
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/google-oauth-fix"
              style={{ 
                backgroundColor: "#8BC34A", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Google OAuth Fix
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/direct-google"
              style={{ 
                backgroundColor: "#9C27B0", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Hardcoded Google OAuth
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/direct-oauth"
              style={{ 
                backgroundColor: "#FF5722", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Direct Google OAuth Test
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/method-test"
              style={{ 
                backgroundColor: "#E91E63", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              HTTP Method Test
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/login-debug"
              style={{ 
                backgroundColor: "#673AB7", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Login Debug Page
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/direct-login"
              style={{ 
                backgroundColor: "#3F51B5", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Direct Login Page
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginTop: "30px" }}>
        <h2>API Endpoints</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-simple"
              style={{ 
                backgroundColor: "#FF5722", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Auth Simple Endpoint
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-direct-test/session"
              style={{ 
                backgroundColor: "#C2185B", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Direct NextAuth Session
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/nextauth-test"
              style={{ 
                backgroundColor: "#00838F", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              NextAuth Test API
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/env-check"
              style={{ 
                backgroundColor: "#009688", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Environment Check
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-test"
              style={{ 
                backgroundColor: "#00BCD4", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Auth Test
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/auth-config-check"
              style={{ 
                backgroundColor: "#2196F3", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Auth Config Check
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/api/method-test"
              style={{ 
                backgroundColor: "#03A9F4", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Method Test API
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginTop: "30px", marginBottom: "50px" }}>
        <h3>Troubleshooting Tips</h3>
        <ul>
          <li>If you're seeing 405 errors, check that your API routes are correctly handling both GET and POST methods.</li>
          <li>If you're seeing 500 errors, check your environment variables and server logs.</li>
          <li>If the login button doesn't work, check for JavaScript errors in the console.</li>
          <li>The Environment Check endpoint will show you if your environment variables are set correctly.</li>
          <li><strong>Redirect URI Mismatch:</strong> Make sure the redirect URIs in your Google Cloud Console match the ones used by your application.</li>
          <li><strong>Middleware Issues:</strong> Make sure your middleware is not interfering with NextAuth API routes.</li>
        </ul>
      </div>
    </div>
  );
} 