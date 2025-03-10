'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function EdTechNewsPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section and subsection
  useEffect(() => {
    setCurrentPath('articles', 'edtech');
  }, [setCurrentPath]);

  return (
    <>
      {/* Standardized breadcrumb - exact same structure across all articles */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / 
          <Link href="/articles">Articles</Link> / 
          <span>EdTech News</span>
        </div>
      </div>
      
      {/* Standardized header - exact same structure across all articles */}
      <header className="page-header">
        <h1 className="page-title">EdTech News</h1>
        <p className="page-description">
          Stay updated with the latest trends and innovations in educational technology
        </p>
      </header>
      
      {/* Standardized tab navigation - exact same structure across all articles */}
      <div className="tabs-container">
        <nav className="tabs-navigation">
          <Link href="/articles/edtech" className="tab-button active">EdTech News</Link>
          <Link href="/articles/legislation" className="tab-button">Legislation</Link>
          <Link href="/articles/mind-matters" className="tab-button">Mind Matters</Link>
        </nav>
      </div>
      
      {/* Standardized content - exact same structure across all articles */}
      <section className="content-section">
        <h2>Latest EdTech News</h2>
        <p>Articles coming soon. This section will feature the latest news and trends in educational technology.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Sample Article Topics</h3>
          <ul className="feature-list">
            <li>AI Tools for Education: What's New in 2023</li>
            <li>Virtual Reality in the Classroom: Beyond the Hype</li>
            <li>How Teachers Are Using ChatGPT to Transform Learning</li>
            <li>The Digital Divide: Ensuring Technology Access for All Students</li>
            <li>EdTech Startups to Watch This Year</li>
          </ul>
        </div>
      </section>
    </>
  );
} 