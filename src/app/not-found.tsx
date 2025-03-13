'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="home-link">
          Return to Home
        </Link>
      </div>
      
      <style jsx>{`
        .not-found-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 0 1rem;
        }
        
        .not-found-content {
          max-width: 600px;
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .not-found-content h1 {
          color: #3182ce;
          margin-bottom: 1rem;
        }
        
        .not-found-content p {
          color: #4a5568;
          margin-bottom: 2rem;
        }
        
        .home-link {
          padding: 0.5rem 1.5rem;
          background-color: #3182ce;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          display: inline-block;
        }
        
        .home-link:hover {
          background-color: #2c5282;
        }
      `}</style>
    </div>
  );
} 