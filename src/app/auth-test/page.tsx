'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch debug info when the page loads
    fetchDebugInfo();
  }, []);

  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/auth-debug');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDebugInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error('Error fetching debug info:', err);
    }
  };

  const handleLogin = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: window.location.href });
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Authentication Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h2>Session Status: {status}</h2>
        {status === 'authenticated' && session ? (
          <div>
            <p><strong>Logged in as:</strong> {session.user?.email}</p>
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Role:</strong> {session.user?.role || 'No role'}</p>
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: '#f44336', 
                color: 'white', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Sign Out
            </button>
          </div>
        ) : status === 'loading' ? (
          <p>Loading session...</p>
        ) : (
          <div>
            <p>Not signed in</p>
            <button 
              onClick={handleLogin}
              style={{ 
                backgroundColor: '#4285F4', 
                color: 'white', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Debug Information</h2>
        <button 
          onClick={fetchDebugInfo}
          style={{ 
            backgroundColor: '#4caf50', 
            color: 'white', 
            border: 'none', 
            padding: '10px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Refresh Debug Info
        </button>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px', 
          fontFamily: 'monospace',
          fontSize: '14px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <pre>{debugInfo ? JSON.stringify(debugInfo, null, 2) : 'Loading...'}</pre>
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Helpful Links</h2>
        <ul>
          <li><a href="/api/auth-debug" target="_blank">View Debug API Response</a></li>
          <li><a href="/api/debug-auth" target="_blank">Alternative Debug Endpoint</a></li>
          <li><a href="/debug-login" target="_blank">Debug Login Page</a></li>
          <li><a href="/" target="_blank">Return to Home</a></li>
        </ul>
      </div>
    </div>
  );
} 