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
              href="/api/test-endpoint"
              style={{ 
                backgroundColor: "#009688", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Test Endpoint
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginTop: "30px" }}>
        <a 
          href="/"
          style={{ 
            color: "#4285F4", 
            textDecoration: "none"
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
} 