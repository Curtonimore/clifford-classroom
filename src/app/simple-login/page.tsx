"use client";

import { signIn } from "next-auth/react";

export default function SimpleLoginPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Ultra Simple Login</h1>
      
      <p style={{ marginBottom: "20px" }}>
        This is a minimal login page with no fancy code.
      </p>
      
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        style={{
          background: "#4285F4",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Sign in with Google (Direct)
      </button>
      
      <div style={{ marginTop: "20px" }}>
        <pre>
          Current URL: {typeof window !== 'undefined' ? window.location.href : ''}
        </pre>
      </div>
    </div>
  );
} 