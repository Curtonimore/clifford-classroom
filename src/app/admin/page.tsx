'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { setCurrentPath, hasRole, showNotification } = useAppContext();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isLocalAdmin, setIsLocalAdmin] = useState(false);
  
  useEffect(() => {
    setCurrentPath('admin', '');
    
    // Check if user is authenticated and has admin role
    if (status !== 'loading') {
      setIsLoading(false);
      
      // Check if this is a local admin workaround
      if (typeof window !== 'undefined' && 
          localStorage.getItem('user_role') === 'admin' && 
          localStorage.getItem('admin_email') === session?.user?.email) {
        setIsLocalAdmin(true);
      }
    }
  }, [setCurrentPath, status, session]);
  
  // Show loading state while checking authentication
  if (isLoading || status === 'loading') {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }
  
  // Redirect if not authenticated or not admin
  if (!session || !hasRole('admin')) {
    redirect('/auth/signin?error=AccessDenied');
    return null;
  }
  
  // Show local admin notice if applicable
  if (isLocalAdmin) {
    showNotification('You are using local admin privileges (MongoDB workaround)');
  }
  
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        {isLocalAdmin && (
          <div className="admin-notice">
            <strong>Notice:</strong> You are using the localStorage admin workaround. 
            This is only for development and won't work in production or across devices.
          </div>
        )}
      </header>
      
      <div className="admin-cards">
        <Link href="/admin/dashboard" className="admin-card">
          <h2>User Management</h2>
          <p>Manage users, roles and permissions</p>
        </Link>
        
        <Link href="/admin/lesson-plans" className="admin-card">
          <h2>Lesson Plans</h2>
          <p>Manage all saved lesson plans</p>
        </Link>
        
        <Link href="/admin/ai-usage" className="admin-card">
          <h2>AI Usage</h2>
          <p>Track AI credits and usage patterns</p>
        </Link>
        
        <Link href="/admin/settings" className="admin-card">
          <h2>Settings</h2>
          <p>Configure application settings</p>
        </Link>
      </div>
      
      <style jsx>{`
        .admin-layout {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .admin-header {
          margin-bottom: 2rem;
        }
        
        .admin-header h1 {
          font-size: 2rem;
          color: #2d3748;
        }
        
        .admin-notice {
          background-color: #fefcbf;
          border-left: 4px solid #f6e05e;
          padding: 1rem;
          margin-top: 1rem;
          border-radius: 4px;
        }
        
        .admin-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .admin-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          color: inherit;
        }
        
        .admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .admin-card h2 {
          font-size: 1.25rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .admin-card p {
          color: #718096;
        }
        
        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 