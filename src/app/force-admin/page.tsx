'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ForceAdminPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    async function setupAdmin() {
      try {
        // Step 1: Log current status
        console.log('Current session:', session);
        setMessage('Setting up admin access...');
        
        // Step 2: Store admin role in localStorage
        localStorage.setItem('user_role', 'admin');
        if (session?.user?.email) {
          localStorage.setItem('admin_email', session.user.email);
        }
        
        // Step 3: Try to update the session
        if (session) {
          try {
            await update({ role: 'admin' });
            console.log('Session updated');
          } catch (err) {
            console.error('Error updating session:', err);
          }
        }
        
        // Step 4: Set success status
        setStatus('success');
        setMessage('Admin access granted! Redirecting to profile page...');
        
        // Step 5: Redirect after a delay
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } catch (error) {
        console.error('Error setting up admin:', error);
        setStatus('error');
        setMessage('Error setting up admin access. Check console for details.');
      }
    }
    
    setupAdmin();
  }, [session, update, router]);
  
  return (
    <div className="admin-force-container">
      <div className="admin-force-card">
        <h1>Force Admin Setup</h1>
        <p>This page automatically attempts to grant admin access through multiple methods.</p>
        
        <div className={`status-message ${status}`}>
          {message}
        </div>
        
        {status === 'success' && (
          <div className="success-actions">
            <button 
              onClick={() => router.push('/profile')}
              className="action-button"
            >
              Go to Profile Page
            </button>
            <button 
              onClick={() => router.push('/admin')}
              className="action-button"
            >
              Go to Admin Dashboard
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="error-actions">
            <button 
              onClick={() => window.location.reload()}
              className="action-button"
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push('/admin/setup-local')}
              className="action-button"
            >
              Go to Manual Setup
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .admin-force-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
          background-color: #f7fafc;
        }
        
        .admin-force-card {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        h1 {
          color: #2d3748;
          margin-bottom: 1rem;
        }
        
        p {
          color: #4a5568;
          margin-bottom: 1.5rem;
        }
        
        .status-message {
          margin: 1.5rem 0;
          padding: 1rem;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .idle {
          background-color: #ebf8ff;
          color: #2b6cb0;
        }
        
        .success {
          background-color: #f0fff4;
          color: #2f855a;
        }
        
        .error {
          background-color: #fff5f5;
          color: #c53030;
        }
        
        .success-actions, .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }
        
        .action-button {
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .action-button:hover {
          background-color: #3182ce;
        }
      `}</style>
    </div>
  );
} 