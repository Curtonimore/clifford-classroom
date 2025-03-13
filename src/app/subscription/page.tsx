'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

// Define subscription tiers
const SUBSCRIPTION_TIERS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$5.99',
    period: 'month',
    features: [
      'Up to 100 lesson plans',
      'PDF exports',
      '30 AI credits per month',
      'Email support'
    ],
    recommended: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$12.99',
    period: 'month',
    features: [
      'Unlimited lesson plans',
      'Advanced customization options',
      '150 AI credits per month',
      'Priority support',
      'Export in all formats',
      'Collaborative sharing'
    ],
    recommended: true
  }
];

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setCurrentPath, showNotification } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  
  useEffect(() => {
    setCurrentPath('subscription', '');
  }, [setCurrentPath]);
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/subscription');
    }
  }, [status, router]);
  
  // Function to initiate checkout
  const handleSubscribe = async (tierId: string) => {
    if (status !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=/subscription');
      return;
    }
    
    setProcessingTier(tierId);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: tierId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      showNotification(error.message || 'Failed to create checkout session');
      setIsLoading(false);
      setProcessingTier(null);
    }
  };
  
  // Get user's current subscription tier
  const currentTier = session?.user?.role === 'premium' 
    ? 'premium' 
    : session?.user?.role === 'admin' ? 'admin' : 'free';
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Subscription Plans</h1>
        <p className="page-description">
          Choose the plan that works best for you
        </p>
      </header>
      
      <section className="content-section">
        <div className="subscription-container">
          {/* Current subscription status */}
          <div className="current-subscription">
            <h2>Your Current Plan</h2>
            <div className="current-tier">
              <span className={`plan-badge plan-${currentTier}`}>
                {currentTier === 'admin'
                  ? 'Admin (Unlimited Access)'
                  : currentTier === 'premium'
                  ? 'Premium'
                  : 'Free'}
              </span>
            </div>
            {currentTier === 'premium' && (
              <p className="expiry-info">
                Your premium subscription is active.
              </p>
            )}
          </div>
          
          {/* Subscription tiers */}
          <div className="subscription-tiers">
            <div className="free-tier">
              <div className="tier-header">
                <h3>Free</h3>
                <div className="tier-price">$0</div>
              </div>
              <ul className="tier-features">
                <li>5 lesson plans</li>
                <li>5 AI credits</li>
                <li>Basic customization</li>
              </ul>
              <div className="tier-action">
                <span className="current-plan-label">Current Plan</span>
              </div>
            </div>
            
            {SUBSCRIPTION_TIERS.map((tier) => (
              <div 
                key={tier.id} 
                className={`subscription-tier ${tier.recommended ? 'recommended' : ''}`}
              >
                {tier.recommended && (
                  <div className="recommended-badge">Recommended</div>
                )}
                <div className="tier-header">
                  <h3>{tier.name}</h3>
                  <div className="tier-price">
                    {tier.price}
                    <span className="price-period">/{tier.period}</span>
                  </div>
                </div>
                <ul className="tier-features">
                  {tier.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <div className="tier-action">
                  {currentTier === 'admin' ? (
                    <button className="admin-button" disabled>
                      Admin Access
                    </button>
                  ) : currentTier === tier.id ? (
                    <span className="current-plan-label">Current Plan</span>
                  ) : (
                    <button 
                      className="subscribe-button"
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={isLoading || processingTier !== null}
                    >
                      {isLoading && processingTier === tier.id ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        `Subscribe to ${tier.name}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* FAQs */}
          <div className="subscription-faqs">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item">
              <h3>Can I cancel anytime?</h3>
              <p>Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept all major credit cards through our secure payment processor, Stripe.</p>
            </div>
            <div className="faq-item">
              <h3>What happens to my content if I downgrade?</h3>
              <p>Your content remains saved, but you'll have limited access to premium features and won't be able to create new content beyond your plan's limits.</p>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .subscription-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        
        .current-subscription {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .current-tier {
          margin-top: 1rem;
        }
        
        .plan-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .plan-free {
          background-color: #e5e7eb;
          color: #4b5563;
        }
        
        .plan-premium {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .plan-admin {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .expiry-info {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .subscription-tiers {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .free-tier, .subscription-tier {
          flex: 1;
          min-width: 250px;
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .subscription-tier.recommended {
          border: 2px solid #3b82f6;
          transform: scale(1.02);
          z-index: 1;
        }
        
        .recommended-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #3b82f6;
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .tier-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .tier-header h3 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .tier-price {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
        }
        
        .price-period {
          font-size: 1rem;
          font-weight: 400;
          color: #6b7280;
        }
        
        .tier-features {
          margin: 0;
          padding: 0;
          list-style-type: none;
          margin-bottom: 2rem;
          flex-grow: 1;
        }
        
        .tier-features li {
          padding: 0.5rem 0;
          color: #4b5563;
          position: relative;
          padding-left: 1.5rem;
        }
        
        .tier-features li:before {
          content: "✓";
          color: #10b981;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .tier-action {
          text-align: center;
        }
        
        .current-plan-label {
          display: inline-block;
          padding: 0.625rem 1.25rem;
          background: #f3f4f6;
          color: #4b5563;
          border-radius: 0.375rem;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .subscribe-button {
          width: 100%;
          padding: 0.625rem 1.25rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .subscribe-button:hover {
          background: #2563eb;
        }
        
        .subscribe-button:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        
        .admin-button {
          width: 100%;
          padding: 0.625rem 1.25rem;
          background: #dbeafe;
          color: #1e40af;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .subscription-faqs {
          margin-top: 3rem;
        }
        
        .faq-item {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .faq-item h3 {
          margin-top: 0;
          color: #1f2937;
          font-size: 1.125rem;
        }
        
        .faq-item p {
          margin-bottom: 0;
          color: #4b5563;
        }
        
        @media (max-width: 768px) {
          .subscription-tiers {
            flex-direction: column;
          }
          
          .subscription-tier.recommended {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
} 