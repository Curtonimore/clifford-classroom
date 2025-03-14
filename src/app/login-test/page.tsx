"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginTestPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      console.log("Starting sign in process...");
      const result = await signIn("google", { 
        redirect: false,
        callbackUrl: window.location.origin
      });
      
      console.log("Sign in result:", result);
      
      if (!result?.ok) {
        setErrorMsg(`Error: ${result?.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMsg(`Exception: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: window.location.href });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Login Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
        <p className="mb-2">
          Status: <span className="font-medium">{status}</span>
        </p>
        
        {loading && (
          <div className="text-blue-600 mb-4">
            Loading... (Check browser console for details)
          </div>
        )}
        
        {errorMsg && (
          <div className="text-red-600 mb-4 p-2 bg-red-50 border border-red-200 rounded">
            {errorMsg}
          </div>
        )}
        
        <div className="mb-4 overflow-auto max-h-60">
          <pre className="text-xs bg-gray-800 text-gray-200 p-3 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        {session ? (
          <>
            <p>You are signed in as {session.user?.email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p>You are not signed in.</p>
            <button
              onClick={handleSignIn}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign in with Google"}
            </button>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Troubleshooting Info:</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</li>
                <li>Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</li>
                <li>NextAuth URL: Configured in your Vercel environment</li>
              </ul>
            </div>
          </>
        )}
      </div>
      
      <Link href="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  );
} 