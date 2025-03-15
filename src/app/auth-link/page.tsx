export default function AuthLinkPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>NextAuth Direct Links</h1>
      
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
        </ul>
      </div>
    </div>
  );
} 