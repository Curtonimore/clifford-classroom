'use client';

import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CheckAdminPage() {
  const { data: session, status } = useSession();
  const { hasRole } = useAppContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminSource, setAdminSource] = useState<'session' | 'localStorage' | null>(null);

  useEffect(() => {
    // Check for admin status from multiple sources
    if (status === 'authenticated') {
      // Check session first
      const sessionAdmin = hasRole('admin');
      
      // Then check localStorage (our workaround for MongoDB issues)
      const localStorageAdmin = typeof window !== 'undefined' && 
        localStorage.getItem('user_role') === 'admin' && 
        localStorage.getItem('admin_email') === session?.user?.email;
      
      if (sessionAdmin) {
        setIsAdmin(true);
        setAdminSource('session');
      } else if (localStorageAdmin) {
        setIsAdmin(true);
        setAdminSource('localStorage');
      } else {
        setIsAdmin(false);
        setAdminSource(null);
      }
    }
  }, [status, hasRole, session]);

  if (status === 'loading') {
    return (
      <div className="container">
        <h1>Checking Admin Status</h1>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container">
        <h1>Not Signed In</h1>
        <p>Please sign in to check your admin status.</p>
        <Link href="/api/auth/signin" className="button">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Status Check</h1>
      
      <div className="user-info">
        <img 
          src={session?.user?.image || 'https://via.placeholder.com/80'} 
          alt={session?.user?.name || 'User'} 
          className="avatar"
        />
        <div>
          <h2>{session?.user?.name || 'User'}</h2>
          <p>{session?.user?.email}</p>
          <p className="role">
            Role: <strong>{(session?.user as any)?.role || 'user'}</strong>
            {adminSource === 'localStorage' && <span className="local-badge">Local Storage</span>}
          </p>
        </div>
      </div>
      
      <div className={`status ${isAdmin ? 'success' : 'error'}`}>
        {isAdmin ? (
          <>
            <h2>✅ You have admin privileges!</h2>
            {adminSource === 'localStorage' ? (
              <p>Admin privileges are from localStorage (MongoDB workaround). This works for development but won't persist across different browsers or devices.</p>
            ) : (
              <p>You can now access the admin dashboard and manage your application.</p>
            )}
            <Link href="/admin" className="button">Go to Admin Dashboard</Link>
          </>
        ) : (
          <>
            <h2>❌ You do not have admin privileges.</h2>
            <p>The admin setup process may not have completed successfully.</p>
            <div className="button-group">
              <Link href="/admin/setup-admin" className="button">Try Standard Setup</Link>
              <Link href="/admin/setup-local" className="button green">Try Local Storage Setup</Link>
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          color: #2d3748;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 1.2rem;
          color: #4a5568;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          background-color: #f7fafc;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 1.5rem;
        }
        
        .role {
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }
        
        .local-badge {
          display: inline-block;
          background-color: #f6ad55;
          color: #fff;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          margin-left: 8px;
          vertical-align: middle;
        }
        
        .status {
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 2rem;
          text-align: center;
        }
        
        .success {
          background-color: #f0fff4;
          border: 1px solid #c6f6d5;
        }
        
        .error {
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1rem;
        }
        
        .button {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .button:hover {
          background-color: #3182ce;
        }
        
        .button.green {
          background-color: #48bb78;
        }
        
        .button.green:hover {
          background-color: #38a169;
        }
      `}</style>
    </div>
  );
} 