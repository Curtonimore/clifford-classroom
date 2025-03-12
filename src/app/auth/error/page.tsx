'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function AuthError() {
  const { setCurrentPath } = useAppContext();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'Default Error';
  
  useEffect(() => {
    setCurrentPath('auth', 'error');
  }, [setCurrentPath]);
  
  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'AccessDenied':
        return 'Access denied. You may not have permission to sign in.';
      case 'Verification':
        return 'The sign in link is no longer valid. It may have been used already or it may have expired.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another sign in method. Please use the original sign in method.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
      case 'OAuthProfileTokenError':
      case 'EmailSignin':
      case 'CredentialsSignin':
      case 'SessionRequired':
        return 'An error occurred during the authentication process. Please try again.';
      case 'Default Error':
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
  };
  
  const errorMessage = getErrorMessage(error);
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Authentication Error</h1>
        <p className="page-description">
          There was a problem signing you in
        </p>
      </header>
      
      <section className="content-section">
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            
            <h2 className="error-title">Authentication Error</h2>
            <p className="error-message">{errorMessage}</p>
            
            <div className="error-actions">
              <Link href="/auth/signin" className="button-primary">
                Try Again
              </Link>
              <Link href="/" className="button-secondary">
                Return Home
              </Link>
            </div>
            
            <p className="error-help">
              Need help? <Link href="/support" className="error-link">Contact Support</Link>
            </p>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .error-container {
          max-width: 500px;
          margin: 2rem auto;
        }
        
        .error-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .error-icon {
          color: #d63031;
          margin-bottom: 1.5rem;
        }
        
        .error-title {
          color: #333;
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .error-message {
          color: #666;
          margin-bottom: 2rem;
        }
        
        .error-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .button-primary {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 0.25rem;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .button-primary:hover {
          background-color: #0053b3;
        }
        
        .button-secondary {
          background-color: white;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s, border-color 0.2s;
        }
        
        .button-secondary:hover {
          background-color: #f8f8f8;
          border-color: #ccc;
        }
        
        .error-help {
          font-size: 0.9rem;
          color: #777;
          margin-top: 1rem;
        }
        
        .error-link {
          color: #0070f3;
          text-decoration: none;
        }
        
        .error-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
} 