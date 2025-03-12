'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { setCurrentPath } = useAppContext();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setCurrentPath('profile', '');
    
    // Check if user is authenticated
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [setCurrentPath, status]);
  
  // Show loading state while checking authentication
  if (isLoading || status === 'loading') {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/profile');
    return null;
  }
  
  // Extract user data
  const { name, email, image } = session.user || {};
  const userRole = session.user.role || 'user';
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Your Profile</h1>
        <p className="page-description">
          Manage your account and preferences
        </p>
      </header>
      
      <section className="content-section">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {image ? (
                <Image 
                  src={image} 
                  alt={name || 'User'} 
                  width={100} 
                  height={100}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{name || 'User'}</h2>
              <p className="profile-email">{email}</p>
              <div className="profile-role">
                <span className={`role-badge role-${userRole}`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="profile-sections">
            <div className="profile-section">
              <h3>Account Information</h3>
              <div className="profile-field">
                <div className="field-label">Name</div>
                <div className="field-value">{name || 'Not provided'}</div>
              </div>
              <div className="profile-field">
                <div className="field-label">Email</div>
                <div className="field-value">{email}</div>
              </div>
              <div className="profile-field">
                <div className="field-label">Member Since</div>
                <div className="field-value">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="profile-field">
                <div className="field-label">Account Type</div>
                <div className="field-value">
                  {userRole === 'admin' 
                    ? 'Administrator' 
                    : userRole === 'premium' 
                      ? 'Premium User' 
                      : 'Standard User'}
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h3>Your Activity</h3>
              <div className="profile-field">
                <div className="field-label">Lesson Plans Created</div>
                <div className="field-value">12</div>
              </div>
              <div className="profile-field">
                <div className="field-label">Last Login</div>
                <div className="field-value">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <Link href="/settings" className="profile-button primary">
              Edit Profile
            </Link>
            <Link href="/settings/subscription" className="profile-button secondary">
              Manage Subscription
            </Link>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .profile-loading {
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
        
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eaeaea;
        }
        
        .profile-avatar {
          margin-right: 2rem;
        }
        
        .avatar-image {
          border-radius: 50%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #0070f3;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
        }
        
        .profile-info h2 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.75rem;
        }
        
        .profile-email {
          color: #666;
          margin-bottom: 0.75rem;
        }
        
        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .role-admin {
          background-color: #9333ea;
          color: white;
        }
        
        .role-premium {
          background-color: #0070f3;
          color: white;
        }
        
        .role-user {
          background-color: #e5e7eb;
          color: #374151;
        }
        
        .profile-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .profile-section {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .profile-section h3 {
          margin-top: 0;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eaeaea;
          font-size: 1.25rem;
          color: #333;
        }
        
        .profile-field {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .field-label {
          font-weight: 500;
          color: #666;
        }
        
        .field-value {
          color: #333;
        }
        
        .profile-actions {
          display: flex;
          gap: 1rem;
        }
        
        .profile-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s, opacity 0.2s;
        }
        
        .profile-button.primary {
          background-color: #0070f3;
          color: white;
        }
        
        .profile-button.primary:hover {
          background-color: #0053b3;
        }
        
        .profile-button.secondary {
          background-color: white;
          color: #333;
          border: 1px solid #d1d5db;
        }
        
        .profile-button.secondary:hover {
          background-color: #f9fafb;
        }
        
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
          
          .profile-avatar {
            margin-right: 0;
            margin-bottom: 1.5rem;
          }
          
          .profile-sections {
            grid-template-columns: 1fr;
          }
          
          .profile-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
} 