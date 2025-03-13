'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const { setCurrentPath, showNotification } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    tier: string;
    expiresAt: string;
  } | null>(null);
  
  useEffect(() => {
    setCurrentPath('subscription', 'success');
    
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/subscription');
      return;
    }
    
    // Get the session ID from the URL
    const sessionId = searchParams?.get('session_id');
    
    if (!sessionId) {
      router.push('/subscription');
      return;
    }
    
    // Verify the subscription was successful
    const verifySubscription = async () => {
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify subscription');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Set subscription details
          setSubscriptionDetails({
            tier: data.tier,
            expiresAt: new Date(data.expiresAt).toLocaleDateString(),
          });
          
          // Update session with new user data
          if (session) {
            await update({
              ...session,
              user: {
                ...session.user,
                role: data.tier === 'premium' ? 'premium' : 'user',
              },
            });
          }
          
          showNotification(`Successfully subscribed to the ${data.tier} plan!`);
        } else {
          throw new Error(data.error || 'Subscription verification failed');
        }
      } catch (error: any) {
        console.error('Error verifying subscription:', error);
        showNotification(error.message || 'Failed to verify subscription');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user) {
      verifySubscription();
    } else if (status === 'loading') {
      // Wait for session to load
    } else {
      setIsLoading(false);
    }
  }, [searchParams, router, session, status, setCurrentPath, showNotification, update]);
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Subscription Successful</h1>
        <p className="page-description">
          Thank you for subscribing to Clifford Classroom
        </p>
      </header>
      
      <section className="content-section">
        <div className="success-container">
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Verifying your subscription...</p>
            </div>
          ) : (
            <>
              <div className="success-icon">✓</div>
              <h2>Payment Successful!</h2>
              
              {subscriptionDetails ? (
                <div className="subscription-details">
                  <p>
                    You are now subscribed to the <strong>{subscriptionDetails.tier}</strong> plan.
                  </p>
                  <p>
                    Your subscription is active until: <strong>{subscriptionDetails.expiresAt}</strong>
                  </p>
                </div>
              ) : (
                <p>Your subscription has been activated successfully.</p>
              )}
              
              <div className="next-steps">
                <h3>Next Steps</h3>
                <ul>
                  <li>Create new lesson plans with your additional credits</li>
                  <li>Explore premium features available in your subscription</li>
                  <li>Set up your profile preferences</li>
                </ul>
              </div>
              
              <div className="action-buttons">
                <Link href="/dashboard" className="primary-button">
                  Go to Dashboard
                </Link>
                <Link href="/subscription" className="secondary-button">
                  View Subscription Details
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      <style jsx>{`
        .success-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 3rem 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .success-icon {
          font-size: 3rem;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ecfdf5;
          color: #10b981;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
        }
        
        h2 {
          font-size: 1.8rem;
          color: #111827;
          margin-bottom: 1.5rem;
        }
        
        .subscription-details {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 6px;
          margin-bottom: 2rem;
        }
        
        .subscription-details p {
          margin: 0.5rem 0;
        }
        
        .next-steps {
          text-align: left;
          margin: 2rem 0;
        }
        
        .next-steps h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .next-steps ul {
          padding-left: 1.5rem;
        }
        
        .next-steps li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
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