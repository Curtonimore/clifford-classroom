'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function SubscriptionCanceledPage() {
  const router = useRouter();
  const { setCurrentPath } = useAppContext();
  
  useEffect(() => {
    setCurrentPath('subscription', 'canceled');
  }, [setCurrentPath]);
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Subscription Canceled</h1>
        <p className="page-description">
          Your subscription process was not completed
        </p>
      </header>
      
      <section className="content-section">
        <div className="canceled-container">
          <div className="canceled-icon">×</div>
          <h2>Payment Canceled</h2>
          <p>Your subscription payment was not completed. No charges have been made to your account.</p>
          
          <div className="reasons">
            <h3>Common Reasons for Cancellation:</h3>
            <ul>
              <li>You decided to choose a different subscription plan</li>
              <li>You encountered a payment processing error</li>
              <li>You wanted to review the terms again</li>
              <li>You simply changed your mind</li>
            </ul>
          </div>
          
          <p className="support-text">
            If you encountered a technical issue, please reach out to our support team for assistance.
          </p>
          
          <div className="action-buttons">
            <Link href="/subscription" className="primary-button">
              Back to Subscription Plans
            </Link>
            <Link href="/support" className="secondary-button">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .canceled-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 3rem 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .canceled-icon {
          font-size: 3rem;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fef2f2;
          color: #ef4444;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
        }
        
        h2 {
          font-size: 1.8rem;
          color: #111827;
          margin-bottom: 1rem;
        }
        
        p {
          color: #4b5563;
          margin-bottom: 1.5rem;
        }
        
        .reasons {
          text-align: left;
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 6px;
          margin: 2rem 0;
        }
        
        .reasons h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .reasons ul {
          padding-left: 1.5rem;
        }
        
        .reasons li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        .support-text {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .primary-button {
          padding: 0.625rem 1.25rem;
          background: #3b82f6;
          color: white;
          border-radius: 0.375rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s;
        }
        
        .primary-button:hover {
          background: #2563eb;
        }
        
        .secondary-button {
          padding: 0.625rem 1.25rem;
          background: white;
          color: #4b5563;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .secondary-button:hover {
          background: #f3f4f6;
          color: #111827;
        }
        
        @media (max-width: 600px) {
          .action-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .primary-button, .secondary-button {
            display: block;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
} 