'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function ArticlesPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('articles', '');
  }, [setCurrentPath]);

  return (
    <>
      {/* Standardized header - exact same structure across all articles */}
      <header className="page-header">
        <h1 className="page-title">Educational Articles</h1>
        <p className="page-description">
          Stay updated with the latest news, research, and insights in education
        </p>
      </header>
      
      {/* Standardized tab navigation - exact same structure across all articles */}
      <div className="tabs-container">
        <nav className="tabs-navigation">
          <Link href="/articles/edtech" className="tab-button">EdTech News</Link>
          <Link href="/articles/legislation" className="tab-button">Legislation</Link>
          <Link href="/articles/mind-matters" className="tab-button">Mind Matters</Link>
        </nav>
      </div>
      
      {/* Info paragraph - explicitly centered */}
      <section className="content-section centered-content">
        <p>Select a category above to browse our latest articles, or explore the featured content below.</p>
      </section>
      
      {/* Standardized content - left-aligned like other articles pages */}
      <section className="content-section">
        <h2>Featured Articles</h2>
        <div className="card-grid">
          <div>
            <h3>EdTech News</h3>
            <p>The latest trends and innovations in educational technology.</p>
            <Link href="/articles/edtech">Read EdTech News</Link>
          </div>
          
          <div>
            <h3>Legislation</h3>
            <p>Updates on educational policies and legislative changes affecting teachers.</p>
            <Link href="/articles/legislation">Read Legislation Updates</Link>
          </div>
          
          <div>
            <h3>Mind Matters</h3>
            <p>Insights on brain development, learning sciences, and mental health in education.</p>
            <Link href="/articles/mind-matters">Explore Mind Matters</Link>
          </div>
        </div>
      </section>
    </>
  );
} 