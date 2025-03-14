'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function ForceAdminPage() {
  const { data: session, status } = useSession();
  const { showNotification } = useAppContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  
  const makeAdmin = async () => {
    if (!session?.user) {
      showNotification('You must be logged in to use this feature');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          force: process.env.NODE_ENV === 'development'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: data.message || 'Admin role assigned successfully'
        });
        showNotification('Admin role assigned! Sign out and back in to apply changes.');
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to assign admin role'
        });
        showNotification('Error assigning admin role');
      }
    } catch (error) {
      console.error('Error making admin:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      showNotification('Error assigning admin role');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Automatically check admin status on page load
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('Force Admin Page: User authenticated, checking admin status');
      
      // Check if user email is in ADMIN_EMAILS (done on client side for convenience)
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];
      const isAllowedAdmin = adminEmails.includes(session.user.email?.toLowerCase() || '');
      
      console.log('Force Admin Page: Admin check', {
        configuredAdmins: adminEmails,
        userEmail: session.user.email?.toLowerCase(),
        isAllowedAdmin
      });
      
      // If user should be an admin but isn't currently, offer to make them admin
      if (isAllowedAdmin) {
        console.log('Force Admin Page: User is allowed to be admin');
      }
    }
  }, [status, session]);
  
  if (status === 'loading') {
    return (
      <div className="admin-setup-container">
        <h1>Checking Authentication...</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return (
      <div className="admin-setup-container">
        <h1>Authentication Required</h1>
        <p>You need to be logged in to access this page.</p>
        <Link href="/api/auth/signin" className="auth-button">
          Sign In
        </Link>
      </div>
    );
  }
  
  return (
    <div className="admin-setup-container">
      <h1>Admin Access Setup</h1>
      
      <div className="user-info">
        <p><strong>Current User:</strong> {session?.user?.name}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Current Role:</strong> {session?.user?.role || 'user'}</p>
      </div>
      
      {result && (
        <div className={`result-box ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <div>
              <h3>Success!</h3>
              <p>{result.message}</p>
              <div className="actions">
                <Link href="/api/auth/signout" className="auth-button">
                  Sign Out
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h3>Error</h3>
              <p>{result.error}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="setup-actions">
        <button 
          onClick={makeAdmin} 
          disabled={isLoading || result?.success}
          className="admin-button"
        >
          {isLoading ? 'Processing...' : 'Assign Admin Role'}
        </button>
        
        <Link href="/" className="cancel-link">
          Return to Home
        </Link>
      </div>
      
      <div className="info-box">
        <h3>How This Works</h3>
        <p>This page will set your account as an admin if your email matches the configured admin emails in the environment variables.</p>
        <p>After becoming an admin, sign out and sign back in to apply the changes.</p>
        <p>You will then have access to the admin dashboard and other administrator features.</p>
      </div>
      
      <style jsx>{`
        .admin-setup-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          color: var(--accent, #1B4332);
          margin-bottom: 1.5rem;
        }
        
        .user-info {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 2rem;
        }
        
        .setup-actions {
          display: flex;
          gap: 1rem;
          margin: 2rem 0;
        }
        
        .admin-button {
          background-color: var(--accent, #1B4332);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .admin-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .auth-button {
          display: inline-block;
          background-color: #4285f4;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
        }
        
        .cancel-link {
          display: inline-block;
          color: #666;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
        }
        
        .result-box {
          padding: 1rem;
          border-radius: 4px;
          margin: 1rem 0;
        }
        
        .success {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }
        
        .error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
        
        .info-box {
          background-color: #e7f5ff;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 2rem;
        }
        
        .actions {
          margin-top: 1rem;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid var(--accent, #1B4332);
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin: 2rem auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 