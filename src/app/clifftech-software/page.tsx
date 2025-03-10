'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function CliffTechSoftwarePage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('clifftech-software', '');
  }, [setCurrentPath]);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">CliffTech Software</h1>
        <p className="page-description">
          Specialized educational software solutions for modern classrooms
        </p>
      </header>
      
      <section className="content-section">
        <h2>Educational Technology Solutions</h2>
        <p>
          CliffTech Software develops specialized educational technology solutions 
          designed to enhance teaching and learning experiences in today's classrooms.
        </p>
      </section>
      
      <section className="content-section">
        <h2>Our Products</h2>
        <div className="card-grid">
          <div>
            <h3>Educational Tools</h3>
            <p>Software tools designed to enhance teaching and learning.</p>
            <ul className="feature-list">
              <li>Interactive Lesson Creator</li>
              <li>Virtual Classroom Environment</li>
              <li>Learning Content Management</li>
            </ul>
            <Link href="/clifftech-software/educational-tools">Learn More</Link>
          </div>
          
          <div>
            <h3>Assessment Systems</h3>
            <p>Comprehensive testing and evaluation software for educators.</p>
            <ul className="feature-list">
              <li>Automated Grading Solutions</li>
              <li>Test Creation Tools</li>
              <li>Progress Tracking Dashboards</li>
            </ul>
            <Link href="/clifftech-software/assessment-systems">Learn More</Link>
          </div>
          
          <div>
            <h3>Learning Analytics</h3>
            <p>Data-driven insights to improve educational outcomes.</p>
            <ul className="feature-list">
              <li>Student Performance Metrics</li>
              <li>Engagement Analysis</li>
              <li>Personalized Learning Recommendations</li>
            </ul>
            <Link href="/clifftech-software/learning-analytics">Learn More</Link>
          </div>
        </div>
      </section>
      
      <section className="content-section">
        <h2>Why Choose CliffTech</h2>
        <ul className="feature-list">
          <li>Designed by educators for educators</li>
          <li>Integration with existing educational platforms</li>
          <li>Data privacy and security focus</li>
          <li>Ongoing support and training resources</li>
          <li>Regular updates based on educator feedback</li>
        </ul>
      </section>
    </>
  );
} 