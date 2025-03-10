'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function DigitalTechResourcesPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section without a subsection
  useEffect(() => {
    setCurrentPath('digital-tech-resources', '');
  }, [setCurrentPath]);

  return (
    <>
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / 
          <span>Digital/Tech Resources</span>
        </div>
      </div>
      
      <header className="page-header">
        <h1 className="page-title">Digital & Tech Resources</h1>
        <p className="page-description">
          Explore our collection of educational technology tools and digital resources to enhance your teaching
        </p>
      </header>
      
      <section className="content-section">
        <h2>Teaching in the Digital Age</h2>
        <p>
          Modern education is increasingly empowered by technology. Our curated digital resources help 
          educators leverage the latest tools to create engaging, effective learning experiences for students of all ages.
        </p>
      </section>
      
      <section className="content-section">
        <h2>Resource Categories</h2>
        <div className="card-grid">
          <div>
            <h3>AI Tools</h3>
            <p>Artificial intelligence tools to streamline your workflow and enhance student learning</p>
            <Link href="/digital-tech-resources/ai-tools">
              Explore AI Tools
            </Link>
          </div>
          
          <div>
            <h3>Teaching Apps</h3>
            <p>Mobile and desktop applications designed specifically for educational use</p>
            <Link href="/digital-tech-resources/teaching-apps">
              Discover Teaching Apps
            </Link>
          </div>
          
          <div>
            <h3>Educational Games</h3>
            <p>Learning games that make education fun and engaging for students</p>
            <Link href="/digital-tech-resources/educational-games">
              Browse Educational Games
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 