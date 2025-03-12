'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  features: string[];
  description: string;
  buttonText: string;
  popular?: boolean;
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const { setCurrentPath, showNotification } = useAppContext();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  
  useEffect(() => {
    setCurrentPath('account', 'subscription');
    
    // Simulate checking user's current plan
    // In a real app, this would come from your database
    if (session) {
      setCurrentPlan('free');
    }
  }, [setCurrentPath, session]);
  
  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Basic features for educators just getting started',
      features: [
        'Access to demo lesson plans',
        'Limited AI generations',
        'Basic profile customization',
        'Community forum access'
      ],
      buttonText: 'Current Plan',
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      description: 'Everything you need for regular lesson planning',
      features: [
        '50 AI-generated lesson plans per month',
        'Save up to 100 lesson plans',
        'Export as PDF',
        'Email support',
        'Remove watermarks'
      ],
      popular: true,
      buttonText: 'Upgrade',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      description: 'Advanced features for power users',
      features: [
        'Unlimited AI-generated lesson plans',
        'Unlimited storage',
        'Export in all formats',
        'Priority support',
        'Collaboration with 3 team members',
        'Advanced customization options',
        'Early access to new features'
      ],
      buttonText: 'Upgrade',
    },
  ];
  
  const handleSubscribe = (tierId: string) => {
    if (!session) {
      showNotification('Please sign in to subscribe');
      router.push('/api/auth/signin?callbackUrl=/subscription');
      return;
    }
    
    if (tierId === currentPlan) {
      showNotification('You are already subscribed to this plan');
      return;
    }
    
    // This is where you would integrate with your payment provider
    // For now, we'll just show a notification
    showNotification('Subscription feature coming soon!');
  };
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Subscription Plans</h1>
        <p className="page-description">
          Choose the plan that works best for you
        </p>
      </header>
      
      <section className="content-section">
        <div className="subscription-notice">
          <h3>🚀 Coming Soon!</h3>
          <p>
            Our subscription plans are currently in development and will be available soon. 
            This page demonstrates how the subscription system will work.
          </p>
          <p>
            In the meantime, all registered users have access to the demo features.
          </p>
        </div>
        
        {!session && (
          <div className="auth-notice">
            <p>
              You need to <Link href="/api/auth/signin?callbackUrl=/subscription">sign in</Link> to subscribe to a plan.
            </p>
          </div>
        )}
        
        <div className="pricing-container">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`pricing-tier ${tier.popular ? 'popular' : ''} ${tier.id === currentPlan ? 'current' : ''}`}
            >
              {tier.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{tier.name}</h3>
              <div className="price">{tier.price}<span className="period">/month</span></div>
              <p className="description">{tier.description}</p>
              <ul className="features">
                {tier.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <button 
                className={`subscription-button ${tier.id === currentPlan ? 'current-plan' : ''}`}
                onClick={() => handleSubscribe(tier.id)}
                disabled={tier.id === currentPlan}
              >
                {tier.id === currentPlan ? 'Current Plan' : tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>
      
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>Can I cancel my subscription at any time?</h3>
            <p>Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
          </div>
          <div className="faq-item">
            <h3>How do the AI credits work?</h3>
            <p>Each plan comes with a certain number of AI-generated lesson plans per month. Once you've used your allocation, you can purchase additional credits or wait for your next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h3>Can I upgrade or downgrade my plan?</h3>
            <p>Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the change will take effect at the end of your current billing cycle.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and school purchase orders for educational institutions.</p>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .subscription-notice {
          background-color: #fff8e6;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-left: 4px solid #ffc107;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .subscription-notice h3 {
          margin-top: 0;
          color: #b45309;
        }
        
        .auth-notice {
          background-color: #f0f7ff;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-left: 4px solid #0070f3;
          text-align: center;
          font-size: 1.1rem;
        }
        
        .pricing-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          margin: 2rem 0;
        }
        
        .pricing-tier {
          background-color: white;
          border-radius: 10px;
          padding: 2rem;
          width: 300px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .pricing-tier:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .pricing-tier.popular {
          border: 2px solid #0070f3;
          transform: scale(1.05);
        }
        
        .pricing-tier.popular:hover {
          transform: scale(1.05) translateY(-5px);
        }
        
        .pricing-tier.current {
          border: 2px solid #10b981;
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background-color: #0070f3;
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .pricing-tier h3 {
          margin-top: 0;
          font-size: 1.5rem;
          color: #333;
        }
        
        .price {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 1rem 0;
          color: #0070f3;
        }
        
        .period {
          font-size: 1rem;
          color: #6b7280;
          font-weight: normal;
        }
        
        .description {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        
        .features {
          list-style-type: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }
        
        .features li {
          margin-bottom: 0.75rem;
          color: #4b5563;
        }
        
        .subscription-button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 6px;
          background-color: #0070f3;
          color: white;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .subscription-button:hover {
          background-color: #005ad1;
        }
        
        .subscription-button.current-plan {
          background-color: #10b981;
          cursor: default;
        }
        
        .subscription-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .faq-section {
          margin-top: 4rem;
        }
        
        .faq-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .faq-item {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .faq-item h3 {
          margin-top: 0;
          color: #111827;
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .pricing-container {
            flex-direction: column;
            align-items: center;
          }
          
          .pricing-tier {
            width: 100%;
            max-width: 400px;
          }
          
          .pricing-tier.popular {
            transform: none;
            order: -1;
          }
          
          .faq-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
} 