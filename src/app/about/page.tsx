'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function AboutPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('about', '');
  }, [setCurrentPath]);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">About Us</h1>
        <p className="page-description">
          The story behind Clifford Classroom
        </p>
      </header>
      
      <section className="content-section">
        <h2>Our Mission</h2>
        <p>
          Started by a Shawnee Elementary teacher to help educators access quality resources,
          tools, and insights to enhance their teaching practice and student outcomes.
        </p>
      </section>
      
      <section className="content-section">
        <h2>What We Do</h2>
        <p>
          At Clifford Classroom, we're dedicated to providing educators with innovative tools 
          and resources to make teaching more effective and enjoyable.
        </p>
        <p>
          Our platform offers lesson planning tools, educational articles, teaching resources,
          and specialized software designed for the unique needs of modern educators.
        </p>
      </section>
      
      <section className="content-section">
        <h2>Our Values</h2>
        <ul className="feature-list">
          <li>Simplicity in design and functionality</li>
          <li>Quality resources that save teachers time</li>
          <li>Innovation in educational technology</li>
          <li>Community support and collaboration</li>
        </ul>
      </section>
    </>
  );
} 