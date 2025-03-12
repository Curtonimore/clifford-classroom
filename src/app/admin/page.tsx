'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { setCurrentPath, hasRole } = useAppContext();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setCurrentPath('admin', '');
    
    // Check if user is authenticated and has admin role
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [setCurrentPath, status]);
  
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
  
  // Render dashboard for admin users
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-description">
          Manage your site settings and user permissions
        </p>
      </header>
      
      <section className="content-section">
        <div className="admin-grid">
          <div className="admin-card">
            <h2>User Management</h2>
            <p>Manage users, roles, and permissions</p>
            <Link href="/admin/users" className="admin-button">
              Manage Users
            </Link>
          </div>
          
          <div className="admin-card">
            <h2>Content Management</h2>
            <p>Create and edit site content</p>
            <Link href="/admin/content" className="admin-button">
              Manage Content
            </Link>
          </div>
          
          <div className="admin-card">
            <h2>Site Settings</h2>
            <p>Configure website settings</p>
            <Link href="/admin/settings" className="admin-button">
              Manage Settings
            </Link>
          </div>
          
          <div className="admin-card">
            <h2>Analytics</h2>
            <p>View site usage statistics</p>
            <Link href="/admin/analytics" className="admin-button">
              View Analytics
            </Link>
          </div>
        </div>
        
        <div className="admin-stats">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">42</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">128</div>
              <div className="stat-label">Lesson Plans</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">56</div>
              <div className="stat-label">New Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">12k</div>
              <div className="stat-label">Page Views</div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
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
          border: 4px solid rgba(0, 112, 243, 0.2);
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .admin-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .admin-card h2 {
          margin-top: 0;
          font-size: 1.25rem;
          color: #333;
        }
        
        .admin-card p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .admin-button {
          display: inline-block;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 0.25rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .admin-button:hover {
          background-color: #0053b3;
        }
        
        .admin-stats {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .admin-stats h2 {
          margin-top: 0;
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 1.5rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
        
        .stat-card {
          background-color: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #0070f3;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .admin-grid, .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
} 