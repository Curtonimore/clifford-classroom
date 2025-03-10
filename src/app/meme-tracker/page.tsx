'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function MemeTrackerPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('meme-tracker', '');
  }, [setCurrentPath]);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Meme Tracker</h1>
        <p className="page-description">
          Stay current with educational memes and social media trends in education
        </p>
      </header>
      
      <section className="content-section">
        <h2>Social Media Trends</h2>
        <p>
          Explore the latest memes, viral content, and social media trends in education.
        </p>
        
        <div className="content-grid">
          <div>
            <h3>Trending Memes</h3>
            <p>Latest educational memes and viral content in the teaching community.</p>
            <ul className="feature-list">
              <li>Teacher Memes</li>
              <li>Student Life</li>
              <li>Education Humor</li>
            </ul>
          </div>
          
          <div>
            <h3>Meme Origins</h3>
            <p>Understanding the history and meaning behind popular educational memes.</p>
            <ul className="feature-list">
              <li>Meme History</li>
              <li>Cultural Context</li>
              <li>Evolution of Trends</li>
            </ul>
          </div>
          
          <div>
            <h3>Social Media</h3>
            <p>Educational trends and slang from various social media platforms.</p>
            <ul className="feature-list">
              <li>Twitter Trends</li>
              <li>Instagram Education</li>
              <li>TikTok Learning</li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', borderLeft: '3px solid var(--accent)' }}>
          <p style={{ color: '#000000', fontWeight: '500' }}>
            <strong>Tip:</strong> Use the navigation menu to explore different categories of educational memes and social media content.
          </p>
        </div>
      </section>
    </>
  );
} 