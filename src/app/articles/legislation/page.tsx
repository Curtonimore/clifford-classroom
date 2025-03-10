'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function LegislationPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section and subsection
  useEffect(() => {
    setCurrentPath('articles', 'legislation');
  }, [setCurrentPath]);

  return (
    <>
      {/* Standardized breadcrumb - exact same structure across all articles */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / 
          <Link href="/articles">Articles</Link> / 
          <span>Legislation</span>
        </div>
      </div>
      
      {/* Standardized header - exact same structure across all articles */}
      <header className="page-header">
        <h1 className="page-title">Education Legislation</h1>
        <p className="page-description">
          Updates on educational policies and legislative changes affecting teachers
        </p>
      </header>
      
      {/* Standardized tab navigation - exact same structure across all articles */}
      <div className="tabs-container">
        <nav className="tabs-navigation">
          <Link href="/articles/edtech" className="tab-button">EdTech News</Link>
          <Link href="/articles/legislation" className="tab-button active">Legislation</Link>
          <Link href="/articles/mind-matters" className="tab-button">Mind Matters</Link>
        </nav>
      </div>
      
      {/* Standardized content - exact same structure across all articles */}
      <section className="content-section">
        <h2>Policy Updates</h2>
        <p>Articles coming soon. This section will feature updates on educational policies and legislative changes that affect teachers and schools.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Sample Article Topics</h3>
          <ul className="feature-list">
            <li>New Federal Education Funding Initiatives</li>
            <li>State-Level Curriculum Policy Changes</li>
            <li>Special Education Law Updates</li>
            <li>Teacher Certification Requirement Changes</li>
            <li>Digital Privacy Laws in Educational Settings</li>
          </ul>
        </div>
      </section>
    </>
  );
} 