'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SettingsPage() {
  const { setCurrentPath, showNotification } = useAppContext();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setCurrentPath('settings', '');
    
    // Initialize form with session data
    if (session?.user) {
      setDisplayName(session.user.name || '');
      setImagePreview(session.user.image || null);
    }
    
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [setCurrentPath, session, status]);
  
  // Show loading state while checking authentication
  if (isLoading || status === 'loading') {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/settings');
    return null;
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image too large. Maximum size is 5MB.');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('Invalid file type. Please upload an image.');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      showNotification('Display name cannot be empty');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('displayName', displayName);
      
      // Add image if there's a preview and it's different from the original
      if (imagePreview && imagePreview !== session.user.image) {
        // If it's a data URL (newly uploaded image)
        if (imagePreview.startsWith('data:')) {
          const response = await fetch(imagePreview);
          const blob = await response.blob();
          formData.append('profileImage', blob, 'profile-image.jpg');
        }
      }
      
      // Handle case where image was removed
      if (!imagePreview && session.user.image) {
        formData.append('removeImage', 'true');
      }
      
      // Send update request
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
      
      const result = await response.json();
      
      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session.user,
          name: displayName,
          image: result.imageUrl || session.user.image,
        }
      });
      
      showNotification('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showNotification(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-description">
          Update your profile information
        </p>
      </header>
      
      <section className="content-section">
        <div className="settings-container">
          <div className="settings-sidebar">
            <nav className="settings-nav">
              <Link href="/settings" className="settings-nav-item active">
                Profile
              </Link>
              <Link href="/settings/account" className="settings-nav-item">
                Account
              </Link>
              <Link href="/settings/subscription" className="settings-nav-item">
                Subscription
              </Link>
              <Link href="/settings/notifications" className="settings-nav-item">
                Notifications
              </Link>
            </nav>
          </div>
          
          <div className="settings-content">
            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="displayName" className="form-label">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="form-input"
                  placeholder="Your display name"
                  required
                />
                <p className="form-help">This name will be visible to other users</p>
              </div>
              
              <div className="form-group">
                <label className="form-label">Profile Picture</label>
                
                <div className="profile-image-container">
                  <div className="profile-image-preview">
                    {imagePreview ? (
                      <Image 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        width={120} 
                        height={120}
                        className="preview-image"
                      />
                    ) : (
                      <div className="preview-placeholder">
                        {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  
                  <div className="profile-image-actions">
                    <label htmlFor="profileImage" className="upload-button">
                      Choose Image
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden-input"
                    />
                    {imagePreview && (
                      <button 
                        type="button" 
                        onClick={handleRemoveImage}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <p className="form-help">JPEG, PNG or GIF. Maximum size 5MB.</p>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link href="/profile" className="cancel-button">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .settings-loading {
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
        
        .settings-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          gap: 2rem;
        }
        
        .settings-sidebar {
          width: 200px;
          flex-shrink: 0;
        }
        
        .settings-content {
          flex: 1;
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .settings-nav-item {
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .settings-nav-item:hover {
          background: #f3f4f6;
          color: #111827;
        }
        
        .settings-nav-item.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }
        
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          font-weight: 500;
          color: #4b5563;
        }
        
        .form-input {
          padding: 0.625rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          width: 100%;
          max-width: 400px;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        
        .form-help {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }
        
        .profile-image-container {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 0.5rem;
        }
        
        .profile-image-preview {
          width: 120px;
          height: 120px;
          border-radius: 9999px;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d5db;
        }
        
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .preview-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: bold;
          color: #6b7280;
          background: #e5e7eb;
        }
        
        .profile-image-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .hidden-input {
          display: none;
        }
        
        .upload-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #bfdbfe;
          text-align: center;
        }
        
        .upload-button:hover {
          background: #dbeafe;
        }
        
        .remove-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #fecaca;
          text-align: center;
        }
        
        .remove-button:hover {
          background: #fee2e2;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .save-button {
          padding: 0.625rem 1.25rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .save-button:hover {
          background: #1d4ed8;
        }
        
        .save-button:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        
        .cancel-button {
          padding: 0.625rem 1.25rem;
          background: white;
          color: #4b5563;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-weight: 500;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
        }
        
        .cancel-button:hover {
          background: #f3f4f6;
          color: #111827;
        }
        
        @media (max-width: 768px) {
          .settings-container {
            flex-direction: column;
          }
          
          .settings-sidebar {
            width: 100%;
          }
          
          .settings-nav {
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .settings-nav-item {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
          
          .profile-image-container {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
} 