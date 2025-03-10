'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function ResourcesPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('resources', '');
  }, [setCurrentPath]);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Teacher Resources</h1>
        <p className="page-description">
          Curated tools and materials to enhance your teaching practice
        </p>
      </header>
      
      <section className="content-section">
        <h2>Resource Collections</h2>
        <p>
          Our resource collections are carefully curated to help you find the best tools, 
          templates, and materials for your classroom needs.
        </p>
      </section>
      
      <section className="content-section">
        <h2>Coming Soon</h2>
        <div className="card-grid">
          <div>
            <h3>Printable Worksheets</h3>
            <p>Ready-to-use worksheets across all subjects and grade levels.</p>
          </div>
          
          <div>
            <h3>Assessment Tools</h3>
            <p>Resources for creating and administering effective assessments.</p>
          </div>
          
          <div>
            <h3>Classroom Management</h3>
            <p>Tools and strategies for organizing and managing your classroom.</p>
          </div>
          
          <div>
            <h3>Digital Teaching Tools</h3>
            <p>Curated software and online platforms for modern educators.</p>
          </div>
          
          <div>
            <h3>Professional Development</h3>
            <p>Resources to enhance your teaching skills and career growth.</p>
          </div>
          
          <div>
            <h3>Special Education</h3>
            <p>Materials designed for inclusive and special education classrooms.</p>
          </div>
        </div>
      </section>
    </>
  );
} 