'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Something went wrong</h1>
        <p>We're sorry, but there was an error processing your request.</p>
        <div className="error-actions">
          <button
            onClick={() => reset()}
            className="reset-button"
          >
            Try again
          </button>
          <Link href="/" className="home-link">
            Return to home
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 0 1rem;
        }
        
        .error-content {
          max-width: 600px;
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .error-content h1 {
          color: #e53e3e;
          margin-bottom: 1rem;
        }
        
        .error-content p {
          color: #4a5568;
          margin-bottom: 2rem;
        }
        
        .error-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .reset-button {
          padding: 0.5rem 1.5rem;
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .reset-button:hover {
          background-color: #2c5282;
        }
        
        .home-link {
          padding: 0.5rem 1.5rem;
          background-color: #e2e8f0;
          color: #4a5568;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
        }
        
        .home-link:hover {
          background-color: #cbd5e0;
        }
      `}</style>
    </div>
  );
} 