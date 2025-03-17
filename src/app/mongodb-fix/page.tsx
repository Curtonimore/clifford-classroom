export default function MongoDBFixPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>MongoDB Connection Fix</h1>
      
      <div style={{ 
        backgroundColor: "#ffebee", 
        color: "#c62828", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        border: "1px solid #ef9a9a"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>⚠️ MongoDB Client Is Null</h3>
        <p style={{ margin: "0" }}>
          Your application is experiencing a MongoDB connection issue. The MongoDB client is null, which is causing authentication failures when using the MongoDB adapter with NextAuth.
        </p>
      </div>
      
      <h2>The Problem</h2>
      <p>
        When you see the error <code style={{ backgroundColor: "#f5f5f5", padding: "3px 6px", borderRadius: "3px" }}>MongoDB client is null</code>, 
        it typically means one of the following issues:
      </p>
      
      <ol style={{ lineHeight: "1.6" }}>
        <li>
          <strong>Environment Variables Issue:</strong> The <code>MONGODB_URI</code> environment variable is not properly defined
          or is not being loaded correctly.
        </li>
        <li>
          <strong>Connection Timing Problem:</strong> The MongoDB client is being used before it's fully initialized.
        </li>
        <li>
          <strong>Network Access Issue:</strong> Your MongoDB Atlas cluster might have network access restrictions
          that are preventing your application from connecting.
        </li>
        <li>
          <strong>Invalid Connection String:</strong> The connection string format might be incorrect.
        </li>
      </ol>
      
      <h2>How to Fix It</h2>
      
      <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h3>1. Verify Your Environment Variables</h3>
        <p>Ensure that your <code>.env.local</code> file includes a valid MongoDB connection string:</p>
        <pre style={{ backgroundColor: "#e0e0e0", padding: "15px", borderRadius: "4px", overflowX: "auto" }}>
{`# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`}
        </pre>
      </div>
      
      <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h3>2. Check MongoDB Atlas Network Access</h3>
        <p>Make sure your MongoDB Atlas cluster allows connections from your IP address:</p>
        <ol style={{ lineHeight: "1.6" }}>
          <li>Log in to your <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer">MongoDB Atlas account</a></li>
          <li>Navigate to your cluster</li>
          <li>Click on the "Network Access" tab in the left sidebar</li>
          <li>Click "Add IP Address" and either add your specific IP or use "0.0.0.0/0" to allow all IPs (not recommended for production)</li>
        </ol>
      </div>
      
      <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h3>3. Restart Your Development Server</h3>
        <p>After making changes to environment variables, restart your Next.js development server:</p>
        <pre style={{ backgroundColor: "#e0e0e0", padding: "15px", borderRadius: "4px", overflowX: "auto" }}>
{`# Stop the current server (Ctrl+C) and then run:
npm run dev`}
        </pre>
      </div>
      
      <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h3>4. Use the Database-Free Authentication</h3>
        <p>
          While you're fixing MongoDB issues, you can use the database-free authentication approach we've set up.
          This uses JWT storage only (no database) and lets you test the authentication flow independently.
        </p>
        <div style={{ marginTop: "15px" }}>
          <a 
            href="/auth-direct-test"
            style={{ 
              backgroundColor: "#3949AB", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "bold"
            }}
          >
            Try Database-Free Authentication
          </a>
        </div>
      </div>
      
      <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h3>5. Check Connection Status</h3>
        <p>
          Use our diagnostic tools to check your MongoDB connection status and NextAuth configuration:
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
          <a 
            href="/api/db-connection-test"
            style={{ 
              backgroundColor: "#673AB7", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Test MongoDB Connection
          </a>
          <a 
            href="/api/auth-handler-check"
            style={{ 
              backgroundColor: "#6200EA", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Check Auth Handlers
          </a>
        </div>
      </div>
      
      <div style={{ margin: "30px 0", textAlign: "center" }}>
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
  );
} 