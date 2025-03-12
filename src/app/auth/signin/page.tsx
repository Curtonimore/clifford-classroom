'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function SignIn() {
  const { setCurrentPath } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  
  useEffect(() => {
    setCurrentPath('auth', 'signin');
    
    // Check for error in URL
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'AccessDenied':
          setError('Access denied. You may not have permission to sign in.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Email already exists with a different provider.');
          break;
        default:
          setError('An error occurred during sign in. Please try again.');
      }
    }
  }, [setCurrentPath, searchParams]);
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Sign In</h1>
        <p className="page-description">
          Sign in to access all features of Clifford Classroom
        </p>
      </header>
      
      <section className="content-section">
        <div className="auth-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="auth-text">Sign in with your Google account to continue.</p>
            
            <button 
              onClick={handleGoogleSignIn} 
              className="google-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <Image 
                    src="/images/google-logo.svg" 
                    alt="Google logo" 
                    width={20} 
                    height={20}
                    onError={(e) => {
                      // Fallback if image is missing
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
            
            <p className="auth-info">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="auth-link">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="auth-link">Privacy Policy</Link>.
            </p>
          </div>
          
          <div className="auth-help">
            <p>Having trouble signing in? <Link href="/support" className="auth-link">Contact Support</Link></p>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .auth-container {
          max-width: 450px;
          margin: 2rem auto;
        }
        
        .auth-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .auth-card h2 {
          margin-top: 0;
          color: #333;
        }
        
        .auth-text {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .google-button {
          background-color: white;
          color: #444;
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          cursor: pointer;
          transition: background-color 0.2s, box-shadow 0.2s;
        }
        
        .google-button:hover {
          background-color: #f8f8f8;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .google-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-top-color: #0070f3;
          border-radius: 50%;
          animation: spin 1s infinite linear;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .auth-info {
          font-size: 0.85rem;
          color: #777;
          margin-top: 1.5rem;
        }
        
        .auth-link {
          color: #0070f3;
          text-decoration: none;
        }
        
        .auth-link:hover {
          text-decoration: underline;
        }
        
        .auth-help {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        
        .error-message {
          background-color: #ffeaea;
          border: 1px solid #ffcfcf;
          color: #d63031;
          padding: 0.75rem 1rem;
          border-radius: 0.25rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
      `}</style>
    </>
  );
} 