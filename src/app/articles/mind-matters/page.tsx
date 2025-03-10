'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function MindMattersPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section and subsection
  useEffect(() => {
    setCurrentPath('articles', 'mind-matters');
  }, [setCurrentPath]);

  return (
    <>
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / 
          <Link href="/articles">Articles</Link> / 
          <span>Mind Matters</span>
        </div>
      </div>
      
      <header className="page-header">
        <h1 className="page-title">Mind Matters</h1>
        <p className="page-description">
          Brain development, learning sciences, and mental health in education
        </p>
      </header>
      
      <div className="tabs-container">
        <nav className="tabs-navigation">
          <Link href="/articles/edtech" className="tab-button">EdTech News</Link>
          <Link href="/articles/legislation" className="tab-button">Legislation</Link>
          <Link href="/articles/mind-matters" className="tab-button active">Mind Matters</Link>
        </nav>
      </div>
      
      <section className="content-section">
        <h2>Brain Development & Learning</h2>
        <p>Articles coming soon. This section will feature insights on brain development, cognitive research, and learning sciences.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Sample Article Topics</h3>
          <ul className="feature-list">
            <li>How the Brain Learns: Latest Research Findings</li>
            <li>Supporting Students with Learning Differences</li>
            <li>Cognitive Development Stages in Education</li>
            <li>Mindfulness Practices for Classroom Settings</li>
            <li>Mental Health Resources for Educators</li>
          </ul>
        </div>
      </section>
    </>
  );
} 