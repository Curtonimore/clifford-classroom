'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function WorksheetGenerator() {
  const { setCurrentPath } = useAppContext();
  
  useEffect(() => {
    setCurrentPath('ai-teaching-tools', 'worksheet-generator');
  }, [setCurrentPath]);
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Worksheet Generator</h1>
        <p className="page-description">
          Coming Soon: AI-powered worksheet creation tool
        </p>
      </header>
      
      <section className="content-section coming-soon">
        <div className="coming-soon-container">
          <h2 className="coming-soon-title">Coming Soon!</h2>
          <p className="coming-soon-description">
            We're hard at work building our AI-powered Worksheet Generator tool.
            This tool will help you create customized worksheets for any subject and grade level.
          </p>
          
          <h3>What to Expect</h3>
          <ul className="feature-list">
            <li>Create worksheets aligned to curriculum standards</li>
            <li>Generate customized worksheets for any subject</li>
            <li>Tailor difficulty levels to your students' needs</li>
            <li>Include various question types (multiple choice, short answer, etc.)</li>
            <li>Instantly download and print your worksheets</li>
          </ul>
          
          <div className="notification-box">
            <h3>Want to be notified when this feature launches?</h3>
            <p>Sign up for our newsletter to be the first to know when new tools become available.</p>
            <Link href="/support" className="notification-button">
              Contact Us
            </Link>
          </div>
          
          <div className="back-link">
            <Link href="/ai-teaching-tools">
              &larr; Back to AI Teaching Tools
            </Link>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .coming-soon-container {
          max-width: 800px;
          margin: 2rem auto;
          background-color: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .coming-soon-title {
          font-size: 2.5rem;
          margin-top: 0;
          color: #0070f3;
          text-align: center;
        }
        
        .coming-soon-description {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #666;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .feature-list {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }
        
        .feature-list li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
        
        .notification-box {
          background-color: #f0f7ff;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .notification-box h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #0070f3;
        }
        
        .notification-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 0.25rem;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          margin-top: 0.5rem;
          transition: background-color 0.2s;
        }
        
        .notification-button:hover {
          background-color: #0053b3;
        }
        
        .back-link {
          text-align: center;
          margin-top: 2rem;
        }
        
        .back-link a {
          color: #0070f3;
          text-decoration: none;
        }
        
        .back-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
} 