export default function AuthLinkPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Clifford Classroom</h1>
      
      <div style={{ 
        backgroundColor: "#e3f2fd", 
        color: "#0d47a1", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        marginTop: "20px",
        border: "1px solid #90caf9"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🎉 Lesson Plan Generator</h3>
        <p style={{ margin: "0 0 10px 0" }}>Create customized AI-powered lesson plans with our easy-to-use generator. No login required!</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a 
            href="/lesson-plan"
            style={{ 
              backgroundColor: "#1565C0", 
              color: "white", 
              padding: "10px 15px", 
              borderRadius: "4px", 
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "bold"
            }}
          >
            Create Lesson Plans
          </a>
        </div>
      </div>
      
      <div style={{ marginTop: "30px" }}>
        <h2>Helpful Tools</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/lesson-plan"
              style={{ 
                backgroundColor: "#4CAF50", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              AI Lesson Plan Generator
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a 
              href="/"
              style={{ 
                backgroundColor: "#1976D2", 
                color: "white", 
                padding: "10px 15px", 
                borderRadius: "4px", 
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Home Page
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginTop: "30px", marginBottom: "50px" }}>
        <h3>Welcome to Clifford Classroom!</h3>
        <p>
          This education platform provides AI-powered tools to help teachers create engaging content.
          The Lesson Plan Generator is available for everyone to use without requiring a login.
        </p>
      </div>
    </div>
  );
} 