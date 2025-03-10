'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function SupportPage() {
  const { setCurrentPath, showNotification } = useAppContext();
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('support', '');
  }, [setCurrentPath]);

  const handleSupportClick = () => {
    showNotification('Support options coming soon!');
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Support Clifford Classroom</h1>
        <p className="page-description">
          Help us continue to provide valuable resources for educators
        </p>
      </header>
      
      <section className="content-section">
        <h2>Why Support Us</h2>
        <p>
          Clifford Classroom is dedicated to providing high-quality resources and tools 
          for educators. Your support helps us maintain and expand our offerings, keeping them 
          accessible to teachers everywhere.
        </p>
      </section>
      
      <section className="content-section">
        <h2>Support Options</h2>
        <div className="card-grid">
          <div>
            <h3>Monthly Subscription</h3>
            <p>Support our mission with a monthly contribution and get access to premium resources.</p>
            <button onClick={handleSupportClick} className="login-button">Coming Soon</button>
          </div>
          
          <div>
            <h3>One-Time Donation</h3>
            <p>Make a one-time contribution of any amount to support our efforts.</p>
            <button onClick={handleSupportClick} className="login-button">Coming Soon</button>
          </div>
          
          <div>
            <h3>Spread the Word</h3>
            <p>Share Clifford Classroom with your colleagues and on social media.</p>
            <button onClick={handleSupportClick} className="login-button">Coming Soon</button>
          </div>
        </div>
      </section>
      
      <section className="content-section">
        <h2>How Your Support Helps</h2>
        <ul className="feature-list">
          <li>Develop new educational tools and resources</li>
          <li>Improve our AI-powered lesson plan generator</li>
          <li>Create more high-quality content for educators</li>
          <li>Keep resources accessible to teachers everywhere</li>
          <li>Expand our offerings to meet more educational needs</li>
        </ul>
      </section>
    </>
  );
} 